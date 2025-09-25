import type { Id } from "@/convex/_generated/dataModel";
import { QuizEditor } from "@/features/admin/quizzes/components/quiz-editor";

export default function QuizDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <QuizEditor quizId={params.id as Id<"quizzes">} />;
}
