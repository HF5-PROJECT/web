import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import vue from "@astrojs/vue";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), vue({
    appEntrypoint: '/src/pages/_app'
  }), prefetch()],
  output: "server",
  adapter: node({
    mode: 'server'
  })
});