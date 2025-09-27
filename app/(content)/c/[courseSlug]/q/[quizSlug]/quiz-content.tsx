'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useCourseContent } from "../../course-content-context";
import type { CourseContentItem, QuizContentItem } from "../../types";

interface QuizContentProps {
  quizSlug: string;
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} jam ${remaining} menit` : `${hours} jam`;
}

function resolveTypeLabel(item: CourseContentItem | undefined) {
  if (!item) return "";
  return item.type === "lesson" ? "Pelajaran" : "Quiz";
}

function buildHref(courseSlug: string, item: CourseContentItem) {
  return `/c/${courseSlug}/${item.type === "lesson" ? "l" : "q"}/${item.doc.slug}`;
}

export default function QuizContent({ quizSlug }: QuizContentProps) {
  const { course, chapters, orderedContents, getContentBySlug } = useCourseContent();
  const currentItem = getContentBySlug(quizSlug) as QuizContentItem | undefined;

  const [hasStarted, setHasStarted] = useState(false);

  const currentIndex = useMemo(
    () => orderedContents.findIndex((item) => item.doc.slug === quizSlug),
    [orderedContents, quizSlug],
  );

  const previousItem = currentIndex > 0 ? orderedContents[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < orderedContents.length - 1
      ? orderedContents[currentIndex + 1]
      : undefined;

  if (!currentItem || currentItem.type !== "quiz") {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
        Quiz tidak ditemukan di data dummy. Pastikan slug sesuai dengan struktur mock data.
      </div>
    );
  }

  const chapterMeta = chapters.find(
    (chapter) => chapter.chapter._id === currentItem.chapterId,
  );

  const questionCount = currentItem.doc.questions.length;

  return (
    <div className="space-y-12">
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-border bg-card px-3 py-1 font-semibold uppercase tracking-wide text-card-foreground">
              {chapterMeta?.chapter.title ?? "Quiz"}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
              <Clock className="h-4 w-4 text-highlight" />
              {formatDuration(currentItem.estimatedDurationMinutes)}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
              <HelpCircle className="h-4 w-4 text-highlight" />
              {questionCount} Pertanyaan
            </span>
            <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
              <Sparkles className="h-4 w-4 text-highlight" />
              {course.difficulty === "beginner"
                ? "Beginner"
                : course.difficulty === "intermediate"
                ? "Intermediate"
                : "Advanced"}
            </span>
          </div>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{course.title}</p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {currentItem.doc.title}
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground">{currentItem.summary}</p>
          </div>
          <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3">
              <Target className="h-5 w-5 text-highlight" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tujuan</p>
                <p className="font-semibold text-foreground">
                  Validasi pemahaman modul {chapterMeta?.chapter.title ?? "terkait"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-highlight" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Percobaan</p>
                <p className="font-semibold text-foreground">
                  {currentItem.doc.maxAttempt ? `${currentItem.doc.maxAttempt} kali` : 'Tak terbatas'}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHasStarted(true)}
            className={cn(
              "inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition",
              hasStarted
                ? "bg-emerald-400 text-emerald-950 shadow-[0_18px_45px_rgba(16,185,129,0.35)]"
                : "border border-highlight/40 bg-highlight/20 text-highlight hover:border-highlight/60 hover:bg-highlight/30",
            )}
          >
            <CheckCircle2 className={cn("h-5 w-5", hasStarted ? "text-emerald-900" : "text-highlight")} />
            {hasStarted ? "Quiz sedang berlangsung" : "Mulai Quiz"}
          </button>
          {hasStarted ? (
            <p className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-emerald-200">
              Simulasi: quiz telah dimulai. Integrasikan dengan workflow Convex untuk mengarahkan pengguna ke pengalaman quiz interaktif.
            </p>
          ) : null}
        </section>

        <aside className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_35px_80px_hsl(var(--muted)/0.45)]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.25),transparent_65%)]" />
          <div className="space-y-5 text-card-foreground">
            <div className="rounded-2xl border border-border bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Statistik Kursus</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-foreground">
                <div>
                  <p className="text-lg font-semibold">{course.totalLessons}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pelajaran</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{course.totalQuizzes}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Quiz</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{chapters.length}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Bab</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted px-4 py-3">
                <ListChecks className="mt-1 h-5 w-5 text-highlight" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Tips</p>
                  <p className="text-card-foreground">Baca ulang catatan dari pelajaran sebelumnya sebelum memulai quiz.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted px-4 py-3">
                <Sparkles className="mt-1 h-5 w-5 text-highlight" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Skor</p>
                  <p className="text-card-foreground">Anda akan mendapatkan poin ekstra untuk menjawab cepat dan tepat.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </header>

      <section className="grid gap-4 rounded-3xl border border-border bg-card p-6 text-muted-foreground md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">Sebelum Mulai</h2>
          <ul className="space-y-2 text-sm">
            <li>Kuis bersifat adaptif—pertanyaan akan menyesuaikan dengan jawaban Anda.</li>
            <li>Gunakan waktu sebaik mungkin, tapi Anda bisa menjeda jika dibutuhkan.</li>
            <li>Periksa pembahasan setelah selesai untuk memperkuat pemahaman.</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">Setelah Selesai</h2>
          <ul className="space-y-2 text-sm">
            <li>Skor akan langsung tersimpan ke progres kursus Anda.</li>
            <li>Dapatkan rekomendasi materi lanjutan berdasarkan performa.</li>
            <li>Ulangi quiz kapan pun untuk memperbaiki skor terbaik.</li>
          </ul>
        </div>
      </section>

      <footer className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-[0_20px_60px_hsl(var(--muted)/0.45)] md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Simulasi quiz: hubungkan tombol &ldquo;Mulai Quiz&rdquo; dengan alur Convex untuk memuat soal secara real-time.
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
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
        </div>
      </footer>
    </div>
  );
}
