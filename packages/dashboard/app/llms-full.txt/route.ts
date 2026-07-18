import { getAllDocs, getDoc } from "@/lib/docs/content";
import { SITE_URL } from "@/lib/docs/site";

export const dynamic = "force-static";

// The entire documentation concatenated as Markdown — the format AI coding
// tools and retrieval systems consume best.
export function GET() {
  const parts: string[] = [
    "# Virio Documentation",
    "",
    "Virio is wallet-native recurring stablecoin payments and programmable billing infrastructure.",
    "The protocol is non-custodial, onchain, public, and permissionless. Customers authorize spend, and due payments settle directly from customer wallets to merchants.",
    "",
    "Primary SDK entrypoints: @virio/sdk (core), native @virio/sdk/react, @virio/sdk/vue, and @virio/sdk/angular, plus @virio/sdk/web, @virio/sdk/checkout, and @virio/sdk/node.",
    "Current trust status: testnet/pre-launch documentation; no published third-party audit yet.",
    "",
    "---",
    "",
  ];

  for (const entry of getAllDocs()) {
    const doc = getDoc(entry.slug);
    if (!doc) continue;
    parts.push(`# ${doc.title}`, "");
    parts.push(`Source: ${SITE_URL}/docs/${doc.slug}`, "");
    parts.push(doc.body.trim(), "", "---", "");
  }

  return new Response(parts.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
