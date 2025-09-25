"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { QuizForm } from "@/features/admin/quizzes/components/quiz-form";
import AdminContainer from "@/features/admin/components/container";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { QuizzesSkeleton } from "@/features/admin/quizzes/components/quiz-list.skeleton";

interface QuizEditorProps {
  quizId: Id<"quizzes">;
}

export function QuizEditor({ quizId }: QuizEditorProps) {
  const quiz = useQuery(api.admin.quizzes.queries.getById, { quizId });

  if (quiz === undefined) {
    return (
      <AdminContainer className="flex flex-col gap-8">
        <QuizzesSkeleton />
      </AdminContainer>
    );
  }

  if (!quiz) {
    return (
      <AdminContainer>
        <EmptyState
          title="Quiz not found"
          description="It may have been removed or you do not have access."
          action={{ label: "Back to quizzes", href: "/admin/quizzes" }}
        />
      </AdminContainer>
    );
  }

  return <QuizForm quizId={quizId} initialData={quiz} />;
}
