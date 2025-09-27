import type { Id } from "convex/_generated/dataModel";
import type {
  ChapterDoc,
  CourseContentData,
  CourseContentItem,
  CourseChapter,
  CourseDoc,
  LessonDoc,
  QuizDoc,
} from "./types";

const MOCK_NOW = new Date("2024-06-01T09:00:00.000Z").getTime();

const TOPIC_ID = "topic_mock_react_router" as Id<"topics">;
const COURSE_ID = "course_mock_react_router_v7" as Id<"courses">;
const STORAGE_ID = "storage_mock_react_router_cover" as Id<"_storage">;
const CHAPTER_INTRO_ID = "chapter_mock_intro" as Id<"chapters">;
const CHAPTER_BUILD_ID = "chapter_mock_build" as Id<"chapters">;
const CHAPTER_ADVANCED_ID = "chapter_mock_advanced" as Id<"chapters">;
const LESSON_IDS = {
  welcome: "lesson_mock_welcome" as Id<"lessons">,
  reasoning: "lesson_mock_reasoning" as Id<"lessons">,
  install: "lesson_mock_install" as Id<"lessons">,
  directory: "lesson_mock_directory" as Id<"lessons">,
  routingBasics: "lesson_mock_routing_basics" as Id<"lessons">,
  nestedRoutes: "lesson_mock_nested_routes" as Id<"lessons">,
  dynamic: "lesson_mock_dynamic" as Id<"lessons">,
  layouts: "lesson_mock_layouts" as Id<"lessons">,
};
const QUIZ_IDS = {
  intro: "quiz_mock_intro" as Id<"quizzes">,
  routing: "quiz_mock_routing" as Id<"quizzes">,
};

const BASE_CONTENT = {
  type: "doc",
  data: {
    nodes: [
      {
        type: "paragraph",
        children: [
          {
            text: "Konten ini hanya dummy untuk menampilkan struktur halaman. Anda dapat mengganti dengan konten asli dari editor rich text Genii ketika integrasi data sudah siap.",
          },
        ],
      },
    ],
  },
};

const createLessonDoc = (
  overrides: Partial<LessonDoc>,
): LessonDoc => ({
  _id: overrides._id ?? LESSON_IDS.welcome,
  _creationTime: overrides._creationTime ?? MOCK_NOW,
  courseId: overrides.courseId ?? COURSE_ID,
  chapterId: overrides.chapterId ?? CHAPTER_INTRO_ID,
  title: overrides.title ?? "Pelajaran Tanpa Judul",
  slug: overrides.slug ?? "pelajaran-tanpa-judul",
  content: overrides.content ?? BASE_CONTENT,
  videoUrl: overrides.videoUrl,
  updatedAt: overrides.updatedAt ?? MOCK_NOW,
});

const createQuizDoc = (overrides: Partial<QuizDoc>): QuizDoc => ({
  _id: overrides._id ?? QUIZ_IDS.intro,
  _creationTime: overrides._creationTime ?? MOCK_NOW,
  title: overrides.title ?? "Quiz Tanpa Judul",
  slug: overrides.slug ?? "quiz-tanpa-judul",
  description:
    overrides.description ??
    "Quiz ini masih menggunakan data dummy. Hubungkan dengan data Convex saat backend siap.",
  maxAttempt: overrides.maxAttempt,
  courseId: overrides.courseId ?? COURSE_ID,
  chapterId: overrides.chapterId,
  questions:
    overrides.questions ?? [
      {
        question: "Apa itu React Router?",
        options: ["Pustaka routing", "State manager", "Framework CSS", "Database"],
        correctOptionIndex: 0,
        explanation: "React Router adalah pustaka routing untuk React.",
      },
    ],
  updatedAt: overrides.updatedAt ?? MOCK_NOW,
});

