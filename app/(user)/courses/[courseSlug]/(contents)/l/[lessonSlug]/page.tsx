import { SectionAskProvider } from "@/features/user/agent/context/ask-context";
import LessonContent from "@/features/user/courses/components/lesson-content";

interface LessonPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default async function LessonPage(props: LessonPageProps) {
  const params = await props.params;
  return (
    <SectionAskProvider>
      <LessonContent lessonSlug={params.lessonSlug} />
    </SectionAskProvider>
  );
}
