"use client";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { AnimatedGroup } from "@/features/shared/components/ui/animated-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { Progress } from "@/features/shared/components/ui/progress";
import { TextEffect } from "@/features/shared/components/ui/text-effect";
import { cn } from "@/lib/utils";

type EnrollmentWithCourse = {
  enrollment: Doc<"course_enrollments">;
  course: Doc<"courses"> | null;
};

const levelConfig = {
  beginner: { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
  intermediate: { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  advanced: { icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

const styleConfig = {
  simple: { label: "Sederhana", icon: BookOpen },
  detailed: { label: "Detail", icon: Brain },
  examples: { label: "Contoh", icon: Target },
};

export default function ProfileView() {
  const { user: clerkUser } = useUser();
  const me = useQuery(convexQuery(api.users.queries.getMe, {}));
  const enrollments = useQuery(
    convexQuery(api.users.courses.queries.listEnrollmentsForMe, {}),
  ) as { data: EnrollmentWithCourse[] | undefined };
  const recentAttempts = useQuery(
    convexQuery(api.users.quizzes.queries.listRecentAttempts, { limit: 10 }),
  );

  const user = me?.data ?? null;
  const items = (enrollments?.data ?? []) as EnrollmentWithCourse[];

  const inProgressCourses = items.filter((e) => e.enrollment.status === "in_progress");
  const continueLearning = inProgressCourses.length > 0
    ? inProgressCourses.sort((a, b) => (b.enrollment.lastActivityAt ?? 0) - (a.enrollment.lastActivityAt ?? 0))[0]
    : null;

  const stats = (() => {
    const total = items.length;
    const completed = items.filter((e) => e.enrollment.status === "completed").length;
    const inProgress = items.filter((e) => e.enrollment.status === "in_progress").length;
    const average = Math.round(
      total > 0
        ? items.reduce((acc, e) => acc + (e.enrollment.percentComplete ?? 0), 0) / total
        : 0,
    );
    const lastActivity = items
      .map((e) => e.enrollment.lastActivityAt ?? 0)
      .sort((a, b) => b - a)[0];
    return { total, completed, inProgress, average, lastActivity };
  })();

  const level = (user?.level ?? "beginner") as keyof typeof levelConfig;
  const style = (user?.explanationStyle ?? "simple") as keyof typeof styleConfig;
  const LevelIcon = levelConfig[level]?.icon ?? Sparkles;
  const StyleIcon = styleConfig[style]?.icon ?? BookOpen;

  if (user === undefined || enrollments.data === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Memuat profil...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
      {/* Hero Header with User Profile (PB-02) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-background shadow-xl">
              <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.fullName ?? "User"} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10">
                {clerkUser?.firstName?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1 space-y-2">
            <TextEffect
              as="h1"
              className="text-2xl md:text-3xl font-bold tracking-tight"
              preset="fade-in-blur"
              speedSegment={0.03}
            >
              {`Halo, ${clerkUser?.firstName ?? "Learner"}! 👋`}
            </TextEffect>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg">
              Kelola preferensi belajar dan pantau progres perjalanan pembelajaran Anda.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="secondary" className={cn("gap-1.5", levelConfig[level]?.bg, levelConfig[level]?.color)}>
                <LevelIcon className="h-3.5 w-3.5" />
                <span className="capitalize">{level}</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <StyleIcon className="h-3.5 w-3.5" />
                {styleConfig[style]?.label ?? style}
              </Badge>
              <Badge variant="outline" className="gap-1.5 uppercase">
                🌐 {user?.languagePreference ?? "id"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 self-start md:self-center">
            <Link href="/onboarding">
              <Button variant="outline" size="sm" className="gap-1.5">
                <GraduationCap className="h-4 w-4" />
                Ubah preferensi
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Continue Learning Card (PB-17) */}
      {continueLearning && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-background overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {continueLearning.course?.thumbnail?.url && (
                  <div className="relative h-40 md:h-auto md:w-48 shrink-0 overflow-hidden">
                    <img
                      src={continueLearning.course.thumbnail.url}
                      alt={continueLearning.course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                  </div>
                )}
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-primary flex items-center gap-1.5">
                        <Play className="h-3.5 w-3.5" />
                        Lanjutkan Belajar
                      </p>
                      <h3 className="font-semibold text-lg">{continueLearning.course?.title ?? "Kursus"}</h3>
                    </div>
                    <Link href={`/courses/${continueLearning.course?.slug}`}>
                      <Button size="sm" className="gap-1.5 shrink-0">
                        Lanjutkan
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progres</span>
                      <span className="font-medium">{continueLearning.enrollment.percentComplete ?? 0}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={continueLearning.enrollment.percentComplete ?? 0} className="h-2" />
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-primary/30 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${continueLearning.enrollment.percentComplete ?? 0}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Stats Grid (PB-12) */}
      <AnimatedGroup preset="blur-slide" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Kursus Diikuti</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">Sedang Berjalan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.average}%</p>
              <p className="text-xs text-muted-foreground">Rata-rata Progres</p>
            </div>
          </CardContent>
        </Card>
      </AnimatedGroup>

      {/* Learning Goals (PB-02) */}
      {(user?.learningGoals ?? []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Tujuan Pembelajaran</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(user?.learningGoals ?? []).map((goal, idx) => (
              <motion.div
                key={goal}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Badge variant="secondary" className="capitalize px-3 py-1.5 text-sm">
                  {goal}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Kursus Saya */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Kursus Saya</h2>
          </div>
          <Link href="/journey">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
              Lihat semua
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                className="p-4 rounded-full bg-primary/10 mb-4"
              >
                <GraduationCap className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="font-semibold mb-1">Belum ada kursus</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Mulai perjalanan pembelajaran Anda dengan mengikuti kursus yang direkomendasikan.
              </p>
              <Link href="/journey">
                <Button className="gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Lihat Rekomendasi
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <AnimatedGroup preset="blur-slide" className="grid gap-4 md:grid-cols-2">
            {items.map(({ enrollment, course }) => {
              const percent = enrollment.percentComplete ?? 0;
              const href = course?.slug ? `/courses/${course.slug}` : undefined;
              const statusConfig = {
                not_started: { label: "Belum mulai", color: "text-muted-foreground", bg: "bg-muted" },
                in_progress: { label: "Sedang berjalan", color: "text-amber-500", bg: "bg-amber-500/10" },
                completed: { label: "Selesai", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              }[enrollment.status];

              return (
                <Card
                  key={enrollment._id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                >
                  {course?.thumbnail?.url && (
                    <div className="relative h-36 w-full overflow-hidden">
                      <img
                        src={course.thumbnail.url}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <Badge
                        variant="secondary"
                        className={cn("absolute bottom-3 left-3", statusConfig.bg, statusConfig.color)}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {course?.title ?? "Kursus"}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progres</span>
                        <span
                          className={cn(
                            "font-semibold",
                            percent >= 100 && "text-emerald-500",
                            percent >= 50 && percent < 100 && "text-amber-500",
                          )}
                        >
                          {percent}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-full",
                            percent >= 100 ? "bg-emerald-500" : "bg-primary",
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    {href && (
                      <Link href={href} className="block">
                        <Button
                          variant={enrollment.status === "completed" ? "outline" : "default"}
                          size="sm"
                          className="w-full gap-1.5"
                        >
                          {enrollment.status === "completed" ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Lihat Kembali
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Lanjutkan
                            </>
                          )}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </AnimatedGroup>
        )}
      </motion.section>

      {/* Quiz Terbaru */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Aktivitas Quiz Terbaru</h2>
        </div>
        {recentAttempts.data && recentAttempts.data.length > 0 ? (
          <AnimatedGroup preset="blur-slide" className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentAttempts.data.slice(0, 6).map((a) => {
              const scorePercent = a.totalQuestions > 0
                ? Math.round((a.correctCount ?? 0) / a.totalQuestions * 100)
                : 0;
              const isPassed = scorePercent >= 70;

              return (
                <Card key={a._id} className="group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          isPassed ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500",
                        )}>
                          {isPassed ? <Trophy className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-medium">Quiz</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          a.status === "graded" && isPassed && "border-emerald-500 text-emerald-500",
                          a.status === "graded" && !isPassed && "border-amber-500 text-amber-500",
                        )}
                      >
                        {a.status === "graded" ? (isPassed ? "Lulus" : "Belum Lulus") : a.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">Skor</p>
                        <p className="text-xl font-bold">{a.correctCount ?? 0}/{a.totalQuestions}</p>
                      </div>
                      <div className="relative h-12 w-12">
                        <svg className="h-12 w-12 -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-muted"
                          />
                          <motion.circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${scorePercent * 1.256} 125.6`}
                            className={isPassed ? "text-emerald-500" : "text-amber-500"}
                            initial={{ strokeDasharray: "0 125.6" }}
                            animate={{ strokeDasharray: `${scorePercent * 1.256} 125.6` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                          {scorePercent}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </AnimatedGroup>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-3 rounded-full bg-muted mb-3">
                <Brain className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Belum ada aktivitas quiz.</p>
            </CardContent>
          </Card>
        )}
      </motion.section>
    </div>
  );
}
