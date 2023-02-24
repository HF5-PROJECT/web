/**
 * localForage is a fast and simple storage library for JavaScript.
 * localForage improves the offline experience of your web app
 * by using asynchronous storage (IndexedDB or WebSQL) with a simple, localStorage-like API.
 * @see https://github.com/localForage/localForage
 */
importScripts("public/lib/localforage.min.js");

/**
 * ExecutionLock
 * Acts as a lock, that can pause execution until lock is unlocked.
 * Call ExecutionLock.waitForUnlock() in all the places where execution should be paused, when locked.
 */
class ExecutionLock {
  /** @type {Boolean} */
  isLocked = false;
  /** @type {Promise<string>} */
  lockedPromise = null;
  /** @type {Number} */
  autoUnlockAfterMilliseconds = 10000;

  /**
   * Lock
   * @param {() => Promise<any>} autoUnlockCallback
   */
  lock(autoUnlockCallback) {
    this.isLocked = true;

    // Creating a promise that will resolve when ExecutionLock is unlocked. (Or autoUnlockAfterMilliseconds is exceeded)
    this.lockedPromise = new Promise((resolve, reject) => {
      let interval, timeout;

      // AutoUnlock
      timeout = setTimeout(async () => {
        clearInterval(interval);
        await autoUnlockCallback();
        this.unlock();
        resolve("autounlock");
      }, this.autoUnlockAfterMilliseconds);

      // Check if its still locked every 10 ms
      interval = setInterval(() => {
        if (!this.isLocked) {
          clearInterval(interval);
          clearTimeout(timeout);
          resolve("unlocked");
        }
      }, 10);
    });
  }

  /**
   * Unlock
   */
  unlock() {
    this.isLocked = false;
  }

  /**
   * Wait until the lock has been unlocked.
   *
   * @returns {Promise<void>}
   */
  async waitForUnlock() {
    if (!this.isLocked) {
      return;
    }

    await this.lockedPromise;
  }
}

const ACCESS_TOKEN = "overnites-access-token";
const ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED = "unauthorized";

let refreshingTokensLock = new ExecutionLock();

self.addEventListener("install", (event) => {
  // Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
  // there are still previous incarnations of this service worker registration active.
  console.log("Install!");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // Claim any clients immediately, so that the page will be under SW control without reloading.
  console.log("Activate!");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(processOnFetch(event));
});

/**
 * Process this when fetching
 *
 * @param event
 * @return {Promise<Response>}
 */
function processOnFetch(event) {
  const url = new URL(event.request.url);

  // We currently only want to do stuff with "real" requests: Navigation and API calls.
  if (
    !(
      url.hostname === self.location.hostname &&
      (event.request.mode === "navigate" || event.request.url.includes("/api/"))
    )
  ) {
    return fetch(event.request);
  }

  return processTokenOnFetch(event);
}

/**
 * Process token when fetching
 *
 * @param event
 * @return {Promise<Response>}
 */
async function processTokenOnFetch(event) {
  const url = new URL(event.request.url);

  /**
   * If url is an "authorize"
   * If this is true then we need to catch the access_token and place it in localForage.
   * We will then return the response of the api call to the client.
   */
  if (isAuthorizeUrls(url)) {
    return handleAuthorizes(event);
  }

  await refreshingTokensLock.waitForUnlock();

  let accessToken = await localforage.getItem(ACCESS_TOKEN);

  // If no accessToken is set, then we should try to refresh.
  if (accessToken === null || accessToken === undefined) {
    accessToken = await refreshTokens(event);

    /**
     * If accessToken still is null then we have confirmed that we're unauthorized.
     */
    if (accessToken === null) {
      accessToken = ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED;
      await localforage.setItem(ACCESS_TOKEN, accessToken);
    }
  }

  if (
    typeof accessToken === "string" &&
    accessToken !== ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED
  ) {
    // Getting the expiration of the access token
    let accessTokenExpiration = await (async () => {
      let decodedAndParsedJWTBody = JSON.parse(atob(accessToken.split(".")[1]));
      return decodedAndParsedJWTBody.exp;
    })();

    /**
     * If access token is expired, then we have to refresh it.
     * If the user has a valid refresh token, then this will succeed.
     * We will do this right now before handling the current request to make it as seamless as possible,
     * the user won't even notice that it has been refreshed.
     */
    if (accessTokenExpiration < getTimestampInSeconds()) {
      accessToken = await refreshTokens(event);
    }

    /**
     * If Access Token a string and is not ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED, then we can assume that it's a real JWT.
     * All we have to do now is to modify the original request and add our 'Authorization' header.
     */
    if (
      typeof accessToken === "string" &&
      accessToken !== ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED
    ) {
      const modifiedRequest = addAuthHeaderToRequest(
        event.request,
        accessToken
      );

      /**
       * If url is an "unauthorize"
       */
      if (isUnauthorizeUrls(url)) {
        return HandleUnAuthorizes(event, modifiedRequest);
      }

      return fetch(modifiedRequest);
    }
  }

  /**
   * Return unmodified, backend will handle access control and redirection if necessary
   */
  return fetch(event.request);
}

