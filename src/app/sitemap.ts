import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';
import { transitions } from '@/library/registry';
import { source } from '@/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/docs/templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic documentation pages from Fumadocs source
  try {
    const docPages = source.getPages();
    for (const page of docPages) {
      entries.push({
        url: `${siteUrl}${page.url}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: page.url === '/docs' ? 0.9 : 0.8,
      });
    }
  } catch (error) {
    console.error('Error reading doc pages for sitemap:', error);
  }

  // Transitions: Docs and Demo pages
  for (const transition of transitions) {
    entries.push({
      url: `${siteUrl}/docs/transitions/${transition.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    entries.push({
      url: `${siteUrl}/demo/${transition.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Deduplicate by URL
  const uniqueUrls = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    if (!uniqueUrls.has(entry.url)) {
      uniqueUrls.set(entry.url, entry);
    }
  }

  return Array.from(uniqueUrls.values());
}
