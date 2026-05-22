// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// NOTA: hasta que se active el dominio custom (www.simacademy.lat) en Pages,
// el sitio vive en https://jmfraga.github.io/simacademy-www/ — base subpath obligatorio.
// Phase 8 (DNS switch): cambiar `site` a 'https://www.simacademy.lat' y `base` a '/'.
export default defineConfig({
  site: 'https://jmfraga.github.io',
  base: '/simacademy-www',
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
