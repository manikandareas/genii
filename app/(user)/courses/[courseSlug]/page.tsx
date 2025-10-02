import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { CourseDetailClient } from "@/features/user/courses/components/course-detail-client";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata, siteConfig } from "@/lib/seo.config";
import { getCourseSchema, getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const course = await fetchQuery(api.users.courses.queries.getCourseBySlug, {
    slug: params.courseSlug,
  });

  if (!course) {
    return constructMetadata();
  }

  const courseUrl = `${siteConfig.url}/courses/${course.slug}`;
  const courseImage =
    typeof course.thumbnail === "object" && course.thumbnail?.url
      ? course.thumbnail.url
      : siteConfig.ogImage;

  return constructMetadata({
    title: course.title || "Course",
    description:
      course.description ||
      `Learn ${course.title} with Genii's AI-powered interactive course`,
    image: courseImage,
    canonical: courseUrl,
    keywords: [
      course.title || "course",
      "online course",
      "learn online",
      "AI learning",
    ],
  });
}

export default async function CourseDetailPage(props: Props) {
  const params = await props.params;

  const course = await fetchQuery(api.users.courses.queries.getCourseBySlug, {
    slug: params.courseSlug,
  });

  if (!course) {
    throw notFound();
  }

  const courseUrl = `${siteConfig.url}/courses/${course.slug}`;
  const courseSchema = getCourseSchema({
    name: course.title ?? "Kursus",
    description: course.description || `Learn ${course.title} with Genii`,
    url: courseUrl,
    image:
      typeof course.thumbnail === "object" ? course.thumbnail?.url : undefined,
    datePublished: course._creationTime
      ? new Date(course._creationTime).toISOString()
      : undefined,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Courses", url: `${siteConfig.url}/courses` },
    { name: course.title || "Course", url: courseUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl space-y-36 px-6 py-8 md:py-16 xl:px-0">
        <CourseDetailClient
          course={
            course as Doc<"courses"> & {
              topics: Doc<"topics">[];
            }
          }
        />
      </div>
    </>
  );
}
