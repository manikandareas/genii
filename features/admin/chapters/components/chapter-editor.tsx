"use client";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ChapterForm } from "@/features/admin/chapters/components/chapter-form";
import AdminContainer from "@/features/admin/components/container";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { ChaptersSkeleton } from "@/features/admin/chapters/components/chapter-list.skeleton";

interface ChapterEditorProps {
  chapterId: Id<"chapters">;
}

export function ChapterEditor({ chapterId }: ChapterEditorProps) {
  const { data: chapter, isPending } = useQuery(
    convexQuery(api.admin.chapters.queries.getById, { chapterId }),
  );

  if (isPending) {
    return (
      <AdminContainer className="flex flex-col gap-8">
        <ChaptersSkeleton />
      </AdminContainer>
    );
  }

  if (!chapter) {
    return (
      <AdminContainer>
        <EmptyState
          title="Chapter not found"
          description="It may have been removed or you do not have access."
          action={{ label: "Back to chapters", href: "/admin/chapters" }}
        />
      </AdminContainer>
    );
  }

  return <ChapterForm chapterId={chapterId} initialData={chapter} />;
}
