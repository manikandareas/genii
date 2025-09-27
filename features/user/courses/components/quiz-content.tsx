"use client";

import { ChevronLeft, ChevronRight, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/features/shared/components/ui/button";
import { useCourseContent } from "../contexts/course-content-context";
import { CourseContentItem, QuizContentItem } from "../types";

interface QuizContentProps {
  quizSlug: string;
}

function resolveTypeLabel(item: CourseContentItem | undefined) {
  if (!item) return "";
  return item.type === "lesson" ? "Pelajaran" : "Quiz";
}

function buildHref(courseSlug: string, item: CourseContentItem) {
  return `/courses/${courseSlug}/${item.type === "lesson" ? "l" : "q"}/${item.doc.slug}`;
}

export default function QuizContent({ quizSlug }: QuizContentProps) {
  const { course, orderedContents, getContentBySlug } = useCourseContent();
  const currentItem = getContentBySlug(quizSlug) as QuizContentItem | undefined;

  const [hasStarted, setHasStarted] = useState(false);

  const currentIndex = useMemo(
    () => orderedContents.findIndex((item) => item.doc.slug === quizSlug),
    [orderedContents, quizSlug],
  );

  const previousItem =
    currentIndex > 0 ? orderedContents[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < orderedContents.length - 1
      ? orderedContents[currentIndex + 1]
      : undefined;

  if (!currentItem || currentItem.type !== "quiz") {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
        Quiz tidak ditemukan. Pastikan Anda mengakses slug quiz yang valid.
      </div>
    );
  }

  const questionCount = currentItem.doc.questions.length;

  return (
    <div className="space-y-20">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">
              {currentItem.doc.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentItem.chapterTitle ?? "Pelajaran"}
            </p>
          </div>
        </div>
      </header>

      <section className="pb-32">
        {!hasStarted ? (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Quiz Overview Card */}
            <div className="">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-highlight/20 p-2">
                      <svg
                        className="h-5 w-5 text-highlight"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {currentItem.doc.title}
                    </h1>
                  </div>

                  {currentItem.doc.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {currentItem.doc.description}
                    </p>
                  )}
                </div>

                {/* Quiz Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-muted/50 p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {questionCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pertanyaan
                    </div>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {Math.ceil(questionCount * 1.5)}
                    </div>
                    <div className="text-sm text-muted-foreground">Menit</div>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {currentItem.doc.maxAttempt || "∞"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Percobaan
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/20 p-6">
                  <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                    Petunjuk Quiz
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      Baca setiap pertanyaan dengan teliti sebelum memilih
                      jawaban
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      Pilih satu jawaban yang paling tepat untuk setiap
                      pertanyaan
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      Anda dapat mengubah jawaban sebelum mengirim quiz
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      Klik &quot;Mulai Quiz&quot; untuk memulai pengerjaan
                    </li>
                  </ul>
                </div>

                {/* Start Button */}

                <Button
                  className="w-full"
                  onClick={() => setHasStarted(true)}
                  size="lg"
                >
                  Mulai Quiz <SendHorizonal />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            {/* Quiz Content - Will be implemented in next phase */}
            <div className="rounded-3xl border border-border bg-card p-8 text-center">
              <h2 className="mb-4 text-xl font-semibold">Quiz Dimulai!</h2>
              <p className="text-muted-foreground">
                Implementasi quiz interaktif akan ditambahkan di sini.
              </p>
              <Button
                onClick={() => setHasStarted(false)}
                variant="outline"
                className="mt-4"
              >
                Kembali ke Overview
              </Button>
            </div>
          </div>
        )}
      </section>

      <footer className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-[0_20px_60px_hsl(var(--muted)/0.45)] md:flex-row md:items-center md:justify-between">
        {previousItem && (
          <Link
            href={buildHref(course.slug, previousItem)}
            className="group flex min-w-[180px] items-center gap-2 rounded-full border border-border px-4 py-2 text-muted-foreground transition hover:border-border/60 hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {resolveTypeLabel(previousItem)} Sebelumnya
              </span>
              <span className="text-sm font-semibold text-inherit">
                {previousItem.doc.title}
              </span>
            </div>
          </Link>
        )}

        {nextItem && (
          <Link
            href={buildHref(course.slug, nextItem)}
            className="group flex min-w-[200px] items-center gap-2 rounded-full border border-highlight/40 bg-highlight/20 px-4 py-2 text-highlight transition hover:border-highlight/60 hover:bg-highlight/30"
          >
            <div className="flex flex-col text-left">
              <span className="text-[11px] uppercase tracking-wide text-highlight/70">
                {resolveTypeLabel(nextItem)} Berikutnya
              </span>
              <span className="text-sm font-semibold text-highlight">
                {nextItem.doc.title}
              </span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </footer>
    </div>
  );
}