const createChapterDoc = (overrides: Partial<ChapterDoc>): ChapterDoc => ({
  _id: overrides._id ?? CHAPTER_INTRO_ID,
  _creationTime: overrides._creationTime ?? MOCK_NOW,
  courseId: overrides.courseId ?? COURSE_ID,
  title: overrides.title ?? "Bab Tanpa Judul",
  slug: overrides.slug ?? "bab-tanpa-judul",
  description:
    overrides.description ??
    "Deskripsi bab dummy. Ubah ketika data asli sudah tersedia.",
  position: overrides.position,
  contentOrder: overrides.contentOrder ?? [],
  updatedAt: overrides.updatedAt ?? MOCK_NOW,
});

const COURSE_DOC: CourseDoc = {
  _id: COURSE_ID,
  _creationTime: MOCK_NOW,
  title: "Belajar Full-stack Dengan React Router v7",
  slug: "belajar-react-router-v7",
  description:
    "Pelajari bagaimana membangun aplikasi React full-stack menggunakan React Router v7, lengkap dengan praktik terbaik dan studi kasus nyata.",
  difficulty: "beginner",
  thumbnail: {
    assetRef: STORAGE_ID,
    url: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=600&q=80",
  },
  trailerUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  topicIds: [TOPIC_ID],
  learningOutcomes: [
    "Memahami konsep dasar routing pada aplikasi single page.",
    "Mengimplementasikan nested routing dan data loading.",
    "Membangun layout dinamis menggunakan outlet dan loader.",
  ],
  resources: [
    { label: "Dokumentasi Resmi React Router", url: "https://reactrouter.com" },
    { label: "Repo Contoh", url: "https://github.com/remix-run/react-router" },
  ],
  featured: true,
  readonly: false,
  updatedAt: MOCK_NOW,
};

const CHAPTER_DOCS: Record<string, ChapterDoc> = {
  intro: createChapterDoc({
    _id: CHAPTER_INTRO_ID,
    title: "Prolog",
    slug: "prolog",
    description: "Mulai perjalanan menguasai React Router v7",
    position: 0,
  }),
  build: createChapterDoc({
    _id: CHAPTER_BUILD_ID,
    title: "Pembahasan",
    slug: "pembahasan",
    description: "Bangun fondasi routing yang kuat",
    position: 1,
  }),
  advanced: createChapterDoc({
    _id: CHAPTER_ADVANCED_ID,
    title: "Lanjutan",
    slug: "lanjutan",
    description: "Strategi lanjutan untuk aplikasi produksi",
    position: 2,
  }),
};

const LESSON_DOCS: Record<string, LessonDoc> = {
  welcome: createLessonDoc({
    _id: LESSON_IDS.welcome,
    title: "Pendahuluan",
    slug: "pendahuluan",
    chapterId: CHAPTER_INTRO_ID,
    content: {
      ...BASE_CONTENT,
      data: {
        nodes: [
          {
            type: "heading",
            level: 2,
            children: [{ text: "Selamat Datang di Kursus" }],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "Di modul ini Anda akan memahami apa itu React Router v7 dan mengapa ia penting untuk aplikasi modern.",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "Kami akan membangun pondasi sebelum masuk ke implementasi yang lebih kompleks.",
              },
            ],
          },
        ],
      },
    },
  }),
  reasoning: createLessonDoc({
    _id: LESSON_IDS.reasoning,
    title: "Kenapa React Router v7?",
    slug: "kenapa-react-router-v7",
    chapterId: CHAPTER_INTRO_ID,
  }),
  install: createLessonDoc({
    _id: LESSON_IDS.install,
    title: "Instalasi",
    slug: "instalasi",
    chapterId: CHAPTER_BUILD_ID,
  }),
  directory: createLessonDoc({
    _id: LESSON_IDS.directory,
    title: "Pengenalan Direktori",
    slug: "pengenalan-direktori",
    chapterId: CHAPTER_BUILD_ID,
  }),
  routingBasics: createLessonDoc({
    _id: LESSON_IDS.routingBasics,
    title: "Routing Basic",
    slug: "routing-basic",
    chapterId: CHAPTER_BUILD_ID,
  }),
  nestedRoutes: createLessonDoc({
    _id: LESSON_IDS.nestedRoutes,
    title: "Routing Nested",
    slug: "routing-nested",
    chapterId: CHAPTER_BUILD_ID,
  }),
  dynamic: createLessonDoc({
    _id: LESSON_IDS.dynamic,
    title: "Routing Dynamic Segments",
    slug: "routing-dynamic-segments",
    chapterId: CHAPTER_ADVANCED_ID,
  }),
  layouts: createLessonDoc({
    _id: LESSON_IDS.layouts,
    title: "Routing Layout",
    slug: "routing-layout",
    chapterId: CHAPTER_ADVANCED_ID,
  }),
};

