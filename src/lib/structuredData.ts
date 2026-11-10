import { site, socials } from '../site';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.authorName,
    url: site.url,
    jobTitle: 'Data Scientist',
    worksFor: {
      '@type': 'Organization',
      name: 'All Aboard Ohio',
      url: 'https://allaboardohio.org',
    },
    sameAs: socials.filter((s) => s.href.startsWith('http')).map((s) => s.href),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.title,
    url: site.url,
  };
}

export function blogPostingJsonLd({
  title,
  description,
  pubDate,
  updatedDate,
  url,
  image,
}: {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  url: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    author: { '@type': 'Person', name: site.authorName, url: site.url },
    url,
    ...(image ? { image } : {}),
  };
}
