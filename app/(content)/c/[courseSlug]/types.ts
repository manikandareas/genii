import type { Doc } from "@/convex/_generated/dataModel";

export type LessonDoc = Doc<"lessons">;
export type QuizDoc = Doc<"quizzes">;
export type ChapterDoc = Doc<"chapters">;
export type CourseDoc = Doc<"courses">;

export type CourseContentItemStatus = "completed" | "in_progress" | "locked";

interface CourseContentBaseItem {
  order: number;
  chapterId: ChapterDoc["_id"];
  chapterTitle: ChapterDoc["title"];
  summary: string;
  estimatedDurationMinutes: number;
  status: CourseContentItemStatus;
}

export type LessonContentItem = CourseContentBaseItem & {
  type: "lesson";
  doc: LessonDoc;
};

export type QuizContentItem = CourseContentBaseItem & {
  type: "quiz";
  doc: QuizDoc;
  questionCount: number;
};

export type CourseContentItem = LessonContentItem | QuizContentItem;

export type CourseChapter = {
  chapter: ChapterDoc;
  contents: CourseContentItem[];
};

export type CourseContentData = {
  course: CourseDoc & {
    totalDurationMinutes: number;
    totalLessons: number;
    totalQuizzes: number;
  };
  chapters: CourseChapter[];
  enrollment: Doc<"course_enrollments"> | null;
};
