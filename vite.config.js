import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ["gsap"],
  },
});
