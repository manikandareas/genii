"use client";

import confetti from "canvas-confetti";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowRight, Loader2, Lock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  Timeline,
  type TimelineEntry,
} from "@/features/shared/components/ui/timeline";
import {
  CourseEnrollmentDialog,
  type EnrollmentCourse,
} from "@/features/user/courses/components/course-enrollment-dialog";
import { EnrollmentSuccessDialog } from "@/features/user/courses/components/enrollment-success-dialog";
import { TimelineSkeleton } from "@/features/user/onboarding/components/timeline-skeleton";
import Image from "next/image";
import Link from "next/link";

type JourneyStage = "idle" | "collecting" | "ranking" | "completed" | "failed";

type EnrichedCourseRecommendation = {
  courseId: string;
  reason?: string;
  order: number;
  course: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    readonly?: boolean;
    thumbnail?: {
      url?: string;
    } | null;
  };
};

type JourneyQueryResult = {
  recommendation: {
    status: "in_progress" | "completed" | "failed";
    generationMessage?: string;
    summary?: string;
    query: string;
  };
  recommendations: EnrichedCourseRecommendation[];
};

const STAGE_COPY: Record<
  JourneyStage,
  {
    label: string;
    heading: string;
    description: string;
    tone: "neutral" | "primary" | "success" | "danger";
  }
> = {
  idle: {
    label: "Menunggu rekomendasi",
    heading: "Perjalanan belajarmu akan segera kami siapkan",
    description:
      "Kami tidak menemukan proses rekomendasi aktif. Jika kamu baru saja menyelesaikan onboarding, halaman ini akan terisi otomatis dalam beberapa detik.",
    tone: "neutral",
  },
  collecting: {
    label: "Menyiapkan preferensi",
    heading: "Kami sedang memahami cara belajarmu",
    description:
      "AI kami sedang mengolah preferensimu untuk memastikan rekomendasi benar-benar relevan.",
    tone: "primary",
  },
  ranking: {
    label: "Menyusun rekomendasi",
    heading: "Kami memilih kursus yang paling cocok",
    description:
      "Sebentar lagi kamu akan mendapatkan daftar kursus prioritas lengkap dengan alasannya.",
    tone: "primary",
  },
  completed: {
    label: "Rekomendasi siap",
    heading: "Journey belajar personalmu sudah selesai disusun",
    description:
      "Kami sudah menyiapkan ringkasan dan langkah awal agar kamu bisa langsung mulai belajar.",
    tone: "success",
  },
  failed: {
    label: "Terjadi kendala",
    heading: "Kami belum bisa menyusun journey kamu",
    description:
      "Silakan muat ulang halaman ini atau coba kembali beberapa saat lagi sementara kami perbaiki kendalanya.",
    tone: "danger",
  },
};

const difficultyLabels: Record<
  EnrichedCourseRecommendation["course"]["difficulty"],
  string
> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

type JourneyViewProps = {
  showSkipButton?: boolean;
};

