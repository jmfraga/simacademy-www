// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Sitio en producción: https://www.simacademy.lat (hosteado en TC SimAcademy
// vía Cloudflare Tunnel → nginx → /var/www/simacademy-www/, deploy por rsync).
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
