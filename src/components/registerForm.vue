<template>
    <div class="mx-auto p-5 rounded-3xl w-min" style="background-color: #313030;">
        <div class="p-5">
            <h1>Register</h1>
            <p>Fill all fields</p>
            <div class="mt-12">
                <form>
                    <p v-if="parsedMessage" class="text-red-600 w-full mb-4 text-xs">{{ parsedMessage }}</p>
                    <div class="input-div">
                        <input class="w-full darkcolor lightbg mb-6 p-1.5 rounded-xl" type="text" placeholder="Name" v-model="name" />
                    </div>
                    <div class="input-div">
                        <input class="w-full darkcolor lightbg mb-6 p-1.5 rounded-xl" type="email" placeholder="E-mail" v-model="email" />
                    </div>
                    <div class="input-div">
                        <input class="w-full darkcolor lightbg mb-6 p-1.5 rounded-xl" type="password" placeholder="Password" v-model="password" />
                    </div>
                    <div class="input-div">
                        <input class="w-full darkcolor lightbg mb-6 p-1.5 rounded-xl" type="password" placeholder="Confirm Password" v-model="confirmPassword" />
                    </div>
                    <div class="mt-6">
                        <button type="submit" class="w-full darkbg rounded-xl p-2" @click.prevent="register">Register</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            errorMessage: "",
            validPassword: false,
            passwordsMatch: false
        }
    },
    props: {
        endpoint: {
            type: String,
            required: true,
        }
    },
    computed: {
        parsedMessage(): String {
            return this.errorMessage;
        }
    },
    watch: {
        password() {
            const length = this.password.length > 8;
            const containsUppercase = /[A-Z]/.test(this.password);
            const containsLowercase = /[a-z]/.test(this.password);
            const containsNumber = /[0-9]/.test(this.password);
            const containsSpecial = /[#?!@$%^&*-]/.test(this.password);
            this.validPassword = length && containsUppercase && containsLowercase && containsNumber && containsSpecial;
        },
        confirmPassword() {
            this.passwordsMatch = this.password === this.confirmPassword;
        }
    },
    methods: {
        register(): void {
            if (!this.validPassword) {
                this.errorMessage = "Password is required to be minimum 8 characters long, with atleast one number, lowercase, uppercase and a special character";
                return;
            }

            if (!this.passwordsMatch) {
                this.errorMessage = "Password fields should be identical";
                return;
            }

            fetch(this.endpoint, {
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
                let json = await response.json();
                if (json.statusCode !== undefined && json.statusCode !== 201) {
                    this.errorMessage = json.message;
                } else {
                    window.location.href = "/";
                }
            }).catch((response) => {
                console.log(response);
                this.errorMessage = response.message;
            })
        }
    }
    }
</script>
<style lang="scss">
	.input-div {
		width: 300px;
	}
	input::placeholder {
		color: #56483E;
		font-weight: 500;
	}
    .darkbg {
        background-color: #56483E;
    }
    .lightbg {
        background-color: #CFB39D;
    }
    .darkcolor {
        color: #56483E;
    }
</style>