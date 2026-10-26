import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/portal", "/login", "/auth/"] },
    sitemap: "https://www.rudraai.online/sitemap.xml",
  };
}
