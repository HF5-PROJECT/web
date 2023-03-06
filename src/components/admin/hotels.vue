<template>
    <div class="flex flex-col flex-grow rounded mt-4">
        <button v-on:click="addHotel()">MORE!</button>
        <Hotel v-for="(hotel, index) in hotels" :hotel="hotel" @delete="deleteHotel(index)"></Hotel>
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
            hotels: [] as Array<Object>,
        };
    },

    props: {
        hotelsData: {
            type: Array<Object>,
            required: true,
        },
    },

    mounted() {
        this.hotels = this.hotelsData;
    },

    methods: {
        addHotel() {
            this.hotels.unshift({
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
