import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo.config";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";
export const revalidate = 7200; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  try {
    // Fetch all published courses
    const courses = await fetchQuery(api.users.courses.queries.getCourses);

    const courseRoutes = courses
      .filter((course) => course.slug) // Only include courses with slugs
      .map((course) => ({
        url: `${baseUrl}/courses/${course.slug}`,
        lastModified: new Date(course._creationTime),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...routes, ...courseRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static routes if dynamic routes fail
    return routes;
  }
}