/**
 * Refresh token. Get a new accessToken.
 * Call this if old token has become invalid.
 *
 * @param {Event} event
 * @return {String} Either a valid AccessToken or ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED, depending on the validity of the refresh token.
 */
async function refreshTokens(event) {
  /**
   * Extra check before we start a refresh.
   * Check if there already is one started.
   * If there is then wait for it to complete.
   */
  if (refreshingTokensLock.isLocked) {
    await refreshingTokensLock.waitForUnlock();

    return await localforage.getItem(ACCESS_TOKEN);
  }

  /**
   * A AbortController is nessesary to be able to abort the fetch request if it takes too long to complete.
   *
   * Without the AbortController there would be chance that we would
   * get a response between AutoUnlock triggering in the ExecutionLock
   * and the fetch request timeouting at 300 seconds.
   * If this happens we would run into the Automatic reuse detection triggering in the backend.
   */
  const controller = new AbortController();

  refreshingTokensLock.lock(async () => {
    // Aborting the fetch request.
    controller.abort();
    await localforage.setItem(
      ACCESS_TOKEN,
      ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED
    );
  });

  let accessToken;
  let refreshResponse = await fetch("/api/auth/refresh", {
    method: "POST",
    signal: controller.signal,
  });
  event.waitUntil(refreshResponse);

  /**
   * Refresh token is valid, and we have received a new access token
   */
  if (refreshResponse && refreshResponse.ok) {
    let jsonResponse = await refreshResponse.json();
    accessToken = jsonResponse.access_token;
    await localforage.setItem(ACCESS_TOKEN, jsonResponse.accessToken);
  }

  /**
   * Refresh token is invalid, set to ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED
   */
  if (refreshResponse.status === 422) {
    accessToken = ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED;
    await localforage.setItem(ACCESS_TOKEN, accessToken);
  }

  refreshingTokensLock.unlock();
  return accessToken;
}

/**
 * Handle Authorizes
 *
 * @param {Event} event
 * @return {Response}
 */
async function handleAuthorizes(event) {
  let response = await fetch(event.request);
  event.waitUntil(response);

  if (response && response.ok) {
    let clone = response.clone();
    let jsonResponse = await clone.json();
    await localforage.setItem(ACCESS_TOKEN, jsonResponse.accessToken);
  }

  return response;
}

/**
 * Handle UnAuthorizes
 *
 * @param {Event} event
 * @param {Request} modifiedRequest
 * @return {Response}
 */
async function HandleUnAuthorizes(event, modifiedRequest) {
  let response = await fetch(modifiedRequest);
  event.waitUntil(response);

  if ((response && response.type === "opaqueredirect") || response.ok) {
    await localforage.setItem(
      ACCESS_TOKEN,
      ACCESS_TOKEN_CONFIRMED_UNAUTHORIZED
    );
  }

  return response;
}

/**
 * Add Authorization header to a request
 *
 * @param {Request} request
 * @param {String} accessToken
 * @return {Request}
 */
function addAuthHeaderToRequest(request, accessToken) {
  const modifiedHeaders = new Headers(request.headers);
  modifiedHeaders.append("Authorization", "Bearer " + accessToken);

  const modifiedRequestInit = { headers: modifiedHeaders, mode: "same-origin" };
  return new Request(request, modifiedRequestInit);
}

/**
 * Authorize urls is urls where a user can get authorized.
 * Urls where the response is an accessToken.
 *
 * @param {URL} url
 * @return {boolean}
 */
function isAuthorizeUrls(url) {
  const urlsExact = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
  ];

  return matchUrls(url, urlsExact);
}

/**
 * Unauthorize urls is urls where a user can get unauthorized.
 * Urls where the user is getting logged out.
 *
 * @param {URL} url
 * @return {boolean}
 */
function isUnauthorizeUrls(url) {
  const urlsExact = ["/api/auth/logout"];

  return matchUrls(url, urlsExact);
}

/**
 * Does any of the exact or contains urls match the current url?
 *
 * @param {URL} url
 * @param {String[]} exactUrls
 * @param {String[]} containsUrls
 * @return {boolean}
 */
function matchUrls(url, exactUrls = [], containsUrls = []) {
  const matchExact = exactUrls.find((element) => {
    if (url.pathname === element) {
      return true;
    }
  });
  const matchContains = containsUrls.find((element) => {
    if (url.pathname.includes(element)) {
      return true;
    }
  });

  return matchExact !== undefined || matchContains !== undefined;
}

/**
 * Timestamp in seconds instead of milliseconds
 *
 * @return {number}
 */
function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}
