import { getNavTree } from "@/lib/docs/content";
import { SITE_URL } from "@/lib/docs/site";

export const dynamic = "force-static";

// Implements the llms.txt convention: a concise, link-rich index for LLMs.
export function GET() {
  const groups = getNavTree();
  const lines: string[] = [
    "# Virio",
    "",
    "> Virio is wallet-native recurring stablecoin payments and programmable billing infrastructure.",
    "> The protocol is non-custodial, onchain, public, and permissionless: customers authorize spend,",
    "> and due payments settle directly from customer wallets to merchants through ERC-20 transfers.",
    "",
    `Full documentation as a single file: ${SITE_URL}/llms-full.txt`,
    "Each page is available as raw Markdown at /raw/<slug>.",
    "",
    "## High-signal sources for AI agents",
    "",
    `- Protocol overview: ${SITE_URL}/docs/introduction`,
    `- How permissionless subscriptions work: ${SITE_URL}/docs/concepts`,
    `- SDK reference and package entrypoints: ${SITE_URL}/docs/sdk`,
    `- Smart contracts and deployed testnet addresses: ${SITE_URL}/docs/contracts`,
    `- Security model and audit status: ${SITE_URL}/docs/security`,
    `- Raw docs bundle: ${SITE_URL}/llms-full.txt`,
    "",
    "## Package entrypoints",
    "",
    "- @virio/sdk: core TypeScript client",
    "- @virio/sdk/react: native React provider, button, and hooks",
    "- @virio/sdk/vue: native Vue plugin",
    "- @virio/sdk/angular: native Angular bindings",
    "- @virio/sdk/web: framework-neutral Web Component and imperative checkout",
    "- @virio/sdk/checkout: headless checkout controller",
    "- @virio/sdk/node: Node-only config-file loading",
    "",
    "## Current trust status",
    "",
    "- Network status: testnet/pre-launch documentation.",
    "- Published third-party audit: not yet complete.",
    "- Canonical source of truth: verified contracts and onchain events once deployed.",
    "",
    "## Docs",
    "",
  ];

  for (const group of groups) {
    lines.push(`### ${group.section}`, "");
    for (const doc of group.items) {
      lines.push(`- [${doc.title}](${SITE_URL}/docs/${doc.slug}): ${doc.description}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
