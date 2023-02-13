<template>
    <div class="mx-auto p-12 rounded-[50px] w-min bg-primary-600">
        <div class="p-4">
            <h1 class="text-3xl font-medium mb-1">{{ $t("auth.register") }}</h1>
            <p>{{ $t("auth.fillOutYourInfo") }}</p>
            <div class="mt-12">
                <form class="space-y-5">
                    <div class="w-96">
                        <BaseInput id="name" type="text" v-model="name" :place-holder="$t('auth.name')" :auto-focus="true"></BaseInput>
                    </div>
                    <div class="w-96">
                        <BaseInput id="email" type="email" v-model="email" :place-holder="$t('auth.email')"></BaseInput>
                    </div>
                    <div class="w-96">
                        <BaseInput id="password" type="password" min="8" v-model="password" :place-holder="$t('auth.password')"></BaseInput>
                    </div>
                    <div class="w-96">
                        <BaseInput id="passwordConfirm" type="password" min="8" v-model="confirmPassword" :error-text="passwordConfirmErrorMessage" :place-holder="$t('auth.confirmPassword')"></BaseInput>
                    </div>
                    <div>
                        <p class="text-red-500 w-full ml-2 mb-2 pt-4 text-xs">{{ errorMessage }}</p>
                        <BaseButton type="submit" @click="register">{{ $t("auth.register") }}</BaseButton>
                    </div>
                    <div>
                        <p class="text-primary-300 font-bold w-full mb-4 text-xs" v-html="$t('auth.alreadyHaveAnAccount')"></p>
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
        BaseInput, BaseButton
    },
    data() {
        return {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            errorMessage: "",
            passwordConfirmErrorMessage: ""
        }
    },
    computed: {
        doesPasswordMatch() {
            return this.password === this.confirmPassword;
        }
    },
    methods: {
        register(): void {
            if (!this.doesPasswordMatch) {
                this.passwordConfirmErrorMessage = this.$t("auth.passwordsIdentical");
                return;
            }
            this.passwordConfirmErrorMessage = "";

            fetch("/api/auth/register", {
                method: "POST",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": this.name,
                    "email": this.email,
                    "password": this.password
                })
            })
            .then(async (response) => {
                const json = await response.json();
                if (response.status === 201) {
                    window.location.href = "/";
                } else{
                    this.errorMessage = json.message;
                }
            }).catch((response) => {
                console.log(response);
                this.errorMessage = response.message;
            })
        }
    }
    }
</script>