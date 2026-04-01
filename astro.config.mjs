// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
  },
  integrations: [icon(), react()],
  fonts: [
      {
          provider: fontProviders.google(),
          name: "Google Sans",
          cssVariable: "--font-google",
          fallbacks:["sans-serif"],
          subsets: ["greek", "latin"],
          styles: ["normal"],
        },
  ],
});