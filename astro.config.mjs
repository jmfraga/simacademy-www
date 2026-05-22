// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.simacademy.lat',
  trailingSlash: 'ignore',
  integrations: [
    react({ include: ['**/*.tsx'] }),
    sitemap({
      filter: (page) => !page.includes('/playground'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
