<template>
  <div class="mx-auto p-12 rounded-[50px] bg-primary-600">
    <div class="p-4">
      <h1 class="text-3xl font-medium mb-1">{{ $t("auth.register") }}</h1>
      <p>{{ $t("auth.fillOutYourInfo") }}</p>
      <div class="mt-12">
        <form class="space-y-5">
          <BaseInput
            id="name"
            type="text"
            v-model="name"
            :place-holder="$t('auth.name')"
            :auto-focus="true"
          ></BaseInput>
          <BaseInput
            id="email"
            type="email"
            v-model="email"
            :place-holder="$t('auth.email')"
          ></BaseInput>
          <BaseInput
            id="password"
            type="password"
            min="8"
            v-model="password"
            :place-holder="$t('auth.password')"
          ></BaseInput>
          <BaseInput
            id="passwordConfirm"
            type="password"
            min="8"
            v-model="confirmPassword"
            :error-text="passwordConfirmErrorMessage"
            :place-holder="$t('auth.confirmPassword')"
          ></BaseInput>
          <div>
            <p class="text-red-500 w-full ml-2 mb-2 pt-4 text-xs">
              {{ errorMessage }}
            </p>
            <BaseButton type="submit" @click="register">{{
              $t("auth.register")
            }}</BaseButton>
          </div>
          <div>
            <i18n-t
              keypath="auth.alreadyHaveAnAccount"
              scope="global"
              class="text-primary-300 font-bold w-full mb-4 text-sm"
              tag="p"
            >
              <a class="text-primary-200 underline" href="/login">{{
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      passwordConfirmErrorMessage: "",
    };
  },
  computed: {
    doesPasswordMatch() {
      return this.password === this.confirmPassword;
    },
  },
  methods: {
    register(): void {
      if (!this.doesPasswordMatch) {
        this.passwordConfirmErrorMessage = this.$t("auth.passwordsIdentical");
        return;
      }
      this.passwordConfirmErrorMessage = "";

      fetch(import.meta.env.PUBLIC_API_URL + "/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password,
        }),
      })
        .then(async (response) => {
          const json = await response.json();
          if (response.status === 201) {
            window.location.href = "/login";
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
