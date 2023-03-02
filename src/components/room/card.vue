<template>
  <div class="bg-primary-600 rounded-[25px] relative w-[356px]">
    <img src="" class="h-44 rounded-[25px] w-full bg-stone-100" />
    <div class="p-5 flex flex-col">
      <h1 class="text-2xl font-bold mb-[1px] line-clamp-1">
        {{ roomType.name }}
      </h1>
      <div class="flex mb-2">
        <div class="border-[2px] border-primary-300 rounded-xl self-stretch mr-[3px]"></div>
        <span class="text-sm text-primary-300">{{ roomType.description }}</span>
      </div>
      <div class="flex mb-4">
        <div class="border-[2px] border-primary-300 rounded-xl self-stretch mr-[3px]"></div>
        <span class="text-sm text-primary-300 line-clamp-2">Size: {{ roomType.size }}<br>People: {{ roomType.supportedPeople }}</span>
      </div>
      <div class="flex">
        <div class="border-[2px] border-primary-300 rounded-xl self-stretch mr-[3px]"></div>
        <span class="text-sm font-bold text-primary-300 line-clamp-1">Price: {{ roomType.price }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    roomType: {
      type: Object,
      required: true,
    },
  },
};
</script>
