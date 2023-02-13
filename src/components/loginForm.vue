<template>
  <div class="mx-auto p-12 rounded-[50px] w-min bg-primary-600">
    <div class="p-4">
      <h1 class="text-3xl font-medium mb-1">{{ $t("auth.login") }}</h1>
      <p>{{ $t("auth.fillOutYourInfo") }}</p>
      <div class="mt-12">
        <form class="space-y-5">
          <div class="w-96">
            <BaseInput
              id="email"
              type="email"
              v-model="email"
              :place-holder="$t('auth.email')"
            ></BaseInput>
          </div>
          <div class="w-96">
            <BaseInput
              id="password"
              type="password"
              v-model="password"
              :place-holder="$t('auth.password')"
            ></BaseInput>
          </div>
          <div>
            <span
              v-if="errorMessage"
              class="text-red-600 w-full ml-2 mb-4 text-xs"
              >{{ errorMessage }}</span
            >
            <BaseButton type="submit" @click="login">{{
              $t("auth.login")
            }}</BaseButton>
          </div>
          <div>
            <p class="text-primary-300 font-bold w-full mb-4 text-sm" v-html="$t('auth.dontHaveAnAccount')"></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseInput from "./baseInput.vue";
import BaseButton from "./baseButton.vue";

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
      console.log("nig");
      fetch("/api/auth/login", {
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
            localStorage.setItem('accessToken', json.accessToken);
            window.location.href = "/";
          } else {
            this.errorMessage = json.message;
          }
        })
        .catch((response) => {
          console.log(response);
          this.errorMessage = response.message;
        });
    },
  },
};
</script>
