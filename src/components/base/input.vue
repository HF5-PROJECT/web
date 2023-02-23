<template>
  <div>
    <BaseLabel class="mb-2" :for="id"><slot /></BaseLabel>
    <div class="relative">
      <input
        :id="id"
        class="peer w-full px-4 placeholder:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:shadow focus:border-primary-700 invalid:ring-2 invalid:ring-red-500 invalid:focus:ring-red-500 text-primary-500 bg-primary-200 p-1.5 rounded-xl placeholder:font-medium"
        :type="getType"
        :value="modelValue"
        :min="min"
        :step="step"
        @input="updateValue"
        @change="change"
        :placeholder="placeHolder"
        ref="input"
      />
      <div
        v-if="type === 'password'"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
      >
        <svg
          class="h-6 cursor-pointer text-gray-700"
          fill="none"
          @click="showPassword = !showPassword"
          :class="{ hidden: showPassword, block: !showPassword }"
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 576 384"
        >
          <g>
            <g>
              <path
                d="m572.51945,177.4c-54.23,-105.81 -161.59,-177.4 -284.52,-177.4s-230.32,71.64 -284.52,177.41a32.35,32.35 0 0 0 0,29.19c54.23,105.81 161.59,177.4 284.52,177.4s230.32,-71.64 284.52,-177.41a32.35,32.35 0 0 0 0,-29.19zm-284.52,158.6a144,144 0 1 1 144,-144a143.93,143.93 0 0 1 -144,144zm0,-240a95.31,95.31 0 0 0 -25.31,3.79a47.85,47.85 0 0 1 -66.9,66.9a95.78,95.78 0 1 0 92.21,-70.69z"
                fill="currentColor"
              />
            </g>
          </g>
        </svg>
        <svg
          class="h-6 cursor-pointer text-gray-700"
          fill="none"
          @click="showPassword = !showPassword"
          :class="{ block: showPassword, hidden: !showPassword }"
          xmlns="http://www.w3.org/2000/svg"
          width="26px"
          height="26px"
          viewBox="0 0 640 512"
        >
          <g>
            <path
              d="m603.52108,240.40268c-54.23,-105.81 -161.59,-177.4 -284.52,-177.4s-230.32,71.64 -284.52,177.41a32.35,32.35 0 0 0 0,29.19c54.23,105.81 161.59,177.4 284.52,177.4s230.32,-71.64 284.52,-177.41a32.35,32.35 0 0 0 0,-29.19zm-284.52,158.6a144,144 0 1 1 144,-144a143.93,143.93 0 0 1 -144,144zm0,-240a95.31,95.31 0 0 0 -25.31,3.79a47.85,47.85 0 0 1 -66.9,66.9a95.78,95.78 0 1 0 92.21,-70.69z"
              fill="currentColor"
            />
            <path
              fill="currentColor"
              d="m319.99852,400.00268c-75.85,0 -137.25,-58.71 -142.9,-133.11l-104.9,-81.07c-13.79,17.3 -26.48,35.59 -36.72,55.59a32.35,32.35 0 0 0 0,29.19c54.23,105.81 161.59,177.4 284.52,177.4c26.91,0 52.87,-4 77.89,-10.46l-51.89,-40.15a144.13,144.13 0 0 1 -26,2.61zm313.82,58.1l-110.55,-85.44a331.25,331.25 0 0 0 81.25,-102.07a32.35,32.35 0 0 0 0,-29.19c-54.23,-105.81 -161.59,-177.4 -284.52,-177.4a308.15,308.15 0 0 0 -147.32,37.7l-127.22,-98.33a16,16 0 0 0 -22.46,2.81l-19.63,25.27a16,16 0 0 0 2.81,22.45l588.36,454.73a16,16 0 0 0 22.46,-2.81l19.64,-25.27a16,16 0 0 0 -2.82,-22.45zm-183.72,-142l-39.3,-30.38a94.75,94.75 0 0 0 5.2,-29.72a94.76,94.76 0 0 0 -121.31,-92.21a47.65,47.65 0 0 1 9.31,28.21a46.64,46.64 0 0 1 -1.54,10l-73.61,-56.89a142.31,142.31 0 0 1 91.15,-33.11a143.92,143.92 0 0 1 144,144c0,21.63 -5.29,41.79 -13.9,60.11l0,-0.01z"
            />
          </g>
        </svg>
      </div>
    </div>
    <p v-if="errorText" class="ml-2 mt-2 text-xs text-red-500">
      {{ errorText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import BaseLabel from "./label.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  min: {
    type: String,
    default: "",
  },
  step: {
    type: String,
    default: "any",
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  placeHolder: {
    type: String,
  },
  errorText: {
    type: String,
  },
});

// Show/hide password
const showPassword = ref(false);
const getType = computed(() => {
  if (props.type !== "password") {
    return props.type;
  }

  return showPassword.value ? "text" : "password";
});

// Emits
const emit = defineEmits(["update:modelValue", "change"]);
const updateValue = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
const change = (event: Event) => {
  emit("change");
};

// Autofocus
const input: Ref<HTMLInputElement | null> = ref(null);
onMounted(() => {
  if (props.autoFocus) {
    input.value?.focus();
  }
});
</script>
