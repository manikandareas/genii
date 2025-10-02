import QuizResultContent from "@/features/user/courses/components/quiz-result-content";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo.config";

interface ResultQuizPageProps {
  params: Promise<{ courseSlug: string; quizSlug: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}

export const metadata: Metadata = constructMetadata({
  title: "Hasil Quiz",
  description: "Lihat hasil quiz Anda dan dapatkan feedback dari AI Tutor untuk meningkatkan pemahaman.",
  robots: {
    index: false,
    follow: false,
  },
});

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
