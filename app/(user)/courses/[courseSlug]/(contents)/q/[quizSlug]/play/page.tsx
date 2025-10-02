import QuizPlayContent from "@/features/user/courses/components/quiz-play-content";

interface PlayQuizPageProps {
  params: Promise<{ courseSlug: string; quizSlug: string }>;
}

export default async function PlayQuizPage(props: PlayQuizPageProps) {
  const params = await props.params;
  return (
    <QuizPlayContent
      quizSlug={params.quizSlug}
      courseSlug={params.courseSlug}
    />
  );
}
