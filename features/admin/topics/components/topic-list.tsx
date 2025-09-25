"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/features/shared/components/ui/button";
import AdminContainer from "@/features/admin/components/container";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import { ListToolbar } from "@/features/admin/shared/components/list-toolbar";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { Skeleton } from "@/features/admin/topics/components/topic-list.skeleton";

export function TopicList() {
  const [search, setSearch] = useState("");
  const topics = useQuery(api.admin.topics.queries.list, { search: search || undefined });

  const isLoading = topics === undefined;
  const filteredTopics = useMemo(() => topics ?? [], [topics]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title="Topics"
        description="Manage the topics powering the public catalog."
        action={{ label: "New Topic", href: "/admin/topics/new" }}
      />

      <ListToolbar
        value={search}
        onValueChange={setSearch}
        placeholder="Search by title or slug"
      />

      {isLoading ? (
        <Skeleton />
      ) : filteredTopics.length === 0 ? (
        <EmptyState
          title="No topics yet"
          description="Create your first topic to start organizing courses."
          action={{ label: "Create topic", href: "/admin/topics/new" }}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filteredTopics.map((topic) => (
                <tr key={topic._id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{topic.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{topic.slug}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(topic.updatedAt ?? topic._creationTime)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/topics/${topic._id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminContainer>
  );
}
