import QuizContent from "@/features/user/courses/components/quiz-content";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo.config";

interface QuizPageProps {
  params: Promise<{ courseSlug: string; quizSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Quiz",
    description: "Uji pemahaman Anda dengan quiz interaktif dan dapatkan feedback langsung dari AI Tutor.",
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default async function QuizPage(props: QuizPageProps) {
  const params = await props.params;
  return <QuizContent quizSlug={params.quizSlug} />;
}
