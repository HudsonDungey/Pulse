import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/docs/content";
import { SITE_URL } from "@/lib/docs/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const docs: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/docs/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const rawDocs: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/raw/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/llms-full.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...docs,
    ...rawDocs,
  ];
}