const QUIZ_DOCS: Record<string, QuizDoc> = {
  intro: createQuizDoc({
    _id: QUIZ_IDS.intro,
    title: "Quiz Prolog",
    slug: "quiz-prolog",
    courseId: COURSE_ID,
    chapterId: CHAPTER_INTRO_ID,
    description: "Uji pemahaman dasar Anda sebelum melangkah lebih jauh.",
    questions: [
      {
        question: "Apa manfaat utama React Router v7?",
        options: [
          "Routing deklaratif",
          "Manajemen state global",
          "Komponen UI siap pakai",
          "Pengelolaan database",
        ],
        correctOptionIndex: 0,
        explanation:
          "React Router v7 memberikan API deklaratif yang memudahkan penulisan rute kompleks.",
      },
      {
        question: "Fitur apa yang membantu membuat layout bersarang?",
        options: ["Outlet", "Reducer", "Suspense", "Signals"],
        correctOptionIndex: 0,
        explanation: "Outlet digunakan untuk menempatkan konten bersarang dalam layout.",
      },
    ],
  }),
  routing: createQuizDoc({
    _id: QUIZ_IDS.routing,
    title: "Quiz Routing",
    slug: "quiz-routing",
    courseId: COURSE_ID,
    chapterId: CHAPTER_BUILD_ID,
    description: "Evaluasi kemampuan routing Anda dengan skenario praktis.",
    questions: [
      {
        question: "Hook apa yang digunakan untuk navigasi imperatif?",
        options: ["useNavigate", "useState", "useContext", "useLoaderData"],
        correctOptionIndex: 0,
        explanation: "useNavigate memberikan API untuk navigasi imperatif.",
      },
    ],
  }),
};

