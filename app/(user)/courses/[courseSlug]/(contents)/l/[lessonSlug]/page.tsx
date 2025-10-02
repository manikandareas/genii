import LessonContent from "@/features/user/courses/components/lesson-content";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo.config";

interface LessonPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Pelajaran",
    description: "Pelajari materi pembelajaran interaktif dengan AI Companion yang membantu Anda memahami konsep dengan lebih baik.",
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default async function LessonPage(props: LessonPageProps) {
  const params = await props.params;
  return <LessonContent lessonSlug={params.lessonSlug} />;
}
