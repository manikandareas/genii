"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { TopicForm } from "@/features/admin/topics/components/topic-form";
import AdminContainer from "@/features/admin/components/container";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { Skeleton } from "@/features/admin/topics/components/topic-list.skeleton";

interface TopicEditorProps {
  topicId: Id<"topics">;
}

export function TopicEditor({ topicId }: TopicEditorProps) {
  const topic = useQuery(api.admin.topics.queries.getById, { topicId });

  if (topic === undefined) {
    return (
      <AdminContainer className="flex flex-col gap-8">
        <Skeleton />
      </AdminContainer>
    );
  }

  if (!topic) {
    return (
      <AdminContainer>
        <EmptyState
          title="Topic not found"
          description="It may have been deleted or you do not have access."
          action={{ label: "Back to topics", href: "/admin/topics" }}
        />
      </AdminContainer>
    );
  }

  return <TopicForm topicId={topicId} initialData={topic} />;
}
