"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { LessonForm } from "@/features/admin/lessons/components/lesson-form";
import AdminContainer from "@/features/admin/components/container";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { LessonsSkeleton } from "@/features/admin/lessons/components/lesson-list.skeleton";

interface LessonEditorProps {
  lessonId: Id<"lessons">;
}

export function LessonEditor({ lessonId }: LessonEditorProps) {
  const lesson = useQuery(api.admin.lessons.queries.getById, { lessonId });

  if (lesson === undefined) {
    return (
      <AdminContainer className="flex flex-col gap-8">
        <LessonsSkeleton />
      </AdminContainer>
    );
  }

  if (!lesson) {
    return (
      <AdminContainer>
        <EmptyState
          title="Lesson not found"
          description="It may have been removed or you do not have access."
          action={{ label: "Back to lessons", href: "/admin/lessons" }}
        />
      </AdminContainer>
    );
  }

  return <LessonForm lessonId={lessonId} initialData={lesson} />;
}
