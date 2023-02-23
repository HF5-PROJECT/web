<template>
  <div class="bg-primary-600 rounded-[25px] w-[356px]">
    <img src="" class="h-44 rounded-[25px] bg-white" />
    <div class="p-5 flex flex-col">
      <h1
        class="text-2xl font-bold mb-[1px] whitespace-nowrap text-ellipsis overflow-hidden"
      >
        {{ hotel.name }}
      </h1>
      <div class="flex mb-2">
        <div
          class="border-[2px] border-primary-300 rounded-xl self-stretch mr-[3px]"
        ></div>
        <span
          class="text-sm text-primary-300 whitespace-pre text-ellipsis overflow-hidden h-10"
          >{{ hotel.description }}</span
        >
      </div>
      <div class="flex mb-4">
        <div
          class="border-[2px] border-primary-300 rounded-xl self-stretch mr-[3px]"
        ></div>
        <span
          class="text-sm text-primary-300 whitespace-nowrap text-ellipsis overflow-hidden"
          >{{ hotel.address }}</span
        >
      </div>
      <BaseButton type="button" class="mb-4 bg-primary-300 text-primary-500"
        >Værelser</BaseButton
      >
      <BaseButton type="button">Book</BaseButton>
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
