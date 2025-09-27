'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useCourseContent } from "../../course-content-context";
import type { CourseContentItem } from "../../types";

interface LessonContentProps {
  lessonSlug: string;
}

type RichTextChild = {
  text?: string;
};

type RichTextListItem = {
  children?: RichTextChild[];
};

type RichTextNode = {
  type?: string;
  level?: number;
  children?: RichTextChild[];
  items?: RichTextListItem[];
};

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

function renderRichNode(node: RichTextNode, index: number) {
  const children = Array.isArray(node?.children) ? node.children : [];
  const textContent = children.map((child) => child?.text ?? "").join(" ");

  if (node?.type === "heading") {
    const HeadingTag = (`h${Math.min(node.level ?? 2, 4)}`) as keyof JSX.IntrinsicElements;
    return (
      <HeadingTag key={`heading-${index}`} className="mt-8 text-2xl font-semibold tracking-tight text-white">
        {textContent}
      </HeadingTag>
    );
  }

  if (node?.type === "list") {
    return (
      <ul key={`list-${index}`} className="ml-6 list-disc space-y-2 text-base leading-relaxed text-white/70">
        {(node.items ?? []).map((item, idx: number) => (
          <li key={`list-item-${idx}`}>
            {Array.isArray(item?.children)
              ? item.children.map((child) => child?.text ?? "").join(" ")
              : ""}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={`paragraph-${index}`} className="text-base leading-relaxed text-white/70">
      {textContent ||
        "Konten rich text simulasi. Sambungkan dengan data editor asli untuk menampilkan materi pelajaran secara penuh."}
    </p>
  );
}

export default function LessonContent({ lessonSlug }: LessonContentProps) {
  const { course, chapters, orderedContents, getContentBySlug } = useCourseContent();
  const currentItem = getContentBySlug(lessonSlug);

  const [isCompleted, setIsCompleted] = useState(
    currentItem?.type === "lesson" && currentItem.status === "completed",
  );

  const lessonChapter = useMemo(
    () =>
      chapters.find((chapter) =>
        chapter.contents.some((content) => content.doc.slug === lessonSlug),
      ),
    [chapters, lessonSlug],
  );

  const currentIndex = useMemo(
    () => orderedContents.findIndex((item) => item.doc.slug === lessonSlug),
    [lessonSlug, orderedContents],
  );

  const previousItem = currentIndex > 0 ? orderedContents[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < orderedContents.length - 1
      ? orderedContents[currentIndex + 1]
      : undefined;

  const lessonItems = useMemo(
    () => orderedContents.filter((item) => item.type === "lesson"),
    [orderedContents],
  );
  const lessonPosition = lessonItems.findIndex((item) => item.doc.slug === lessonSlug);

  if (!currentItem || currentItem.type !== "lesson") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
        Pelajaran tidak ditemukan di data dummy. Pastikan slug sesuai dengan struktur mock data.
      </div>
    );
  }

  const richContent = currentItem.doc.content as
    | {
        data?: {
          nodes?: RichTextNode[];
        };
      }
    | undefined;

  const nodes: RichTextNode[] = Array.isArray(richContent?.data?.nodes)
    ? richContent?.data?.nodes ?? []
    : [];

  const fallbackNode: RichTextNode = {
    children: [{ text: currentItem.summary }],
  };

  return (
    <div className="space-y-12">
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-semibold uppercase tracking-wide text-white/70">
              {lessonChapter?.chapter.title ?? "Pelajaran"}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <Clock className="h-4 w-4 text-highlight" />
              {formatDuration(currentItem.estimatedDurationMinutes)}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <Sparkles className="h-4 w-4 text-highlight" />
              {course.difficulty === "beginner"
                ? "Beginner"
                : course.difficulty === "intermediate"
                ? "Intermediate"
                : "Advanced"}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <BookOpen className="h-4 w-4 text-highlight" />
              {lessonPosition >= 0 ? lessonPosition + 1 : "-"}/{lessonItems.length}
            </span>
          </div>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-white/50">
              {course.title}
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {currentItem.doc.title}
            </h1>
            <p className="max-w-3xl text-lg text-white/70">{currentItem.summary}</p>
          </div>
          {currentItem.doc.videoUrl ? (
            <Link
              href={currentItem.doc.videoUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-highlight/40 bg-highlight/20 px-4 py-2 text-sm font-semibold text-highlight transition hover:border-highlight/60 hover:bg-highlight/30"
            >
              <Play className="h-4 w-4" /> Tonton Video Pendamping
            </Link>
          ) : null}
        </section>

        <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_80px_rgba(9,12,32,0.45)]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.35),transparent_60%)]" />
          <div className="space-y-6">
            <div className="rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(125,76,255,0.32),rgba(29,78,216,0.76))] p-6 text-white shadow-inner">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Kursus</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{course.title}</h3>
              <p className="mt-2 text-sm text-white/70">{course.description}</p>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                <span>Bab</span>
                <span className="font-semibold text-white">{chapters.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                <span>Pelajaran</span>
                <span className="font-semibold text-white">{course.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                <span>Durasi Total</span>
                <span className="font-semibold text-white">
                  {formatDuration(course.totalDurationMinutes)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </header>

      <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-base prose-p:leading-relaxed prose-p:text-white/70">
        {nodes.length
          ? nodes.map((node, index) => renderRichNode(node, index))
          : renderRichNode(fallbackNode, 0)}
      </article>

      <footer className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 shadow-[0_20px_60px_rgba(9,10,30,0.45)] md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() => setIsCompleted((value) => !value)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition",
            isCompleted
              ? "bg-emerald-400 text-emerald-950 shadow-[0_18px_45px_rgba(16,185,129,0.35)]"
              : "border border-white/10 bg-white/10 text-white hover:border-white/20 hover:bg-white/15",
          )}
        >
          <CheckCircle2 className={cn("h-4 w-4", isCompleted ? "text-emerald-800" : "text-highlight")} />
          {isCompleted ? "Pelajaran telah diselesaikan" : "Tandai pelajaran selesai"}
        </button>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          {previousItem && (
            <Link
              href={buildHref(course.slug, previousItem)}
              className="group flex min-w-[180px] items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wide text-white/40">
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
