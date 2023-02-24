<template>
  <nav class="w-full p-2 flex">
    <a class="mr-auto" href="/">
      <svg
        width="36"
        height="36"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="53.32 46.83 93.38 87.37"
      >
        <path
          d="M76.018 128.56c7.08 3.84 15.12 5.64 24 5.64s16.8-1.8 23.88-5.64c7.08-3.72 12.6-8.88 16.68-15.6 4.08-6.6 6.12-14.04 6.12-22.44 0-8.28-2.04-15.72-6.12-22.44-4.08-6.6-9.6-11.76-16.68-15.6-7.08-3.72-15-5.64-23.88-5.64-8.88 0-16.92 1.92-24 5.64-7.08 3.84-12.6 9-16.68 15.6-4.08 6.72-6 14.16-6 22.44 0 8.4 1.92 15.84 6 22.44 4.08 6.72 9.6 11.88 16.68 15.6zm35.52-17.04c-3.48 2.04-7.32 3-11.52 3-4.32 0-8.16-.96-11.52-3-3.48-1.92-6.24-4.8-8.16-8.4-2.04-3.6-3-7.8-3-12.6 0-4.68.96-8.88 3-12.48 1.92-3.6 4.68-6.48 8.16-8.52 3.36-1.92 7.2-3 11.52-3 4.2 0 8.04 1.08 11.52 3 3.36 2.04 6.12 4.92 8.16 8.52 1.92 3.6 3 7.8 3 12.48 0 4.8-1.08 9-3 12.6-2.04 3.6-4.8 6.48-8.16 8.4z"
          aria-label="O"
          style="
            font-style: normal;
            font-weight: 800;
            font-size: 120px;
            line-height: 1;
            font-family: 'Montserrat ExtraBold Alt1';
            font-variant-ligatures: none;
            text-align: center;
            dominant-baseline: middle;
            text-anchor: middle;
            fill: #cfb39d;
          "
        />
      </svg>
    </a>
    <a class="ml-auto" :href="isLoggedIn ? '/user' : '/login'">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="18" cy="18" r="18" fill="#56483E" />
        <g filter="url(#filter0_d_84_215)">
          <circle cx="18.3913" cy="16.8261" r="5.86957" fill="#CFB39D" />
        </g>
        <path
          d="M28 33C25.5 34.5 24.1042 36.001 18.3052 36.001C12.5062 36.001 10.4999 34.5 7.99998 33C5.50009 31.5 12.5062 25.001 18.3052 25.001C24.1042 25.001 30.5 31.5 28 33Z"
          fill="#CFB39D"
        />
        <defs>
          <filter
            id="filter0_d_84_215"
            x="8.52173"
            y="10.9565"
            width="19.7391"
            height="19.7393"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_84_215"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_84_215"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </a>
  </nav>
</template>

<script lang="ts">
import BaseButton from "../base/button.vue";

export default {
  components: { BaseButton },

  data() {
    return {
      isLoggedIn: false,
    };
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      fetch(import.meta.env.PUBLIC_API_URL + "/auth/user", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status === 200) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      });
    },
  },
};
</script>