export function JourneyView({ showSkipButton = true }: JourneyViewProps) {
  const [selectedCourse, setSelectedCourse] = useState<EnrollmentCourse | null>(
    null,
  );
  const [isEnrollmentOpen, setEnrollmentOpen] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{
    firstLessonSlug: string | null;
    courseSlug: string;
  } | null>(null);
  const confettiExecutedRef = useRef(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { data, status } = useQuery(
    convexQuery(
      api.users.recommendation.queries.getCurrentUserRecommendation,
      {},
    ),
  );

  const recommendationData = data as JourneyQueryResult | null | undefined;

  const recommendation = recommendationData?.recommendation;
  const recommendations = useMemo(() => {
    if (!recommendationData?.recommendations)
      return [] as EnrichedCourseRecommendation[];
    return [...recommendationData.recommendations].sort(
      (a, b) => a.order - b.order,
    );
  }, [recommendationData?.recommendations]);

  const handleOpenEnrollment = (
    course: EnrichedCourseRecommendation["course"],
  ) => {
    const normalizedCourse: EnrollmentCourse = {
      _id: course._id as Id<"courses">,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      learningOutcomes: undefined,
      // @ts-expect-error - thumbnail is optional
      thumbnail: course.thumbnail ?? undefined,
      slug: course.slug,
      readonly: course.readonly,
    };

    setSelectedCourse(normalizedCourse);
    setEnrollmentOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setEnrollmentOpen(open);
    if (!open) {
      setSelectedCourse(null);
    }
  };

  const handleEnrollmentSuccess = async (data: {
    firstLessonSlug: string | null;
    courseSlug: string;
  }) => {
    // Store enrollment data
    setEnrollmentData(data);

    // Trigger confetti only once
    if (!confettiExecutedRef.current) {
      confettiExecutedRef.current = true;

      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }

    // Show success dialog
    setSuccessOpen(true);
  };

  const handleSuccessDialogChange = (open: boolean) => {
    setSuccessOpen(open);
    if (!open) {
      confettiExecutedRef.current = false;
      setEnrollmentData(null);
    }
  };

  const stage: JourneyStage = useMemo(() => {
    if (!recommendation) {
      return status === "pending" ? "collecting" : "idle";
    }

    if (recommendation.status === "failed") {
      return "failed";
    }

    if (recommendation.status === "completed") {
      return "completed";
    }

    const message = (recommendation.generationMessage ?? "").toLowerCase();
    if (message.includes("mengurutkan")) {
      return "ranking";
    }

    return "collecting";
  }, [recommendation, status]);

  const courseTimelineData: TimelineEntry[] = useMemo(() => {
    if (recommendations.length === 0) {
      return [];
    }

    return recommendations.map((item, index) => ({
      title: item.course.title,
      reason:
        item.reason || `Rekomendasi #${index + 1} berdasarkan preferensi Anda`,
      content: (
        <Card className="w-full group pt-0 sm:ml-auto max-w-none sm:w-md overflow-hidden border shadow-sm">
          {item.course.thumbnail?.url && (
            <div className="relative aspect-video w-full h-48">
              <Image
                src={item.course.thumbnail.url}
                alt={item.course.title}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  item.course.readonly && "grayscale group-hover:grayscale-0",
                )}
              />
              {item.course.readonly && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 font-medium text-xs shadow-sm backdrop-blur-sm",
                      "bg-muted/90 text-muted-foreground border border-border/50",
                    )}
                  >
                    <Lock className="h-3 w-3" />
                    Coming Soon
                  </Badge>
                </div>
              )}
            </div>
          )}
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-start gap-3">
              <CardTitle className="text-lg font-semibold flex-1 leading-tight tracking-tight">
                {item.course.title}
              </CardTitle>
              <span className="rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium shrink-0">
                #{index + 1}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.course.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <span className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium w-fit">
                {difficultyLabels[item.course.difficulty]}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleOpenEnrollment(item.course)}
              >
                Mulai Belajar
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ),
    }));
  }, [recommendations]);

  const stageCopy = STAGE_COPY[stage];
  // const isError = status === "error";

  // Typing animation effect (per word)
  useEffect(() => {
    const rawSummary = recommendation?.summary ?? "";
    const sanitizedSummary = rawSummary.trim();

    if (!sanitizedSummary) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    const words = sanitizedSummary
      .split(/\s+/)
      .filter((word) => Boolean(word) && word !== "");

    if (words.length === 0) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentWordIndex >= words.length) {
        setIsTyping(false);
        clearInterval(typingInterval);
        return;
      }

      const nextWord = words[currentWordIndex];

      if (!nextWord) {
        currentWordIndex += 1;
        return;
      }

      setDisplayedText((prev) => (prev ? `${prev} ${nextWord}` : nextWord));
      currentWordIndex += 1;

      if (currentWordIndex >= words.length) {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 90); // Speed of typing (90ms per word)

    return () => clearInterval(typingInterval);
  }, [recommendation?.summary]);

  return (
    <div className="relative min-h-screen pb-24">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Skip Button */}
        {showSkipButton && (
          <div className="flex items-center justify-end">
            <Link href={"/courses"}>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Lewati untuk sekarang
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Hero Section */}
        <section className="space-y-24 pt-4">
          {/* Heading */}
          <div className="space-y-8 max-w-3xl">
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium">
                {stage === "completed" ? (
                  <div className="size-1.5 rounded-full bg-foreground" />
                ) : (
                  <Loader2 className="size-3 animate-spin" />
                )}
                <span>
                  {recommendation?.generationMessage || stageCopy.label}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Kami memasak journey khusus untuk mu!
              </h1>

              {/* Summary with typing animation */}
              <div className="text-sm text-muted-foreground leading-relaxed max-w-2xl min-h-[60px]">
                {recommendation?.summary ? (
                  <div className="relative">
                    <p className="font-mono whitespace-pre-wrap">
                      {displayedText}
                      {isTyping && (
                        <span className="inline-block w-0.5 h-4 bg-foreground ml-0.5 animate-pulse align-middle" />
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="flex items-center gap-2">
                    <span className="animate-[typing_1.5s_ease-in-out_infinite]">
                      Chef Genii sedang memasak
                    </span>
                    <span className="flex gap-0.5">
                      <span
                        className="inline-block w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      />
                      <span
                        className="inline-block w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="inline-block w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Scroll Indicator - Only show when completed */}
            {stage === "completed" && recommendations.length > 0 && (
              <button
                onClick={scrollToTimeline}
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Lihat rekomendasi kursus</span>
                <ArrowDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        </section>

        {/* Timeline Section */}
        <section ref={timelineRef} className="pt-8 scroll-mt-24">
          {recommendations.length === 0 ? (
            <TimelineSkeleton />
          ) : (
            <Timeline data={courseTimelineData} />
          )}
        </section>
      </div>

      {selectedCourse && (
        <>
          <CourseEnrollmentDialog
            course={selectedCourse}
            open={isEnrollmentOpen}
            onOpenChange={handleDialogChange}
            onSuccess={handleEnrollmentSuccess}
          />

          {isSuccessOpen && enrollmentData?.firstLessonSlug && (
            <EnrollmentSuccessDialog
              open={true}
              onOpenChange={handleSuccessDialogChange}
              courseTitle={selectedCourse.title}
              courseSlug={enrollmentData.courseSlug}
              firstLessonSlug={enrollmentData.firstLessonSlug}
            />
          )}
        </>
      )}
    </div>
  );
}
