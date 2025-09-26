"use client";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  Timeline,
  type TimelineEntry,
} from "@/features/shared/components/ui/timeline";
import Image from "next/image";
import {
  CourseEnrollmentDialog,
  type EnrollmentCourse,
} from "@/features/user/courses/components/course-enrollment-dialog";

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

export function JourneyView() {
  const [selectedCourse, setSelectedCourse] = useState<EnrollmentCourse | null>(
    null,
  );
  const [isEnrollmentOpen, setEnrollmentOpen] = useState(false);

  const { data, status, refetch, isFetching } = useQuery(
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
      return [
        {
          title: "Menunggu Rekomendasi",
          reason: "Sistem sedang memproses preferensi Anda",
          content: (
            <div className="w-full max-w-none rounded-2xl border border-white/15 bg-white/80 p-4 sm:p-6 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Loader2 className="size-4 animate-spin text-primary" />
                </div>
                <span className="text-sm sm:text-base font-medium text-primary">
                  Menyiapkan journey belajarmu
                </span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Kami sedang menyusun kursus-kursus terbaik berdasarkan
                preferensimu. Journey pembelajaran personalmu akan segera siap!
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-200"></div>
                </div>
                <span>Proses ini biasanya memakan waktu 30-60 detik</span>
              </div>
            </div>
          ),
        },
      ];
    }

    return recommendations.map((item, index) => ({
      title: item.course.title,
      reason:
        item.reason || `Rekomendasi #${index + 1} berdasarkan preferensi Anda`,
      content: (
        <Card className="w-full sm:ml-auto max-w-none sm:w-md pt-0 overflow-hidden">
          {item.course.thumbnail?.url && (
            <div className="relative aspect-video w-full h-36 sm:h-56">
              <Image
                src={item.course.thumbnail.url}
                alt={item.course.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader className="space-y-3">
            <div className="flex items-start gap-3 sm:gap-4">
              <CardTitle className="text-lg sm:text-xl font-semibold flex-1 leading-tight">
                {item.course.title}
              </CardTitle>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2 sm:px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shrink-0">
                #{index + 1}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {item.course.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground w-fit">
                {difficultyLabels[item.course.difficulty]}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleOpenEnrollment(item.course)}
              >
                Mulai Belajar
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ),
    }));
  }, [recommendations]);

  const stageCopy = STAGE_COPY[stage];
  const isError = status === "error";

  return (
    <div className="relative min-h-screen overflow-hidden pb-12 sm:pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-64" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-12 px-4 pt-8 sm:pt-16 sm:px-6 lg:px-8">
        <section className="flex flex-col space-y-16 sm:space-y-28 pt-6 sm:pt-10 px-0 sm:px-4 md:px-8 lg:px-10">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="mb-4 max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Kami memasak journey khusus untuk mu!
            </h1>

            <div className="max-w-2xl text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Setiap orang memiliki kebutuhan yang berbeda-beda, kami menyusun
              dan mencari kursus yang sesuai dengan preferensimu.
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            <div className="flex-1 w-full max-w-2xl">
              {recommendation?.summary ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Kamu akan belajar
                  </h3>
                  <p className="text-sm sm:text-base font-mono text-muted-foreground tracking-tight leading-relaxed">
                    {recommendation.summary}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    Ringkasan sedang disiapkan
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Ringkasan personal akan muncul setelah proses rekomendasi
                    selesai.
                  </p>
                </div>
              )}
            </div>

            <Card className="w-full max-w-md lg:w-auto lg:min-w-[320px] border border-white/10 bg-white/70 shadow-lg backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Status rekomendasi</CardTitle>
                <CardDescription className="text-sm">
                  {recommendation
                    ? `Status: ${recommendation.status.replace("_", " ")}`
                    : "Menunggu rekomendasi pertama kamu."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm shadow-sm dark:border-neutral-700">
                  {stage === "completed" ? (
                    <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                  ) : stage === "failed" ? (
                    <AlertTriangle className="size-4 text-destructive shrink-0" />
                  ) : (
                    <Loader2 className="size-4 animate-spin text-primary shrink-0" />
                  )}
                  <span className="font-medium leading-tight">
                    {recommendation?.generationMessage ?? stageCopy.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Halaman ini akan memperbarui status secara real-time. Kamu
                  tidak perlu memuat ulang, tetapi tombol segarkan tetap
                  tersedia bila dibutuhkan.
                </p>
                {(isError || stage === "failed") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="w-full"
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Memuat ulang...
                      </>
                    ) : (
                      "Coba lagi"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="w-full">
          <Timeline data={courseTimelineData} />
        </div>
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
