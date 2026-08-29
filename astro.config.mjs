// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mitchradakovich.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // keep legacy redirect stubs out of the sitemap
      filter: (page) => !/\.html(\/)?$/.test(page),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  // Redirects from the old hand-authored site so existing links keep working.
  redirects: {
    '/blog.html': '/blog',
    '/academics.html': '/resume',
    '/contact.html': '/contact',
    '/pages/data_ethics_blog.html': '/blog/data-ethics',
    '/pages/mapbox_challenge_blog.html': '/blog/mapbox-challenge',
    '/pages/online_internship_blog.html': '/blog/procter-and-gamble-take-two',
    '/pages/uncertain_spring_blog.html': '/blog/uncertain-spring',
    '/pages/data_in_dc_blog.html': '/blog/data-in-dc',
    '/pages/hack_ohio_2019_blog.html': '/blog',
  },
});
