import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { CourseDetailClient } from "@/features/user/courses/components/course-detail-client";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function CourseDetailPage(props: Props) {
  const params = await props.params;

  const course = await fetchQuery(api.users.courses.queries.getCourseBySlug, {
    slug: params.courseSlug,
  });

  if (!course) {
    throw notFound();
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-36 px-6 py-8 md:py-16 xl:px-0">
      <CourseDetailClient
        course={
          course as Doc<"courses"> & {
            topics: Doc<"topics">[];
          }
        }
      />
    </div>
  );
}
