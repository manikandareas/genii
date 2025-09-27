import LessonContent from "@/features/user/courses/components/lesson-content";

interface LessonPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default async function LessonPage(props: LessonPageProps) {
  const params = await props.params;
  return <LessonContent lessonSlug={params.lessonSlug} />;
}
