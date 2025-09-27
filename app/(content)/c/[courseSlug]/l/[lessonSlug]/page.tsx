import LessonContent from "./lesson-content";

interface LessonPageProps {
  params: {
    courseSlug: string;
    lessonSlug: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  return <LessonContent lessonSlug={params.lessonSlug} />;
}
