import type { ReactNode } from "react";

import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

import CourseSidebar from "./components/course-sidebar";
import { CourseContentProvider } from "./course-content-context";
import type {
  CourseChapter,
  CourseContentData,
  CourseContentItem,
  LessonDoc,
  QuizDoc,
} from "./types";

type CourseContentQueryResult = {
  course: Doc<"courses">;
  chapters: Doc<"chapters">[];
  lessons: Record<string, LessonDoc>;
  quizzes: Record<string, QuizDoc>;
  enrollment: Doc<"course_enrollments"> | null;
};

interface ContentLayoutProps {
  children: ReactNode;
  params: {
    courseSlug: string;
  };
}

function createLessonContentItem(
  lesson: LessonDoc,
  order: number,
  chapter: CourseChapter["chapter"],
): CourseContentItem {
  const meta = lesson as LessonDoc & {
    summary?: string;
    estimatedDurationMinutes?: number;
  };

  const summary =
    meta.summary ?? "Konten lesson akan segera tersedia.";
  const estimatedDuration = Math.max(2, meta.estimatedDurationMinutes ?? 5);

  return {
    type: "lesson",
    doc: lesson,
    summary,
    estimatedDurationMinutes: estimatedDuration,
    status: "locked",
    order,
    chapterId: lesson.chapterId,
    chapterTitle: chapter.title,
  };
}

function createQuizContentItem(
  quiz: QuizDoc,
  order: number,
  chapter: CourseChapter["chapter"],
): CourseContentItem {
  const questionCount = quiz.questions.length;
  const estimatedDuration = Math.max(5, questionCount * 2);

  return {
    type: "quiz",
    doc: quiz,
    summary:
      quiz.description || "Quiz ini belum memiliki deskripsi terperinci.",
    estimatedDurationMinutes: estimatedDuration,
    questionCount,
    status: "locked",
    order,
    chapterId: quiz.chapterId ?? chapter._id,
    chapterTitle: chapter.title,
  };
}

function buildCourseContentData(input: CourseContentQueryResult): CourseContentData {
  let orderCounter = 0;

  const chaptersWithContent: CourseChapter[] = input.chapters.map((chapter) => {
    const contents: CourseContentItem[] = [];

    const sortedContentOrder = chapter.contentOrder
      .map((entry, index) => ({ entry, index }))
      .sort((a, b) => {
        const aPosition = a.entry.position ?? a.index;
        const bPosition = b.entry.position ?? b.index;
        return aPosition - bPosition;
      });

    sortedContentOrder.forEach(({ entry }) => {
      if (!entry?.contentId || !entry.contentType) {
        return;
      }

      const contentKey = String(entry.contentId);

      if (entry.contentType === "lesson") {
        const lesson = input.lessons[contentKey];
        if (!lesson) return;
        orderCounter += 1;
        contents.push(createLessonContentItem(lesson, orderCounter, chapter));
      }

      if (entry.contentType === "quiz") {
        const quiz = input.quizzes[contentKey];
        if (!quiz) return;
        orderCounter += 1;
        contents.push(createQuizContentItem(quiz, orderCounter, chapter));
      }
    });

    return {
      chapter,
      contents,
    };
  });

  const totals = chaptersWithContent.reduce(
    (acc, entry) => {
      entry.contents.forEach((content) => {
        acc.totalDurationMinutes += content.estimatedDurationMinutes;
        if (content.type === "lesson") {
          acc.totalLessons += 1;
        } else if (content.type === "quiz") {
          acc.totalQuizzes += 1;
        }
      });
      return acc;
    },
    { totalDurationMinutes: 0, totalLessons: 0, totalQuizzes: 0 },
  );

  return {
    course: {
      ...input.course,
      ...totals,
    },
    chapters: chaptersWithContent,
    enrollment: input.enrollment,
  };
}

export default async function ContentLayout({
  children,
  params,
}: ContentLayoutProps) {
  const courseDataRaw = await fetchQuery(
    api.users.courses.queries.getCourseContent,
    {
      courseSlug: params.courseSlug,
    },
  );

  if (!courseDataRaw) {
    notFound();
  }

  const courseContent = buildCourseContentData({
    course: courseDataRaw.course,
    chapters: courseDataRaw.chapters,
    lessons: courseDataRaw.lessons,
    quizzes: courseDataRaw.quizzes,
    enrollment: courseDataRaw.enrollment ?? null,
  });

  return (
    <CourseContentProvider value={courseContent}>
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_55%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.2),transparent_50%)]" />
        <div className="absolute inset-x-20 top-[-20%] h-[480px] rounded-full bg-[radial-gradient(circle,hsl(var(--muted)/0.25),transparent_70%)] blur-3xl" />
        <div className="relative z-0 flex min-h-screen">
          <CourseSidebar />
          <main className="relative flex-1 overflow-hidden lg:ml-[320px]">
            <div className="h-full overflow-y-auto bg-[radial-gradient(circle_at_top,hsl(var(--muted)/0.15),transparent_65%)] px-6 py-10 md:px-12">
              <div className="mx-auto w-full max-w-5xl space-y-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </CourseContentProvider>
  );
}
