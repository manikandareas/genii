"use client";

import { useUser } from "@clerk/nextjs";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle2,
    Flame,
    GraduationCap,
    Loader2,
    Play,
    Sparkles,
    Star,
    Target,
    Trophy,
    Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Progress } from "@/features/shared/components/ui/progress";
import { TextEffect } from "@/features/shared/components/ui/text-effect";
import { cn } from "@/lib/utils";

type EnrollmentWithCourse = {
  enrollment: Doc<"course_enrollments">;
  course: Doc<"courses"> | null;
};

const levelConfig = {
  beginner: { 
    label: "Pemula",
    icon: Sparkles, 
    color: "text-chart-2", 
    bg: "bg-chart-2/10",
    border: "border-chart-2/20" 
  },
  intermediate: { 
    label: "Menengah",
    icon: Zap, 
    color: "text-chart-4", 
    bg: "bg-chart-4/10",
    border: "border-chart-4/20"
  },
  advanced: { 
    label: "Mahir",
    icon: Trophy, 
    color: "text-chart-1", 
    bg: "bg-chart-1/10",
    border: "border-chart-1/20"
  },
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
    return { total, completed, inProgress, average };
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Menyiapkan dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <TextEffect
            as="h1"
            className="text-3xl md:text-4xl font-black tracking-tight text-foreground"
            preset="fade-in-blur"
            speedSegment={0.05}
          >
            {`Hi, ${clerkUser?.firstName ?? "Teman"}! 👋`}
          </TextEffect>
          <p className="text-muted-foreground font-medium mt-1">
            Siap untuk petualangan belajar hari ini?
          </p>
        </div>
        <Link href="/onboarding">
            <Button variant="outline" className="rounded-full border-2 border-muted hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <GraduationCap className="h-4 w-4 mr-2" />
                Preferensi Belajar
            </Button>
        </Link>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Profile Card - Span 2 */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 row-span-1"
        >
            <Card className="h-full border-2 shadow-none rounded-3xl overflow-hidden relative group hover:border-primary/20 transition-colors">
                <div className={cn("absolute inset-0 opacity-5", levelConfig[level].bg)} />
                <CardContent className="p-6 flex items-center gap-6 h-full relative z-10">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                        <AvatarImage src={clerkUser?.imageUrl} />
                        <AvatarFallback className="text-2xl font-bold bg-muted">{clerkUser?.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                             <Badge variant="secondary" className={cn("rounded-full px-3 py-1", levelConfig[level].bg, levelConfig[level].color)}>
                                <LevelIcon className="h-3.5 w-3.5 mr-1.5" />
                                {levelConfig[level].label}
                            </Badge>
                            <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur-sm">
                                <StyleIcon className="h-3.5 w-3.5 mr-1.5" />
                                {styleConfig[style]?.label}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                             <span className="inline-flex items-center gap-1">
                                🌐 {user?.languagePreference === "id" ? "Bahasa Indonesia" : "English"}
                             </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-2"
        >
            <Card className="border-2 shadow-none rounded-3xl bg-chart-4/10 border-chart-4/20 flex flex-col justify-center items-center p-4 hover:scale-[1.02] transition-transform cursor-default">
                <Trophy className="h-8 w-8 text-chart-4 mb-2" />
                <span className="text-3xl font-black text-foreground">{stats.completed}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Selesai</span>
            </Card>
             <Card className="border-2 shadow-none rounded-3xl bg-chart-2/10 border-chart-2/20 flex flex-col justify-center items-center p-4 hover:scale-[1.02] transition-transform cursor-default">
                <Flame className="h-8 w-8 text-chart-2 mb-2" />
                <span className="text-3xl font-black text-foreground">{stats.inProgress}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aktif</span>
            </Card>
             <Card className="border-2 shadow-none rounded-3xl bg-chart-5/10 border-chart-5/20 flex flex-col justify-center items-center p-4 hover:scale-[1.02] transition-transform cursor-default">
                <Star className="h-8 w-8 text-chart-5 mb-2" />
                <span className="text-3xl font-black text-foreground">{stats.average}%</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rata-rata</span>
            </Card>
            <Card className="border-2 shadow-none rounded-3xl bg-chart-1/10 border-chart-1/20 flex flex-col justify-center items-center p-4 hover:scale-[1.02] transition-transform cursor-default">
                <BookOpen className="h-8 w-8 text-chart-1 mb-2" />
                <span className="text-3xl font-black text-foreground">{stats.total}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</span>
            </Card>
        </motion.div>

        {/* Continue Learning - Wide Card */}
        {continueLearning && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-1 md:col-span-3 lg:col-span-4"
            >
                <Card className="border-2 p-0 shadow-none rounded-3xl overflow-hidden bg-background hover:border-primary/30 transition-all group">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
                             {continueLearning.course?.thumbnail?.url ? (
                                <Image
                                    src={continueLearning.course.thumbnail.url}
                                    alt={continueLearning.course.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                             ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                             <div className="absolute bottom-3 left-3 md:hidden">
                                <Badge className="bg-background/90 text-foreground backdrop-blur-md border-0">
                                    Lanjutkan
                                </Badge>
                             </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center gap-4">
                            <div>
                                <div className="hidden md:flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                        <Play className="h-3 w-3 mr-1" fill="currentColor" />
                                        Lanjutkan Belajar
                                    </Badge>
                                </div>
                                <h3 className="text-2xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                                    {continueLearning.course?.title}
                                </h3>
                                <p className="text-muted-foreground line-clamp-2">
                                    {continueLearning.course?.description}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Progres Kamu</span>
                                    <span>{continueLearning.enrollment.percentComplete}%</span>
                                </div>
                                <Progress value={continueLearning.enrollment.percentComplete} className="h-3 rounded-full bg-muted" indicatorClassName="bg-primary" />
                            </div>
                            <div className="pt-2">
                                <Link href={`/courses/${continueLearning.course?.slug}`}>
                                    <Button className="rounded-full font-bold shadow-none" size="lg">
                                        Lanjutkan Materi <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </div>

      {/* Courses Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Kursus Saya
             </h2>
             <Link href="/journey">
                <Button variant="ghost" className="rounded-full hover:bg-muted">
                    Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             </Link>
        </div>
        
        {items.length === 0 ? (
             <Card className="border-2 border-dashed shadow-none rounded-3xl bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-16 w-16 rounded-full bg-background border-2 flex items-center justify-center mb-4">
                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Belum ada kursus</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Mulai perjalanan belajarmu dengan memilih kursus yang menarik!
                    </p>
                    <Link href="/journey">
                        <Button size="lg" className="rounded-full font-bold shadow-none">
                            Cari Kursus Baru
                        </Button>
                    </Link>
                </CardContent>
             </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(({ enrollment, course }) => (
                    <Link key={enrollment._id} href={course?.slug ? `/courses/${course.slug}` : "#"} className="group">
                        <Card className="h-full pt-0 border-2 shadow-none rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:border-primary/50">
                            <div className="relative aspect-video bg-muted overflow-hidden">
                                {course?.thumbnail?.url ? (
                                    <Image src={course.thumbnail.url} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                                        <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    {enrollment.status === "completed" && (
                                        <Badge className="bg-emerald-500 text-white border-0 shadow-sm">Selesai</Badge>
                                    )}
                                    {enrollment.status === "in_progress" && (
                                        <Badge className="bg-amber-500 text-white border-0 shadow-sm">Sedang Belajar</Badge>
                                    )}
                                </div>
                            </div>
                            <CardContent className="p-5 space-y-4">
                                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {course?.title}
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        <span>Progres</span>
                                        <span>{enrollment.percentComplete}%</span>
                                    </div>
                                    <Progress value={enrollment.percentComplete} className="h-2 rounded-full bg-muted" indicatorClassName={cn(enrollment.percentComplete === 100 ? "bg-emerald-500" : "bg-primary")} />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        )}
      </div>

      {/* Recent Quizzes */}
      {recentAttempts.data && recentAttempts.data.length > 0 && (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Aktivitas Quiz
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentAttempts.data.slice(0, 4).map((attempt) => {
                    const isPassed = (attempt.correctCount ?? 0) / attempt.totalQuestions >= 0.7;
                    return (
                        <Card key={attempt._id} className="border-2 shadow-none rounded-3xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground mb-1">Quiz</p>
                                <p className="font-black text-2xl">
                                    {attempt.correctCount}/{attempt.totalQuestions}
                                </p>
                            </div>
                            <div className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center border-2",
                                isPassed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                            )}>
                                {isPassed ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                            </div>
                        </Card>
                    )
                })}
             </div>
        </div>
      )}
    </div>
  );
}
