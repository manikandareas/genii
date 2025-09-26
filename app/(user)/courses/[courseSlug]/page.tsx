import { api } from "@/convex/_generated/api";
import DetailContents from "@/features/user/courses/components/detail-contents";
import { DetailHero } from "@/features/user/courses/components/detail-hero";
import DetailPromo from "@/features/user/courses/components/detail-promo";
import { currentUser } from "@clerk/nextjs/server";
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
      <DetailHero course={course} />

      <DetailContents course={course} />

      <DetailPromo course={course} />
    </div>
  );
}
