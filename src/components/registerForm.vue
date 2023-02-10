<template>
    <div class="mx-auto p-12 rounded-[50px] w-min bg-primary-600">
        <div class="p-4">
            <h1 class="text-3xl font-medium mb-1">Register</h1>
            <p>Fill all fields</p>
            <div class="mt-12">
                <form class="space-y-5">
                    <div class="w-96">
                        <BaseInput id="name" type="text" v-model="name" :error-text="nameErrorMessage" place-holder="Name" :auto-focus="true"></BaseInput>
                    </div>
                    <div class="w-96">
                        <BaseInput id="email" type="email" v-model="email" :error-text="emailErrorMessage" place-holder="Email"></BaseInput>
                    </div>
                    <div class="w-96">
                        <BaseInput id="password" type="password" v-model="password" :error-text="passwordErrorMessage" place-holder="Password"></BaseInput>
                    </div>
                    <div class="w-96">
                        <BaseInput id="passwordConfirm" type="password" v-model="confirmPassword" :error-text="passwordConfirmErrorMessage" place-holder="Confirm Password"></BaseInput>
                    </div>
                    <div>
                        <p class="text-red-600 w-full ml-2 mb-2 pt-4 text-xs">{{ errorMessage }}</p>
                        <BaseButton type="submit" @click="register">Register</BaseButton>
                    </div>
                    <div>
                        <p class="text-primary-300 font-bold w-full mb-4 text-sm">Already have an account? Click <a class="text-primary-200 underline" href="/login">here</a>, to log in.</p>
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
            nameErrorMessage: "",
            emailErrorMessage: "",
            passwordErrorMessage: "",
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
                this.errorMessage = "Password fields should be identical";
                return;
            }

            fetch("/api/auth/register", {
                method: "POST",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": this.name || null,
                    "email": this.email || null,
                    "address": "",
                    "password": this.password || null
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