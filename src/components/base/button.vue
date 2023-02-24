<template>
  <button
    :type="type"
    :class="[
      color === 'primary' ? 'text-primary-500 bg-primary-300' : '',
      color === 'secondary' ? 'text-primary-200 bg-primary-500' : '',
    ]"
    class="w-full hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-xl text-md py-2 text-center"
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
  color: {
    type: String as PropType<"primary" | "secondary">,
    required: true,
  },
});

const emit = defineEmits(["click"]);
</script>
