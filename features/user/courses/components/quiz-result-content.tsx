"use client";

import { useQuery } from "convex/react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { useCourseContent } from "../contexts/course-content-context";

interface QuizResultContentProps {
  quizSlug: string;
  attemptId?: string;
}

export default function QuizResultContent({
  quizSlug,
  attemptId,
}: QuizResultContentProps) {
  const { course, orderedContents } = useCourseContent();
  const quiz = useQuery(api.users.quizzes.queries.getBySlug, {
    slug: quizSlug,
  });
  const attempt = useQuery(
    api.users.quizzes.queries.getAttemptById,
    attemptId ? { attemptId: attemptId as Id<"quiz_attempts"> } : "skip",
  );

  const currentIndex = useMemo(
    () => orderedContents.findIndex((item) => item.doc.slug === quizSlug),
    [orderedContents, quizSlug],
  );

  const nextItem =
    currentIndex >= 0 && currentIndex < orderedContents.length - 1
      ? orderedContents[currentIndex + 1]
      : undefined;

  if (!quiz || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const score = attempt.score ?? 0;
  const correctCount = attempt.correctCount ?? 0;
  const totalQuestions = attempt.totalQuestions;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = attempt.percentage ?? 0;

  const isPassed = percentage >= 70;

  const formatDuration = (ms?: number) => {
    if (!ms) return "N/A";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Result Header */}
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          {isPassed ? (
            <div className="w-20 text-lg font-bold h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              {score}
            </div>
          ) : (
            <div className="w-20 text-lg font-bold h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              {score}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {isPassed ? "Selamat! Quiz Selesai" : "Quiz Selesai"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isPassed
            ? "Anda telah menyelesaikan quiz dengan baik!"
            : "Terus belajar dan coba lagi!"}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                {correctCount}
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Jawaban Benar
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-2xl font-bold text-red-700 dark:text-red-300">
                {incorrectCount}
              </span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              Jawaban Salah
            </p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatDuration(attempt.durationMs)}
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Waktu Pengerjaan
            </p>
          </div>
        </div>
      </Card>

      {/* Review Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Review Jawaban</h2>

        {quiz.questions.map((question, qIdx) => {
          const answer = attempt.answers.find((a) => a.questionIndex === qIdx);
          const isCorrect = answer?.outcome === "correct";
          const selectedOptionIndex = answer?.selectedOptionIndex;

          return (
            <Card key={qIdx} className="p-6">
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    isCorrect
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
                  )}
                >
                  {qIdx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">
                      {question.question}
                    </h3>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 ml-11">
                {question.options.map((option, optIdx) => {
                  const isCorrectOption =
                    question.correctOptionIndex === optIdx;
                  const isSelectedOption = selectedOptionIndex === optIdx;

                  return (
                    <div
                      key={optIdx}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all",
                        isCorrectOption &&
                          "border-green-500 bg-green-50 dark:bg-green-950/30",
                        isSelectedOption &&
                          !isCorrectOption &&
                          "border-red-500 bg-red-50 dark:bg-red-950/30",
                        !isCorrectOption &&
                          !isSelectedOption &&
                          "border-border bg-muted/30",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            isCorrectOption && "border-green-500 bg-green-500",
                            isSelectedOption &&
                              !isCorrectOption &&
                              "border-red-500 bg-red-500",
                            !isCorrectOption &&
                              !isSelectedOption &&
                              "border-muted-foreground/30",
                          )}
                        >
                          {isCorrectOption && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                          {isSelectedOption && !isCorrectOption && (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span>{option}</span>
                          {isCorrectOption && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-green-500 text-green-700 dark:text-green-300"
                            >
                              Jawaban Benar
                            </Badge>
                          )}
                          {isSelectedOption && !isCorrectOption && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-red-500 text-red-700 dark:text-red-300"
                            >
                              Jawaban Anda
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="mt-4 ml-11 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Penjelasan:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {question.explanation}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" asChild>
          <Link href={`/courses/${course.slug}/q/${quizSlug}`}>
            Kembali ke Overview
          </Link>
        </Button>

        {!isPassed &&
          quiz.maxAttempt &&
          attempt.attemptNumber < quiz.maxAttempt && (
            <Button asChild>
              <Link href={`/courses/${course.slug}/q/${quizSlug}/play`}>
                Coba Lagi
              </Link>
            </Button>
          )}

        {nextItem && isPassed && (
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link
              href={`/courses/${course.slug}/${nextItem.type === "lesson" ? "l" : "q"}/${nextItem.doc.slug}`}
            >
              {nextItem.type === "lesson" ? "Pelajaran" : "Quiz"} Berikutnya
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
