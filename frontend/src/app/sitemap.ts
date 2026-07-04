import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
import { caseStudies } from "@/lib/case-studies";
import { researchCaseStudies } from "@/lib/research-case-studies";

const BASE = "https://www.rudraai.online";

const staticRoutes = [
  { url: BASE, priority: 1.0 },
  { url: `${BASE}/services`, priority: 0.9 },
  { url: `${BASE}/booking`, priority: 0.9 },
  { url: `${BASE}/blog`, priority: 0.8 },
  { url: `${BASE}/about`, priority: 0.7 },
  { url: `${BASE}/pricing`, priority: 0.7 },
  { url: `${BASE}/industries`, priority: 0.6 },
  { url: `${BASE}/case-studies`, priority: 0.6 },
  { url: `${BASE}/automation-guide`, priority: 0.6 },
  { url: `${BASE}/feedback`, priority: 0.5 },
  { url: `${BASE}/privacy`, priority: 0.3 },
  { url: `${BASE}/terms`, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${BASE}/case-studies/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const researchEntries: MetadataRoute.Sitemap = researchCaseStudies.map((study) => ({
    url: `${BASE}/case-studies/research/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes.map((r) => ({
      ...r,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
    })),
    ...blogEntries,
    ...caseStudyEntries,
    ...researchEntries,
  ];
}
