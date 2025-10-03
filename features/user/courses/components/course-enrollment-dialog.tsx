"use client";

import { useCallback, useMemo } from "react";

import { SignInButton } from "@clerk/nextjs";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Info, Loader2, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { queryClient } from "@/contexts/convex-client-provider";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/features/shared/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { COURSE_DETAIL_COPY } from "../constants/course-detail-copy";
import { CourseBadge } from "./course-badge";

export type EnrollmentCourse = Pick<
  Doc<"courses">,
  | "_id"
  | "title"
  | "description"
  | "difficulty"
  | "learningOutcomes"
  | "thumbnail"
  | "readonly"
> & {
  slug?: Doc<"courses">["slug"];
};

type CourseEnrollmentDialogProps = {
  course: EnrollmentCourse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: { firstLessonSlug: string | null; courseSlug: string }) => void | Promise<void>;
};

type CourseContentTarget = {
  id: string;
  slug: string;
  type: "lesson" | "quiz";
};

export function CourseEnrollmentDialog({
  course,
  open,
  onOpenChange,
  onSuccess,
}: CourseEnrollmentDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const router = useRouter();

  const userQuery = useQuery(convexQuery(api.users.queries.getMe, {}));

  const enrollmentQueryOptions = useMemo(
    () =>
      convexQuery(api.users.courses.queries.getEnrollmentForCourse, {
        courseId: course._id,
      }),
    [course._id],
  );

  const { data: enrollment, isLoading: isEnrollmentLoading } = useQuery(
    enrollmentQueryOptions,
  );

  const courseContentResult = useQuery(
    convexQuery(api.users.courses.queries.getCourseContent, {
      courseSlug: course.slug as string,
    }),
  );
  const courseContent = courseContentResult.data;

  const enrollMutation = useConvexMutation(
    api.users.courses.mutations.enrollInCourse,
  );

  const { mutateAsync: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: (input: { courseId: Id<"courses"> }) => enrollMutation(input),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: enrollmentQueryOptions.queryKey,
      });
      onOpenChange(false);

      // Call custom onSuccess handler if provided
      if (onSuccess) {
        await onSuccess({
          firstLessonSlug: data.firstLessonSlug,
          courseSlug: data.courseSlug,
        });
      } else {
        // Default behavior: show toast
        toast.success(COURSE_DETAIL_COPY.success.enrolled, {
          description: COURSE_DETAIL_COPY.success.enrolledDesc,
        });
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : COURSE_DETAIL_COPY.error.enrollmentFailedDesc;
      toast.error(COURSE_DETAIL_COPY.error.enrollmentFailed, {
        description: message,
      });
    },
  });

  const isAuthenticated = Boolean(userQuery.data?._id);
  const alreadyEnrolled = Boolean(enrollment?._id);

  const orderedCourseContents = useMemo<CourseContentTarget[]>(() => {
    if (!courseContent?.chapters?.length) {
      return [];
    }

    const sortedChapters = [...courseContent.chapters].sort((a, b) => {
      const aPosition = a.position ?? a._creationTime;
      const bPosition = b.position ?? b._creationTime;
      return aPosition - bPosition;
    });

    const items: CourseContentTarget[] = [];

    sortedChapters.forEach((chapter) => {
      const sortedEntries = (chapter.contentOrder ?? [])
        .map((entry, index) => ({ entry, index }))
        .sort((a, b) => {
          const aPosition = a.entry.position ?? a.index;
          const bPosition = b.entry.position ?? b.index;
          return aPosition - bPosition;
        });

      sortedEntries.forEach(({ entry }) => {
        if (!entry?.contentId || !entry.contentType) {
          return;
        }

        const contentId = String(entry.contentId);

        if (entry.contentType === "lesson") {
          const lesson = courseContent.lessons?.[contentId];
          if (lesson?.slug) {
            items.push({
              id: contentId,
              slug: lesson.slug,
              type: "lesson",
            });
          }
        }

        if (entry.contentType === "quiz") {
          const quiz = courseContent.quizzes?.[contentId];
          if (quiz?.slug) {
            items.push({
              id: contentId,
              slug: quiz.slug,
              type: "quiz",
            });
          }
        }
      });
    });

    return items;
  }, [courseContent]);

  const { nextContent, isReviewMode } = useMemo(() => {
    if (!orderedCourseContents.length) {
      return { nextContent: null, isReviewMode: false } as const;
    }

    const completedIds = new Set(
      (enrollment?.contentsCompleted ?? []).map((entry) => entry.contentId),
    );

    const firstIncompleteIndex = orderedCourseContents.findIndex(
      (content) => !completedIds.has(content.id),
    );

    if (firstIncompleteIndex === -1) {
      return {
        nextContent: orderedCourseContents[0],
        isReviewMode: true,
      } as const;
    }

    return {
      nextContent: orderedCourseContents[firstIncompleteIndex],
      isReviewMode: false,
    } as const;
  }, [orderedCourseContents, enrollment?.contentsCompleted]);

  const nextContentHref = useMemo(() => {
    if (!nextContent || !course.slug) {
      return null;
    }

    if (nextContent.type === "lesson") {
      return `/courses/${course.slug}/l/${nextContent.slug}`;
    }

    if (nextContent.type === "quiz") {
      return `/courses/${course.slug}/q/${nextContent.slug}`;
    }

    return null;
  }, [nextContent, course.slug]);

  const enrolledCtaLabel = isReviewMode
    ? COURSE_DETAIL_COPY.cta.enrolled.review
    : COURSE_DETAIL_COPY.cta.enrolled.continue;

  const handleContinueClick = useCallback(() => {
    if (nextContentHref) {
      router.push(nextContentHref);
    }
    onOpenChange(false);
  }, [nextContentHref, onOpenChange, router]);

  const learningOutcomes = useMemo(() => {
    const fallback = COURSE_DETAIL_COPY.contents.outcomes
      .defaultItems as unknown as string[];
    return course.learningOutcomes?.length
      ? course.learningOutcomes.slice(0, 3)
      : fallback.slice(0, 3);
  }, [course.learningOutcomes]);

  const highlights = useMemo(
    () => [
      {
        icon: <Clock3 className="h-4 w-4" />,
        label: COURSE_DETAIL_COPY.enrollDialog.features.duration("20+"),
      },
      {
        icon: <Trophy className="h-4 w-4" />,
        label: COURSE_DETAIL_COPY.enrollDialog.features.topics,
      },
      {
        icon: <Sparkles className="h-4 w-4" />,
        label: COURSE_DETAIL_COPY.enrollDialog.features.access,
      },
    ],
    [],
  );

  const infoSection = (
    <div className="space-y-8">
      {/* Course Thumbnail */}
      {course.thumbnail?.url && (
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/10 shadow-sm">
          <Image
            alt={course.title}
            className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
            height={192}
            src={course.thumbnail.url}
            width={640}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <CourseBadge difficulty={course.difficulty} />
          <Badge variant="outline" className="text-xs font-medium">
            {COURSE_DETAIL_COPY.enrollDialog.socialProof}
          </Badge>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            {COURSE_DETAIL_COPY.enrollDialog.title}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {COURSE_DETAIL_COPY.enrollDialog.subtitle}
          </p>
        </div>
      </div>

      {/* Course Highlights */}
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-muted/20 to-muted/10 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              className="flex flex-col gap-3 rounded-xl bg-background/80 p-4 transition-colors hover:bg-background/90"
              key={item.label}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                {item.icon}
              </span>
              <span className="text-sm font-semibold leading-snug text-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-4 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground">
            {COURSE_DETAIL_COPY.enrollDialog.aboutTitle}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {COURSE_DETAIL_COPY.enrollDialog.aboutDescription}
          </p>
        </div>
        <ul className="space-y-3 text-sm">
          {learningOutcomes.map((item) => (
            <li className="flex items-start gap-3" key={item}>
              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              <span className="text-foreground leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const actionSection = (
    <div
      className={isDesktop ? "space-y-6 self-start sticky top-6" : "space-y-6"}
    >
      {/* Action Card Container */}
      <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-lg backdrop-blur-sm">
        {isAuthenticated ? (
          alreadyEnrolled ? (
            /* Already Enrolled State */
            <div className="space-y-5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <span className="font-bold text-emerald-600">
                    {COURSE_DETAIL_COPY.success.enrolled}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {COURSE_DETAIL_COPY.success.enrolledDesc}
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-11 font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={handleContinueClick}
                >
                  {enrolledCtaLabel}
                </Button>
                {/* <Button
                  className="w-full h-11 font-medium"
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                >
                  {COURSE_DETAIL_COPY.cta.enrolled.review}
                </Button> */}
              </div>
            </div>
          ) : course.readonly ? (
            /* Readonly Course - Cannot Enroll */
            <div className="space-y-5">
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-bold text-foreground">
                  Kursus Akan Segera Hadir
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kursus ini sedang dalam tahap persiapan
                </p>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold shadow-md transition-all duration-200"
                disabled={true}
                size="lg"
                variant="secondary"
              >
                Belum Tersedia
              </Button>

              <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Informasi
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      Kursus ini belum bisa di-enroll dalam waktu dekat. Kami sedang mempersiapkan konten terbaik untuk Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enrollment CTA */
            <div className="space-y-5">
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-bold text-foreground">
                  Mulai Belajar Sekarang
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bergabung dengan ribuan siswa lainnya
                </p>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isEnrolling || isEnrollmentLoading}
                onClick={() => enroll({ courseId: course._id })}
                size="lg"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {COURSE_DETAIL_COPY.enrollDialog.ctaProcessing}
                  </>
                ) : (
                  COURSE_DETAIL_COPY.enrollDialog.ctaPrimary
                )}
              </Button>

              <div className="rounded-lg bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground font-medium">
                  {COURSE_DETAIL_COPY.enrollDialog.urgency}
                </p>
              </div>
            </div>
          )
        ) : (
          /* Sign In Required */
          <div className="space-y-5 text-center">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">
                Akses Diperlukan
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {COURSE_DETAIL_COPY.error.missingDataDesc}
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4">
              <SignInButton fallbackRedirectUrl={pathname} mode="modal">
                <Button
                  className="w-full h-11 font-semibold"
                  variant="secondary"
                >
                  Sign In Untuk Mulai Belajar
                </Button>
              </SignInButton>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      {isDesktop && (
        <div className="rounded-xl bg-muted/20 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            ✨ Akses seumur hidup • 📱 Belajar dimana saja
          </p>
        </div>
      )}
    </div>
  );

  const body = isDesktop ? (
    <div className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] gap-10 items-start">
      {infoSection}
      {actionSection}
    </div>
  ) : (
    <div className="space-y-8 px-4">
      {infoSection}
      {actionSection}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold leading-tight">
              {course.title}
            </DialogTitle>
            {course.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            )}
          </DialogHeader>
          <div className="py-6">{body}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col max-h-[95vh] h-[95vh] overflow-y-scroll">
        <DrawerHeader className="flex-shrink-0 space-y-3 text-left border-b border-border/60 pb-4">
          <DrawerTitle className="text-xl font-bold leading-tight">
            {course.title}
          </DrawerTitle>
          {course.description && (
            <DrawerDescription className="text-sm leading-relaxed">
              {course.description}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div className="flex-1">
          <div className="py-4">{body}</div>
        </div>

        <DrawerFooter className="flex-shrink-0 border-t border-border/60 pt-4 bg-background backdrop-blur-sm">
          <div className="text-center space-y-2">
            <span className="text-xs text-muted-foreground font-medium">
              {COURSE_DETAIL_COPY.urgency.startToday}
            </span>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>✨ Akses seumur hidup</span>
              <span>•</span>
              <span>📱 Belajar dimana saja</span>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
