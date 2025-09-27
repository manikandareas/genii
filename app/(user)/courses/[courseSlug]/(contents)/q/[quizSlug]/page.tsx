import QuizContent from "@/features/user/courses/components/quiz-content";

interface QuizPageProps {
  params: Promise<{ courseSlug: string; quizSlug: string }>;
}

export default async function QuizPage(props: QuizPageProps) {
  const params = await props.params;
  return <QuizContent quizSlug={params.quizSlug} />;
}
