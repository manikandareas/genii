import QuizResultContent from "@/features/user/courses/components/quiz-result-content";

interface ResultQuizPageProps {
  params: Promise<{ courseSlug: string; quizSlug: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}

export default async function ResultQuizPage(props: ResultQuizPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return (
    <QuizResultContent
      quizSlug={params.quizSlug}
      attemptId={searchParams.attemptId}
    />
  );
}
