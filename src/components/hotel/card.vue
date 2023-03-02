<template>
  <div class="bg-primary-600 rounded-[25px] relative h-[429px] w-[356px]">
    <img src="" class="h-44 rounded-[25px] w-full bg-stone-100" />
    <div class="p-5 flex flex-col  h-[253px]">
      <h1
        class="text-2xl font-bold mb-[1px] line-clamp-1"
      >
        {{ hotel.name }}
      </h1>
      <div class="flex mb-2">
        <div
          class="border-[2px] border-primary-300 rounded-xl self-stretch mr-[3px]"
        ></div>
        <span
          class="text-sm text-primary-300 line-clamp-2"
          >{{ hotel.description }}</span
        >
      </div>
      <div class="flex mb-auto">
        <div
          class="border-[2px] border-primary-300 rounded-xl self-stretch mr-[3px]"
        ></div>
        <span
          class="text-sm text-primary-300 line-clamp-1"
          >{{ hotel.address }}</span
        >
      </div>
      <a :href="'/rooms/' + hotel.id">
        <BaseButton
          type="button"
          color="primary"
          class="mb-4 text-primary-500 bg-primary-300"
          >Værelser</BaseButton
        >
      </a>

      <BaseButton type="button" color="secondary">Book</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import BaseButton from "../base/button.vue";

export default {
  props: {
    hotel: {
      type: Object,
      required: true,
    },
  },
  components: { BaseButton },
};
</script>
