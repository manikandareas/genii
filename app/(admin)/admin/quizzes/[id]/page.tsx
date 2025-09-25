import type { Id } from "@/convex/_generated/dataModel";
import { QuizEditor } from "@/features/admin/quizzes/components/quiz-editor";

export default async function QuizDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <QuizEditor quizId={params.id as Id<"quizzes">} />;
}
