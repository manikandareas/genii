import type { Id } from "@/convex/_generated/dataModel";
import { CourseEditor } from "@/features/admin/courses/components/course-editor";

export default async function CourseDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <CourseEditor courseId={params.id as Id<"courses">} />;
}
