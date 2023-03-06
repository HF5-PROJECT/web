<template>
    <div class="md:grid md:grid-cols-3 md:gap-6 mb-8">
        <div class="mt-5 md:col-span-3 md:mt-0">
            <form v-on:submit.prevent>
                <div class="shadow sm:overflow-hidden sm:rounded-md">
                    <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <div class="col-span-6">
                            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <input v-model="hotel.name" type="text" name="name" id="name" autocomplete="off"
                                class="form-input mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            <p v-if="errorMessage.includes('name')" class="mt-2 text-sm text-red-500">{{
                                computedErrorMessage }}</p>
                        </div>

                        <div>
                            <label for="description"
                                class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                            <div class="mt-2">
                                <textarea v-model="hotel.description" id="description" name="description" rows="3"
                                    class="form-textarea mt-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6"></textarea>
                            </div>
                            <p v-if="errorMessage.includes('description')" class="mt-2 text-sm text-red-500">{{
                                computedErrorMessage }}</p>
                        </div>

                        <div class="col-span-6">
                            <label for="street-address"
                                class="block text-sm font-medium leading-6 text-gray-900">Address</label>
                            <input v-model="hotel.address" type="text" name="street-address" id="street-address"
                                autocomplete="street-address"
                                class="form-input mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            <p v-if="errorMessage.includes('address')" class="mt-2 text-sm text-red-500">{{
                                computedErrorMessage }}</p>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button @click="deleteHotel()"
                            class="inline-flex mr-4 justify-center rounded-md bg-red-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Delete</button>
                        <button @click="updateOrCreateHotel()"
                            class="inline-flex justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            errorMessage: "",
        };
    },

    props: {
        hotel: {
            type: Object,
            required: true,
        },
    },

    computed: {
        computedErrorMessage() {
            let errorMessage = this.errorMessage;

            errorMessage = errorMessage.replace('body/', '');

            return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);;
        },
    },

    methods: {
        async updateOrCreateHotel() {
            let response;
            if (this.hotel.id === undefined) {
                response = await fetch(import.meta.env.PUBLIC_API_URL + "/hotel/", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.hotel)
                })

                this.$emit('create')
            } else {
                response = await fetch(import.meta.env.PUBLIC_API_URL + "/hotel/" + this.hotel.id, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.hotel)
                });

                this.$emit('update')
            };

            const json = await response.json();

            if (response.status === 400) {
                this.errorMessage = json.message;
            }
        },

        async deleteHotel() {
            if (this.hotel.id !== undefined) {
                let response = await fetch(import.meta.env.PUBLIC_API_URL + "/hotel/" + this.hotel.id, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.hotel)
                })

                console.log(response)

                if (response.status !== 204) {
                    return;
                }
            }

            this.$emit('delete')
        },
    },
};
</script>
