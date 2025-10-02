"use client";

import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizPlayContentProps {
  quizSlug: string;
  courseSlug: string;
}

interface QuestionState {
  questionIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  explanation: string | null;
  correctOptionIndex: number | null;
  startTime: number;
}

export default function QuizPlayContent({
  quizSlug,
  courseSlug,
}: QuizPlayContentProps) {
  const router = useRouter();
  const quiz = useQuery(api.users.quizzes.queries.getBySlug, {
    slug: quizSlug,
  });
  const currentAttempt = useQuery(
    api.users.quizzes.queries.getCurrentAttempt,
    quiz ? { quizId: quiz._id } : "skip",
  );

  const startAttempt = useMutation(api.users.quizzes.mutations.startAttempt);
  const submitAnswer = useMutation(api.users.quizzes.mutations.submitAnswer);
  const completeAttempt = useMutation(
    api.users.quizzes.mutations.completeAttempt,
  );

  const [attemptId, setAttemptId] = useState<Id<"quiz_attempts"> | null>(null);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize attempt
  useEffect(() => {
    if (!quiz) return;

    const initAttempt = async () => {
      try {
        let id: Id<"quiz_attempts">;

        if (currentAttempt) {
          id = currentAttempt._id;
          // Restore state from existing attempt
          const restoredQuestions: QuestionState[] = quiz.questions.map(
            (_, idx) => {
              const answer = currentAttempt.answers.find(
                (a) => a.questionIndex === idx,
              );
              return {
                questionIndex: idx,
                selectedOption: answer?.selectedOptionIndex ?? null,
                isAnswered: !!answer,
                isCorrect:
                  answer?.outcome === "correct"
                    ? true
                    : answer?.outcome === "incorrect"
                      ? false
                      : null,
                explanation: answer
                  ? quiz.questions[idx].explanation || null
                  : null,
                correctOptionIndex: answer
                  ? quiz.questions[idx].correctOptionIndex
                  : null,
                startTime: Date.now(),
              };
            },
          );
          setQuestions(restoredQuestions);

          // Find the first unanswered question
          const firstUnanswered = restoredQuestions.findIndex(
            (q) => !q.isAnswered,
          );
          setCurrentQuestionIndex(
            firstUnanswered >= 0
              ? firstUnanswered
              : restoredQuestions.length - 1,
          );
        } else {
          id = await startAttempt({
            quizId: quiz._id,
            courseId: quiz.courseId,
            chapterId: quiz.chapterId,
          });

          // Initialize fresh questions
          setQuestions(
            quiz.questions.map((_, idx) => ({
              questionIndex: idx,
              selectedOption: null,
              isAnswered: false,
              isCorrect: null,
              explanation: null,
              correctOptionIndex: null,
              startTime: Date.now(),
            })),
          );
        }

        setAttemptId(id);
      } catch (error) {
        console.error("Failed to initialize attempt:", error);
      }
    };

    if (!attemptId) {
      initAttempt();
    }
  }, [quiz, currentAttempt, attemptId, startAttempt]);

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.questionIndex === questionIndex
          ? { ...q, selectedOption: optionIndex }
          : q,
      ),
    );
  };

  const handleSubmitAnswer = async (questionIndex: number) => {
    const question = questions[questionIndex];
    if (question.selectedOption === null || !attemptId) return;

    setIsSubmitting(true);
    try {
      const timeTaken = Date.now() - question.startTime;
      const result = await submitAnswer({
        attemptId,
        questionIndex,
        selectedOptionIndex: question.selectedOption,
        timeTakenMs: timeTaken,
      });

      setQuestions((prev) =>
        prev.map((q) =>
          q.questionIndex === questionIndex
            ? {
                ...q,
                isAnswered: true,
                isCorrect: result.isCorrect,
                explanation: result.explanation || null,
                correctOptionIndex: result.correctOptionIndex,
              }
            : q,
        ),
      );
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = (questionIndex: number) => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => scrollToQuestion(nextIndex), 100);
    }
  };

  const handleComplete = async () => {
    if (!attemptId) return;

    setIsSubmitting(true);
    try {
      await completeAttempt({ attemptId });
      router.push(
        `/courses/${courseSlug}/q/${quizSlug}/result?attemptId=${attemptId}`,
      );
    } catch (error) {
      console.error("Failed to complete quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
        </p>
        <div className="mt-3 flex gap-1">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                q.isAnswered
                  ? q.isCorrect
                    ? "bg-green-500"
                    : "bg-red-500"
                  : idx <= currentQuestionIndex
                    ? "bg-blue-500"
                    : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((questionState, qIdx) => {
          if (qIdx > currentQuestionIndex) return null;

          const question = quiz.questions[qIdx];

          return (
            <Card
              key={qIdx}
              ref={(el) => {
                questionRefs.current[qIdx] = el;
              }}
              className={cn(
                "p-6 transition-all",
                qIdx === currentQuestionIndex && !questionState.isAnswered
                  ? "ring-2 ring-blue-500"
                  : "",
              )}
            >
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {qIdx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{question.question}</h3>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 ml-11">
                {question.options.map((option, optIdx) => {
                  const isSelected = questionState.selectedOption === optIdx;
                  const isCorrectOption =
                    questionState.correctOptionIndex === optIdx;
                  const showCorrect =
                    questionState.isAnswered && isCorrectOption;
                  const showIncorrect =
                    questionState.isAnswered &&
                    isSelected &&
                    !questionState.isCorrect;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        if (!questionState.isAnswered) {
                          handleOptionSelect(qIdx, optIdx);
                        }
                      }}
                      disabled={questionState.isAnswered}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-all",
                        "hover:border-blue-300 dark:hover:border-blue-700",
                        isSelected && !questionState.isAnswered
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-border",
                        showCorrect &&
                          "border-green-500 bg-green-50 dark:bg-green-950/30",
                        showIncorrect &&
                          "border-red-500 bg-red-50 dark:bg-red-950/30",
                        questionState.isAnswered && "cursor-not-allowed",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            isSelected && !questionState.isAnswered
                              ? "border-blue-500 bg-blue-500"
                              : "border-muted-foreground/30",
                            showCorrect && "border-green-500 bg-green-500",
                            showIncorrect && "border-red-500 bg-red-500",
                          )}
                        >
                          {showCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                          {showIncorrect && (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                          {isSelected && !questionState.isAnswered && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {questionState.isAnswered && questionState.explanation && (
                <div className="mt-4 ml-11 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Penjelasan:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {questionState.explanation}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6 ml-11">
                {!questionState.isAnswered ? (
                  <Button
                    onClick={() => handleSubmitAnswer(qIdx)}
                    disabled={
                      questionState.selectedOption === null || isSubmitting
                    }
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memeriksa...
                      </>
                    ) : (
                      "Jawab"
                    )}
                  </Button>
                ) : qIdx === questions.length - 1 ? (
                  <Button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyelesaikan...
                      </>
                    ) : (
                      <>
                        Selesaikan Quiz
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleContinue(qIdx)}
                    className="w-full sm:w-auto"
                  >
                    Lanjutkan
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
