"use client";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/features/shared/components/ui/button";
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

function TimelineSkeleton() {
  return (
    <div className="w-full font-sans">
      <div className="relative max-w-7xl mx-auto pb-12 sm:pb-20">
        {/* Skeleton Items */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex pt-8 sm:pt-16 md:pt-24 lg:pt-40 gap-4 sm:gap-6 md:gap-10 justify-between"
          >
            {/* Left Side - Title & Reason */}
            <div className="sticky flex flex-col md:flex-row z-40 items-start md:items-center top-20 sm:top-32 md:top-40 self-start sm:w-full sm:max-w-sm lg:max-w-md">
              {/* Circle Indicator */}
              <div className="h-8 w-8 sm:h-10 sm:w-10 absolute left-2 sm:left-3 md:left-3 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-muted animate-pulse" />
              </div>

              <div className="flex flex-col items-start gap-2 sm:gap-3 md:gap-5 w-full">
                {/* Title Skeleton - Desktop */}
                <div className="hidden md:block md:pl-16 lg:pl-20 w-full">
                  <div className="h-8 lg:h-10 xl:h-12 2xl:h-14 bg-muted rounded animate-pulse w-3/4" />
                </div>
                {/* Reason Skeleton - Desktop */}
                <div className="hidden md:block md:pl-16 lg:pl-20 w-full space-y-2">
                  <div className="h-3 lg:h-4 bg-muted/70 rounded animate-pulse w-full max-w-md" />
                  <div className="h-3 lg:h-4 bg-muted/70 rounded animate-pulse w-2/3 max-w-md" />
                </div>
              </div>
            </div>

            {/* Right Side - Content Card */}
            <div className="relative pl-12 sm:pl-16 md:pl-4 pr-4 w-full">
              {/* Title & Reason Skeleton - Mobile */}
              <div className="md:hidden mb-4 space-y-3">
                <div className="h-7 sm:h-8 bg-muted rounded animate-pulse w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted/70 rounded animate-pulse w-full" />
                  <div className="h-3 bg-muted/70 rounded animate-pulse w-2/3" />
                </div>
              </div>

              {/* Card Skeleton */}
              <Card className="w-full sm:ml-auto max-w-none sm:w-md overflow-hidden border shadow-sm">
                {/* Thumbnail Skeleton */}
                <div className="relative aspect-video w-full h-48 bg-muted animate-pulse" />

                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start gap-3">
                    {/* Title Skeleton */}
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded animate-pulse w-4/5" />
                      <div className="h-5 bg-muted rounded animate-pulse w-3/5" />
                    </div>
                    {/* Badge Skeleton */}
                    <div className="h-6 w-10 bg-muted rounded-full animate-pulse shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 bg-muted/70 rounded animate-pulse w-full" />
                    <div className="h-3 bg-muted/70 rounded animate-pulse w-full" />
                    <div className="h-3 bg-muted/70 rounded animate-pulse w-4/5" />
                  </div>

                  {/* Footer Skeleton */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                    <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                    <div className="h-9 w-full sm:w-32 bg-muted rounded-md animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {/* Vertical Line Skeleton */}
        <div className="absolute left-6 sm:left-8 md:left-8 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-muted to-transparent" />
      </div>
    </div>
  );
}

export function JourneyView() {
  const [selectedCourse, setSelectedCourse] = useState<EnrollmentCourse | null>(
    null,
  );
  const [isEnrollmentOpen, setEnrollmentOpen] = useState(false);
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
        <Card className="w-full pt-0 sm:ml-auto max-w-none sm:w-md overflow-hidden border shadow-sm">
          {item.course.thumbnail?.url && (
            <div className="relative aspect-video w-full h-48">
              <Image
                src={item.course.thumbnail.url}
                alt={item.course.title}
                fill
                className="object-cover"
              />
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
    const textToDisplay = recommendation?.summary || "";

    if (!textToDisplay) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    // Split text into words
    const words = textToDisplay.split(" ");

    // Reset and start typing animation when summary changes
    setDisplayedText("");
    setIsTyping(true);
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setDisplayedText((prev) => {
          const newText = prev + (prev ? " " : "") + words[currentWordIndex];
          return newText;
        });
        currentWordIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 80); // Speed of typing (80ms per word)

    return () => clearInterval(typingInterval);
  }, [recommendation?.summary]);

  return (
    <div className="relative min-h-screen pb-24">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Skip Button */}
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
        <CourseEnrollmentDialog
          course={selectedCourse}
          open={isEnrollmentOpen}
          onOpenChange={handleDialogChange}
        />
      )}
    </div>
  );
}
