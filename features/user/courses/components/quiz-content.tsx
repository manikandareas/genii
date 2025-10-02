"use client";

import {
  ChevronLeft,
  ChevronRight,
  SendHorizonal,
  Clock,
  Trophy,
  Calendar,
  Eye,
  Library,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { useCourseContent } from "../contexts/course-content-context";
import { CourseContentItem, QuizContentItem } from "../types";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/features/shared/components/ui/drawer";
import CourseSidebar from "./course-sidebar";

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
  const router = useRouter();
  const { course, orderedContents, getContentBySlug } = useCourseContent();
  const currentItem = getContentBySlug(quizSlug) as QuizContentItem | undefined;
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Fetch quiz attempts history
  const { data: quiz } = useQuery(
    convexQuery(api.users.quizzes.queries.getBySlug, {
      slug: quizSlug,
    }),
  );

  const { data: attempts } = useQuery(
    convexQuery(api.users.quizzes.queries.getAttemptsByQuiz, {
      quizId: quiz?._id as Id<"quizzes">,
    }),
  );

  const completedAttempts =
    attempts?.filter((a) => a.status === "graded") || [];
  const hasAttempts = completedAttempts.length > 0;
  const bestAttempt = completedAttempts.reduce(
    (best, current) =>
      (current.score ?? 0) > (best?.score ?? 0) ? current : best,
    completedAttempts[0],
  );
  const latestAttempt = completedAttempts[0]; // Already sorted by updatedAt desc

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
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Quiz History Section */}
          {hasAttempts && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Riwayat Pengerjaan</h2>
                <Badge variant="secondary">
                  {completedAttempts.length} Percobaan
                </Badge>
              </div>

              {/* Best Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">
                      Nilai Terbaik
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {bestAttempt?.score ?? 0}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {bestAttempt?.correctCount ?? 0} dari{" "}
                    {bestAttempt?.totalQuestions ?? 0} benar
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Percobaan Terakhir
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {latestAttempt?.score ?? 0}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {latestAttempt?.submittedAt
                      ? new Date(latestAttempt.submittedAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Attempts List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Semua Percobaan
                </h3>
                {completedAttempts.slice(0, 3).map((attempt) => {
                  const isPassed = (attempt.percentage ?? 0) >= 70;
                  const formatDuration = (ms?: number) => {
                    if (!ms) return "N/A";
                    const minutes = Math.floor(ms / 60000);
                    const seconds = Math.floor((ms % 60000) / 1000);
                    return `${minutes}m ${seconds}s`;
                  };

                  return (
                    <div
                      key={attempt._id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            isPassed
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
                          )}
                        >
                          {attempt.score}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Percobaan #{attempt.attemptNumber}
                            </span>
                            <Badge
                              variant={isPassed ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {isPassed ? "Lulus" : "Belum Lulus"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(attempt.durationMs)}
                            </span>
                            <span>
                              {attempt.submittedAt
                                ? new Date(
                                    attempt.submittedAt,
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/courses/${course.slug}/q/${quizSlug}/result?attemptId=${attempt._id}`,
                          )
                        }
                      >
                        <Eye className="w-4 h-4" />
                        Lihat
                      </Button>
                    </div>
                  );
                })}

                {completedAttempts.length > 3 && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    +{completedAttempts.length - 3} percobaan lainnya
                  </p>
                )}
              </div>
            </Card>
          )}

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
                  <div className="text-sm text-muted-foreground">Percobaan</div>
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
                    Baca setiap pertanyaan dengan teliti sebelum memilih jawaban
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                    Pilih satu jawaban yang paling tepat untuk setiap pertanyaan
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
                onClick={() =>
                  router.push(`/courses/${course.slug}/q/${quizSlug}/play`)
                }
                size="lg"
                disabled={
                  quiz?.maxAttempt
                    ? completedAttempts.length >= quiz.maxAttempt
                    : false
                }
              >
                {quiz?.maxAttempt && completedAttempts.length >= quiz.maxAttempt
                  ? "Batas Percobaan Tercapai"
                  : hasAttempts
                    ? "Coba Lagi"
                    : "Mulai Quiz"}{" "}
                <SendHorizonal />
              </Button>
              {quiz?.maxAttempt && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  {completedAttempts.length} dari {quiz.maxAttempt} percobaan
                  digunakan
                </p>
              )}
            </div>
          </div>
        </div>
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

      <div className="fixed bottom-8 right-6 z-50 md:hidden flex items-center gap-2">
        <Drawer open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <DrawerTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="default"
              aria-label="Buka daftar pelajaran"
            >
              <Library className="h-5 w-5" />

              <span>Kurikulum</span>
            </Button>
          </DrawerTrigger>
          <DrawerTitle className="sr-only">Kurikulum</DrawerTitle>
          <DrawerContent className="lg:hidden border-none bg-transparent shadow-none">
            <div className="mx-auto h-[75vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-sidebar shadow-[0_15px_45px_hsl(var(--muted)/0.35)]">
              <CourseSidebar variant="drawer" className="h-full" />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
