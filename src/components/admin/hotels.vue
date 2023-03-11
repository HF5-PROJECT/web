<template>
    <div class="flex flex-col flex-grow rounded mt-4">
        <div class="flex justify-start mb-4">
            <button @click="addHotel()"
                class="inline-flex justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                Add Hotel
            </button>
        </div>

        <Hotel v-for="(hotel, index) in hotels" :key="hotel.UUID" :hotel="hotel" @delete="deleteHotel(index)"></Hotel>
    </div>
</template>

<script lang="ts">
import Hotel from './hotel.vue';

export default {
    components: {
        Hotel,
    },

    data() {
        return {
            hotels: [] as Array<any>,
        };
    },

    props: {
        hotelsData: {
            type: Array<Object>,
            required: true,
        },
    },

    mounted() {
        this.hotelsData.forEach((hotel) => {
            this.hotels.push({
                UUID: self.crypto.randomUUID(),
                ...hotel,
            })
        })
    },

    methods: {
        addHotel() {
            this.hotels.unshift({
                UUID: self.crypto.randomUUID(),
                name: '',
                description: '',
                address: '',
            })
        },

        deleteHotel(index: number) {
            this.hotels.splice(index, 1);
        }
    },
};
</script>
