import QuizPlayContent from "@/features/user/courses/components/quiz-play-content";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo.config";

interface PlayQuizPageProps {
  params: Promise<{ courseSlug: string; quizSlug: string }>;
}

export const metadata: Metadata = constructMetadata({
  title: "Kerjakan Quiz",
  description: "Kerjakan quiz untuk menguji pemahaman Anda terhadap materi yang telah dipelajari.",
  robots: {
    index: false,
    follow: false,
  },
});

export default async function PlayQuizPage(props: PlayQuizPageProps) {
  const params = await props.params;
  return (
    <QuizPlayContent
      quizSlug={params.quizSlug}
      courseSlug={params.courseSlug}
    />
  );
}
