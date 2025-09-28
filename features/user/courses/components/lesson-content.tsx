"use client";

import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PanelLeft,
  TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import type { Value } from "platejs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { queryClient } from "@/contexts/convex-client-provider";
import { api } from "@/convex/_generated/api";
import { Button } from "@/features/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/features/shared/components/ui/drawer";
import CourseSidebar from "@/features/user/courses/components/course-sidebar";
import { LessonContentRenderer } from "@/features/user/courses/components/lesson-content-renderer";
import { cn } from "@/lib/utils";
import { SectionAwareAsk } from "../../agent/components/section-aware-ask";
import { useCourseContent } from "../contexts/course-content-context";
import { CourseContentItem } from "../types";
import { normalisePlateValue } from "../utils/content-utils";

interface LessonContentProps {
  lessonSlug: string;
}

function resolveTypeLabel(item: CourseContentItem | undefined) {
  if (!item) return "";
  return item.type === "lesson" ? "Pelajaran" : "Quiz";
}

function buildHref(courseSlug: string, item: CourseContentItem) {
  return `/courses/${courseSlug}/${item.type === "lesson" ? "l" : "q"}/${item.doc.slug}`;
}

export default function LessonContent({ lessonSlug }: LessonContentProps) {
  const {
    course,
    orderedContents,
    getContentBySlug,
    enrollment,
    updateEnrollment,
  } = useCourseContent();

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const currentItem = getContentBySlug(lessonSlug);

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

  const lessonValue: Value = useMemo(() => {
    if (currentItem?.type !== "lesson") {
      return [] as Value;
    }
    return normalisePlateValue(currentItem.doc.content) as Value;
  }, [currentItem]);

  const hasContent = lessonValue.length > 0;
  const isCompleted =
    currentItem?.type === "lesson" && currentItem.status === "completed";
  const isEnrolled = Boolean(enrollment?._id);

  const enrollmentQuery = useMemo(
    () =>
      convexQuery(api.users.courses.queries.getEnrollmentForCourse, {
        courseId: course._id,
      }),
    [course._id],
  );

  const setLessonCompletion = useConvexMutation(
    api.users.courses.mutations.setLessonCompletion,
  );

  const { mutateAsync: markCompletion, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!currentItem || currentItem.type !== "lesson") {
        throw new Error("Lesson tidak tersedia");
      }

      const updatedEnrollment = await setLessonCompletion({
        courseId: course._id,
        lessonId: currentItem.doc._id,
        completed: true,
      });
      return updatedEnrollment;
    },
    onSuccess: async (updatedEnrollment) => {
      updateEnrollment(updatedEnrollment);
      await queryClient.invalidateQueries({
        queryKey: enrollmentQuery.queryKey,
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui progres.";
      toast.error("Tidak dapat memperbarui progres", {
        description: message,
      });
    },
  });

  const handleMarkCompletion = useCallback(async () => {
    if (!isEnrolled) {
      toast.info("Enroll ke kursus untuk menandai progres.");
      return;
    }
    if (!currentItem || currentItem.type !== "lesson") {
      toast.error("Lesson tidak ditemukan.");
      return;
    }

    if (isCompleted) {
      return;
    }

    try {
      await markCompletion();
      toast.success("Pelajaran ditandai selesai.");
    } catch {
      // Error already ditangani di onError
    }
  }, [currentItem, isCompleted, isEnrolled, markCompletion]);

  const markCompleteLabel = !isEnrolled
    ? "Enroll untuk melacak progres"
    : isCompleted
      ? "Pelajaran telah diselesaikan"
      : "Tandai pelajaran selesai";

  useEffect(() => {
    setSidebarOpen(false);
  }, [lessonSlug]);

  if (!currentItem || currentItem.type !== "lesson") {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
        Pelajaran tidak ditemukan. Pastikan Anda mengakses slug yang valid.
      </div>
    );
  }

  return (
    <div className="relative">
      <header className="flex gap-4 items-center md:justify-between">
        <Link href={`/courses/${course.slug}`}>
          <Button variant="ghost" size={"icon"}>
            <ChevronLeft />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground text-wrap text-center">
              {currentItem.doc.title}
            </p>
          </div>
        </div>
        <div className="items-center gap-3 hidden md:flex">
          <Button
            className="text-muted-foreground"
            size="icon"
            variant="ghost"
            title="Buka artifact"
          >
            <TerminalSquare /> Artifacts
          </Button>
        </div>
      </header>

      <section className="pb-32">
        {hasContent ? (
          <LessonContentRenderer
            content={lessonValue}
            className="prose prose-invert max-w-none"
          />
        ) : (
          <p className="text-base leading-relaxed text-muted-foreground">
            {currentItem.summary ||
              "Konten pelajaran belum tersedia. Silakan cek kembali nanti."}
          </p>
        )}
      </section>

      <div className="py-32 space-y-4 border-t border-border">
        <h3 className="text-2xl font-semibold text-foreground">
          Kamu Menyelesaikan Pelajaran Ini
        </h3>
        <p className="text-base text-muted-foreground">
          Simpan perjalanan belajar kamu dengan tombol berikut:
        </p>
        <Button
          type="button"
          disabled={!isEnrolled || isCompleted || isUpdating}
          onClick={handleMarkCompletion}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin text-highlight" />
          ) : (
            <CheckCircle2
              className={cn(
                "h-4 w-4",
                isCompleted ? "text-emerald-800" : "text-highlight",
              )}
            />
          )}
          {markCompleteLabel}
        </Button>
      </div>

      <footer className="flex gap-6 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-[0_20px_60px_hsl(var(--muted)/0.45)] items-center justify-between">
        {previousItem && (
          <Link
            href={buildHref(course.slug, previousItem)}
            className="group flex md:min-w-[180px] items-center gap-2 rounded-full border border-border px-4 py-2 text-muted-foreground transition hover:border-border/60 hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <div className="flex-col text-left hidden md:flex">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {resolveTypeLabel(previousItem)} Sebelumnya
              </span>
              <span className="text-sm font-semibold text-inherit">
                {previousItem.doc.title}
              </span>
            </div>
            <span className="text-sm font-semibold text-inherit md:hidden">
              Sebelumnya
            </span>
          </Link>
        )}

        {nextItem && (
          <Link
            href={buildHref(course.slug, nextItem)}
            className="group flex md:min-w-[200px] items-center gap-2 rounded-full border border-highlight/40 bg-highlight/20 px-4 py-2 text-highlight transition hover:border-highlight/60 hover:bg-highlight/30"
          >
            <div className=" flex-col text-left hidden md:flex">
              <span className="text-[11px] uppercase tracking-wide text-highlight/70">
                {resolveTypeLabel(nextItem)} Berikutnya
              </span>
              <span className="text-sm font-semibold text-highlight">
                {nextItem.doc.title}
              </span>
            </div>
            <span className="text-sm font-semibold text-highlight md:hidden">
              Lanjut
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </footer>

      <SectionAwareAsk lessonId={currentItem.doc._id} />

      <Drawer open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="default"
            aria-label="Buka daftar pelajaran"
            className="fixed bottom-6 right-6 z-50 md:hidden"
          >
            <PanelLeft className="h-5 w-5" />

            <span>Daftar pelajaran</span>
          </Button>
        </DrawerTrigger>
        <DrawerTitle className="sr-only">Daftar Pelajaran</DrawerTitle>
        <DrawerContent className="lg:hidden border-none bg-transparent shadow-none">
          <div className="mx-auto h-[75vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-sidebar shadow-[0_15px_45px_hsl(var(--muted)/0.35)]">
            <CourseSidebar variant="drawer" className="h-full" />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
