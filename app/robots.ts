import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/onboarding/*",
          "/_next/*",
          "/static/*",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
