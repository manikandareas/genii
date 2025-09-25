import type { Id } from "@/convex/_generated/dataModel";
import { LessonEditor } from "@/features/admin/lessons/components/lesson-editor";

export default function LessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <LessonEditor lessonId={params.id as Id<"lessons">} />;
}
