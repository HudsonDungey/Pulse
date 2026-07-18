import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/docs/site";

export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
  return {
    rules: [
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
