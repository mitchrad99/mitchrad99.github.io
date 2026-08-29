# mitchradakovich.com

Personal site and blog, built with [Astro](https://astro.build/) and deployed to
GitHub Pages.

## Publishing a blog post

**The easy way — PagesCMS (rich editor):**

1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub.
2. Open this repo and choose **Blog posts → New entry**.
3. Write (or paste from a Word / Google doc), set the title, date, excerpt, and an
   optional hero image, then **Save**.
4. Saving commits a Markdown file to `main`. GitHub Actions rebuilds and the post is
   live in about a minute.

Set **Draft** on an entry to keep it in the repo but off the live site.

**The manual way:** add a Markdown file to `src/content/blog/`. Frontmatter:

```yaml
---
title: My Post Title
description: One or two sentence summary.
pubDate: 2026-01-15
tags: [analytics, supply chain]     # optional
heroImage: /blog/my-image.jpg        # optional; file lives in public/blog/
draft: false                         # optional
---

Body in Markdown.
```

## Local development

Requires **Node 20+**.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # output to dist/
npm run preview   # serve the production build
```

## How deployment works

- Push to `main` → `.github/workflows/deploy.yml` builds with Astro and publishes to
  GitHub Pages.
- One-time setup: repo **Settings → Pages → Source → GitHub Actions**.
- The custom domain is set by `public/CNAME` (`mitchradakovich.com`).

## Structure

```
src/
  content/blog/        Markdown posts
  content.config.ts    Post schema
  pages/               Routes (index, blog, resume, contact, rss, 404)
  layouts/             BaseLayout, PostLayout
  components/          Header, Footer, PostCard, FormattedDate
  styles/global.css    Design tokens + base typography
  site.ts              Site metadata, nav, social links
public/
  blog/                Post images
  CNAME, favicon.svg, og-default.jpg
```

The resume page (`src/pages/resume.astro`) is scaffolded with placeholder content —
edit it and drop a PDF at `public/resume.pdf`.
