import type { Id } from "@/convex/_generated/dataModel";
import { LessonEditor } from "@/features/admin/lessons/components/lesson-editor";

export default async function LessonDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <LessonEditor lessonId={params.id as Id<"lessons">} />;
}
