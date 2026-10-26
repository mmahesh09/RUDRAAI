import type { Metadata } from "next";
import { SERVICES, SITE } from "@/lib/site";

export const BASE_URL = "https://www.rudraai.online";

// Profiles linked in the footer — keep these two lists in sync
export const SOCIAL_PROFILES = [
  "https://x.com/Rudraai2",
  "https://www.linkedin.com/company/rudrai",
  "https://www.instagram.com/rudraai.online/",
];

const DEFAULT_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "RudraAI — Websites, AI Agents & AI Automations" };

type PageMetaInput = {
  /** Page title without the brand; the root layout template appends " | RudraAI" */
  title: string;
  description: string;
  /** Path starting with "/" — becomes the canonical and og:url */
  path: string;
  image?: string;
  type?: "website" | "article";
};

/**
 * Per-page metadata. Next.js replaces (not merges) openGraph/twitter objects from the
 * layout, so every public page sets them here — otherwise it inherits the home page's
 * og:url and title.
 */
export function pageMetadata({ title, description, path, image, type = "website" }: PageMetaInput): Metadata {
  const images = image ? [{ url: image }] : [DEFAULT_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
      siteName: SITE.name,
      locale: "en_US",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** For logged-in areas: keep them out of the index and don't inherit the home canonical */
export const privateMetadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/#organization`,
  name: SITE.name,
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  image: `${BASE_URL}/og-image.png`,
  email: SITE.email,
  description:
    "AI services studio in Hyderabad that designs and builds websites, custom AI agents and n8n workflow automations for businesses.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  areaServed: ["IN", "Worldwide"],
  knowsAbout: ["Website design and development", "Next.js", "AI agents", "AI chatbots", "RAG", "AI workflow automation", "n8n"],
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name, url: `${BASE_URL}/services/${s.slug}` },
  })),
  sameAs: SOCIAL_PROFILES,
  contactPoint: { "@type": "ContactPoint", contactType: "sales", email: SITE.email, url: `${BASE_URL}/booking` },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: SITE.name,
  url: BASE_URL,
  publisher: { "@id": `${BASE_URL}/#organization` },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
