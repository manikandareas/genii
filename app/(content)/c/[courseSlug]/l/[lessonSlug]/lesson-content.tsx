"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize,
  TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/features/shared/components/ui/button";
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
    const HeadingTag =
      `h${Math.min(node.level ?? 2, 4)}` as keyof JSX.IntrinsicElements;
    return (
      <HeadingTag
        key={`heading-${index}`}
        className="mt-8 text-2xl font-semibold tracking-tight text-foreground"
      >
        {textContent}
      </HeadingTag>
    );
  }

  if (node?.type === "list") {
    return (
      <ul
        key={`list-${index}`}
        className="ml-6 list-disc space-y-2 text-base leading-relaxed text-muted-foreground"
      >
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
    <p
      key={`paragraph-${index}`}
      className="text-base leading-relaxed text-muted-foreground"
    >
      {textContent ||
        "Konten rich text simulasi. Sambungkan dengan data editor asli untuk menampilkan materi pelajaran secara penuh."}
    </p>
  );
}

export default function LessonContent({ lessonSlug }: LessonContentProps) {
  const { course, chapters, orderedContents, getContentBySlug } =
    useCourseContent();
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

  const previousItem =
    currentIndex > 0 ? orderedContents[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < orderedContents.length - 1
      ? orderedContents[currentIndex + 1]
      : undefined;

  const lessonItems = useMemo(
    () => orderedContents.filter((item) => item.type === "lesson"),
    [orderedContents],
  );
  const lessonPosition = lessonItems.findIndex(
    (item) => item.doc.slug === lessonSlug,
  );

  if (!currentItem || currentItem.type !== "lesson") {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
        Pelajaran tidak ditemukan di data dummy. Pastikan slug sesuai dengan
        struktur mock data.
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
    ? (richContent?.data?.nodes ?? [])
    : [];

  const fallbackNode: RichTextNode = {
    children: [{ text: currentItem.summary }],
  };

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <Link href={`/courses/${course.slug}`}>
          <Button size={"icon"} variant={"ghost"} title="kembali ke kursus">
            <ArrowLeft className="text-muted-foreground" />
          </Button>
        </Link>
        <p className="text-lg font-semibold">{currentItem.doc.title}</p>
        <div className="flex items-center gap-8">
          <Button
            className="text-muted-foreground"
            size={"icon"}
            variant={"ghost"}
            title="kembali ke kursus"
          >
            <TerminalSquare /> Artifact
          </Button>
          <Button size={"icon"} variant={"ghost"} title="kembali ke kursus">
            <Maximize className="text-muted-foreground" />
          </Button>
        </div>
      </header>

      <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-base prose-p:leading-relaxed prose-p:text-muted-foreground">
        {nodes.length
          ? nodes.map((node, index) => renderRichNode(node, index))
          : renderRichNode(fallbackNode, 0)}
      </article>

      <footer className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-[0_20px_60px_hsl(var(--muted)/0.45)] md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() => setIsCompleted((value) => !value)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition",
            isCompleted
              ? "bg-emerald-400 text-emerald-950 shadow-[0_18px_45px_rgba(16,185,129,0.35)]"
              : "border border-border bg-muted text-foreground hover:border-border/60 hover:bg-muted/80",
          )}
        >
          <CheckCircle2
            className={cn(
              "h-4 w-4",
              isCompleted ? "text-emerald-800" : "text-highlight",
            )}
          />
          {isCompleted
            ? "Pelajaran telah diselesaikan"
            : "Tandai pelajaran selesai"}
        </button>

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
