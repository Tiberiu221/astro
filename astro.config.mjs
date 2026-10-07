// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Absolute base URL for the sitemap, the RSS feed and canonical links.
  // Real domain: site: 'https://demo.ofai.ro', then build and deploy again.
  site: 'http://localhost',
  integrations: [sitemap()],
  build: {
    // Always emit CSS as hashed files in /_astro/ (nginx caches those for a year) instead of inlining small ones.
    inlineStylesheets: 'never',
  },
});
