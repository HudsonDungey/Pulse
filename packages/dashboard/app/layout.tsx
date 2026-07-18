import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/docs/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Virio - Onchain Subscriptions & Payroll Infrastructure",
  description:
    "Recurring crypto payments, automated payroll, and programmable billing for modern internet businesses. Stripe for onchain subscriptions & payroll.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Virio - Onchain Subscriptions & Payroll Infrastructure",
    description:
      "Wallet-native recurring stablecoin payments, automated payroll, and programmable billing infrastructure.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virio - Onchain Subscriptions & Payroll Infrastructure",
    description:
      "Wallet-native recurring stablecoin payments and programmable billing infrastructure.",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Virio builds wallet-native recurring stablecoin payments and programmable billing infrastructure.",
    sameAs: ["https://github.com/HudsonDungey/bit"],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Virio protocol and SDK source",
    codeRepository: "https://github.com/HudsonDungey/bit",
    programmingLanguage: ["TypeScript", "Solidity"],
    runtimePlatform: "Node.js",
    url: `${SITE_URL}/docs/sdk`,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    softwareVersion: "0.1.0",
    programmingLanguage: ["TypeScript", "Solidity"],
    description:
      "A TypeScript SDK and onchain protocol for non-custodial recurring ERC-20 subscriptions, payroll, and programmable billing.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Virio?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Virio is wallet-native recurring stablecoin payments and programmable billing infrastructure for subscriptions, payroll, and metered billing.",
        },
      },
      {
        "@type": "Question",
        name: "Does Virio custody customer funds?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. Virio is non-custodial: funds move directly from customer wallets to merchants at charge time using explicit onchain permissions.",
        },
      },
      {
        "@type": "Question",
        name: "How do developers integrate Virio?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Developers install @virio/sdk and use the core TypeScript client, the native React, Vue, and Angular entrypoints, or the framework-neutral Web Component.",
        },
      },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen bg-background font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