const CHAPTER_CONTENTS: Record<Id<"chapters">, CourseContentItem[]> = {
  [CHAPTER_INTRO_ID]: [
    {
      type: "lesson",
      doc: LESSON_DOCS.welcome,
      summary: "Kenali gambaran besar kursus dan tujuan akhir yang akan dicapai.",
      estimatedDurationMinutes: 8,
      status: "completed",
      order: 1,
      chapterId: CHAPTER_INTRO_ID,
      chapterTitle: CHAPTER_DOCS.intro.title,
    },
    {
      type: "lesson",
      doc: LESSON_DOCS.reasoning,
      summary: "Pelajari alasan migrasi ke React Router v7 serta kemampuan barunya.",
      estimatedDurationMinutes: 12,
      status: "in_progress",
      order: 2,
      chapterId: CHAPTER_INTRO_ID,
      chapterTitle: CHAPTER_DOCS.intro.title,
    },
    {
      type: "quiz",
      doc: QUIZ_DOCS.intro,
      summary: "Tes singkat untuk memastikan Anda siap ke tahap berikutnya.",
      estimatedDurationMinutes: 5,
      questionCount: QUIZ_DOCS.intro.questions.length,
      status: "locked",
      order: 3,
      chapterId: CHAPTER_INTRO_ID,
      chapterTitle: CHAPTER_DOCS.intro.title,
    },
  ],
  [CHAPTER_BUILD_ID]: [
    {
      type: "lesson",
      doc: LESSON_DOCS.install,
      summary: "Setup project dan konfigurasi React Router v7 dari awal.",
      estimatedDurationMinutes: 14,
      status: "locked",
      order: 4,
      chapterId: CHAPTER_BUILD_ID,
      chapterTitle: CHAPTER_DOCS.build.title,
    },
    {
      type: "lesson",
      doc: LESSON_DOCS.directory,
      summary: "Struktur direktori yang membantu menjaga modularitas aplikasi.",
      estimatedDurationMinutes: 10,
      status: "locked",
      order: 5,
      chapterId: CHAPTER_BUILD_ID,
      chapterTitle: CHAPTER_DOCS.build.title,
    },
    {
      type: "lesson",
      doc: LESSON_DOCS.routingBasics,
      summary: "Mengenal rute dasar, loader data, dan action.",
      estimatedDurationMinutes: 18,
      status: "locked",
      order: 6,
      chapterId: CHAPTER_BUILD_ID,
      chapterTitle: CHAPTER_DOCS.build.title,
    },
    {
      type: "lesson",
      doc: LESSON_DOCS.nestedRoutes,
      summary: "Membangun navigasi bertingkat menggunakan nested routes.",
      estimatedDurationMinutes: 22,
      status: "locked",
      order: 7,
      chapterId: CHAPTER_BUILD_ID,
      chapterTitle: CHAPTER_DOCS.build.title,
    },
    {
      type: "quiz",
      doc: QUIZ_DOCS.routing,
      summary: "Evaluasi pemahaman routing dasar dan nested.",
      estimatedDurationMinutes: 7,
      questionCount: QUIZ_DOCS.routing.questions.length,
      status: "locked",
      order: 8,
      chapterId: CHAPTER_BUILD_ID,
      chapterTitle: CHAPTER_DOCS.build.title,
    },
  ],
  [CHAPTER_ADVANCED_ID]: [
    {
      type: "lesson",
      doc: LESSON_DOCS.dynamic,
      summary: "Manfaatkan dynamic segments dan deferred data.",
      estimatedDurationMinutes: 20,
      status: "locked",
      order: 9,
      chapterId: CHAPTER_ADVANCED_ID,
      chapterTitle: CHAPTER_DOCS.advanced.title,
    },
    {
      type: "lesson",
      doc: LESSON_DOCS.layouts,
      summary: "Strategi layout kompleks dengan outlet dan context.",
      estimatedDurationMinutes: 16,
      status: "locked",
      order: 10,
      chapterId: CHAPTER_ADVANCED_ID,
      chapterTitle: CHAPTER_DOCS.advanced.title,
    },
  ],
};

Object.values(CHAPTER_CONTENTS).forEach((items) => {
  items.sort((a, b) => a.order - b.order);
});

const buildCourseChapters = (): CourseChapter[] =>
  Object.values(CHAPTER_DOCS)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((chapter) => ({
      chapter,
      contents: CHAPTER_CONTENTS[chapter._id] ?? [],
    }));

export const buildMockCourseContent = (courseSlug: string): CourseContentData => {
  const chapters = buildCourseChapters();

  const totals = chapters.reduce(
    (acc, entry) => {
      entry.contents.forEach((content) => {
        acc.totalDurationMinutes += content.estimatedDurationMinutes;
        if (content.type === "lesson") {
          acc.totalLessons += 1;
        } else {
          acc.totalQuizzes += 1;
        }
      });
      return acc;
    },
    { totalDurationMinutes: 0, totalLessons: 0, totalQuizzes: 0 },
  );

  const courseWithTotals: CourseContentData["course"] = {
    ...COURSE_DOC,
    slug: courseSlug || COURSE_DOC.slug,
    totalDurationMinutes: totals.totalDurationMinutes,
    totalLessons: totals.totalLessons,
    totalQuizzes: totals.totalQuizzes,
  };

  return {
    course: courseWithTotals,
    chapters,
  };
};
