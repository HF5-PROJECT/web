<template>
    <button
      :type="type"
      class="w-full text-primary-200 bg-primary-500 hover:bg-primary-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-xl text-md py-2 text-center"
      @click.prevent="emit('click')"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  import type { PropType } from "vue";
  
  const props = defineProps({
    type: {
      type: String as PropType<"submit" | "reset" | "button">,
      required: true,
    },
  });
  
  const emit = defineEmits(["click"]);
  </script>