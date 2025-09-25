import type { Id } from "@/convex/_generated/dataModel";
import { CourseEditor } from "@/features/admin/courses/components/course-editor";

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CourseEditor courseId={params.id as Id<"courses">} />;
}
