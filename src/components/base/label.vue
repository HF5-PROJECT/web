<template>
    <label
      class="block text-md font-medium text-gray-900"
      :for="for"
    >
      <slot />
    </label>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    for: {
      type: String,
      required: true,
    },
  });
  </script>