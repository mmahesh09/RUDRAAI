// Shipped client work shown on /showcase. Only real, live projects belong here.

export interface ShowcaseProject {
  slug: string;
  client: string;
  url: string;
  sector: string;
  year: string;
  scope: string[];
  stack: string[];
  line: string;
  images: {
    full: { src: string; width: number; height: number };
  };
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    slug: "mindbodymedworks",
    client: "Mindbodymedworks",
    url: "https://mindbodymedworks.in",
    sector: "Holistic health & wellness",
    year: "2026",
    scope: ["Design", "Build", "WhatsApp enquiries"],
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    line: "A calm, considered home for a practice that treats body, mind and hormones together.",
    images: {
      full: { src: "/showcase/mindbodymedworks-full.webp", width: 1600, height: 6400 },
    },
  },
  {
    slug: "rankwise",
    client: "Rankwise",
    url: "https://rankwise-xi.vercel.app",
    sector: "SEO & AI search tools",
    year: "2026",
    scope: ["Product design", "Build", "Audit engine"],
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    line: "An audit tool that checks how Google and AI assistants read a site, then ranks every fix by impact.",
    images: {
      full: { src: "/showcase/rankwise-full.webp", width: 1600, height: 3382 },
    },
  },
];
