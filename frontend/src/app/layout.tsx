import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import CookieConsent from "@/components/cookie-consent";
import { Providers } from "@/components/providers";
import ChatWidget from "@/components/chat-widget";
import GaScript from "@/components/ga-script";
import ChatwootWidget from "@/components/chatwoot-widget";
import SiteEffects from "@/components/site/site-effects";
import { organizationSchema, websiteSchema } from "@/lib/seo";

// Display + subheads: Inter Tight (neo-grotesque, tight metrics for large sizes).
// Body: Google Sans (linked below — not yet in next/font). JetBrains Mono: labels, data, run logs.
const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rudraai.online"),
  title: {
    default: "AI Services: Websites, AI Agents & Automation | RudraAI",
    template: "%s | RudraAI",
  },
  description:
    "RudraAI is an AI services studio in Hyderabad building fast Next.js websites, custom AI agents and n8n workflow automations. Fixed price. Book a free call.",
  keywords: [
    "AI services company",
    "AI development services",
    "website design and development",
    "Next.js website development",
    "custom AI agent development",
    "AI chatbot development",
    "AI workflow automation",
    "n8n automation services",
    "business process automation",
  ],
  // No canonical here: each page sets its own via pageMetadata(), so nothing inherits "/"
  openGraph: {
    title: "RudraAI — Websites, AI Agents & AI Automations",
    description:
      "We design websites, build AI agents and automate workflows — so your business runs faster with less manual work.",
    type: "website",
    locale: "en_US",
    url: "https://www.rudraai.online",
    siteName: "RudraAI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RudraAI — Websites, AI Agents & AI Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@GowriRudrai",
    creator: "@GowriRudrai",
    title: "RudraAI — Websites, AI Agents & AI Automations",
    description:
      "We design websites, build AI agents and automate workflows — so your business runs faster with less manual work.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "googlec10c12c5cb4346d7",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available so scroll reveals can start hidden; without JS everything stays visible */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }} />
      </head>
      <body className="bg-black text-white antialiased overflow-x-hidden" suppressHydrationWarning>
        <SmoothScrollProvider>
          <Providers>{children}</Providers>
        </SmoothScrollProvider>
        <SiteEffects />
        <CookieConsent />
        <ChatWidget />
        <GaScript />
        <ChatwootWidget />
      </body>
    </html>
  );
}
