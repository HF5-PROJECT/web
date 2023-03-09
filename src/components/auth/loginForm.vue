<template>
  <div class="mx-auto p-12 rounded-[50px] bg-primary-600 w-full max-w-[468px]">
    <div class="p-4">
      <h1 class="text-3xl font-medium mb-1">{{ $t("auth.login") }}</h1>
      <p>{{ $t("auth.fillOutYourInfo") }}</p>
      <div class="mt-12">
        <form class="space-y-5">
          <BaseInput
            id="email"
            type="email"
            v-model="email"
            :place-holder="$t('auth.email')"
          ></BaseInput>
          <BaseInput
            id="password"
            type="password"
            v-model="password"
            :place-holder="$t('auth.password')"
          ></BaseInput>
          <div>
            <span
              v-if="errorMessage"
              class="text-red-600 w-full ml-2 mb-4 text-xs"
              >{{ errorMessage }}</span
            >
            <BaseButton color="secondary" type="submit" @click="login">{{
              $t("auth.login")
            }}</BaseButton>
          </div>
          <div>
            <i18n-t
              keypath="auth.dontHaveAnAccount"
              scope="global"
              class="text-primary-300 font-bold w-full mb-4 text-sm"
              tag="p"
            >
              <a class="text-primary-200 underline" href="/register">{{
                $t("auth.here")
              }}</a>
            </i18n-t>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseInput from "../base/input.vue";
import BaseButton from "../base/button.vue";

export default {
  components: {
    BaseInput,
    BaseButton,
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login(): void {
      fetch(import.meta.env.PUBLIC_API_URL + "/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      })
        .then(async (response) => {
          const json = await response.json();
          if (response.status === 200) {
            window.location.href = "/";
          } else {
            this.errorMessage = json.message;
          }
        })
        .catch((response) => {
          this.errorMessage = response.message;
        });
    },
  },
};
</script>
