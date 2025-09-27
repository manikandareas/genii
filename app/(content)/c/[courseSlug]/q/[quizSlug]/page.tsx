import QuizContent from "./quiz-content";

interface QuizPageProps {
  params: {
    courseSlug: string;
    quizSlug: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return <QuizContent quizSlug={params.quizSlug} />;
}
