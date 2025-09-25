"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import AdminContainer from "@/features/admin/components/container";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import { ListToolbar } from "@/features/admin/shared/components/list-toolbar";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { Button } from "@/features/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { ChaptersSkeleton } from "@/features/admin/chapters/components/chapter-list.skeleton";

export function ChapterList() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const courses = useQuery(api.admin.courses.queries.list, {
    search: undefined,
    difficulty: undefined,
    featured: undefined,
    topicId: undefined,
  });
  const chapters = useQuery(api.admin.chapters.queries.list, {
    search: search || undefined,
    courseId: courseFilter !== "all" ? (courseFilter as Id<"courses">) : undefined,
  });

  const isLoading = chapters === undefined || courses === undefined;
  const chapterItems = useMemo(() => chapters ?? [], [chapters]);
  const courseItems = useMemo(() => courses ?? [], [courses]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title="Chapters"
        description="Structure your courses into ordered chapters."
        action={{ label: "New Chapter", href: "/admin/chapters/new" }}
      />

      <ListToolbar
        value={search}
        onValueChange={setSearch}
        placeholder="Search by title or slug"
        actions={
          <Select
            value={courseFilter}
            onValueChange={setCourseFilter}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courseItems.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <ChaptersSkeleton />
      ) : chapterItems.length === 0 ? (
        <EmptyState
          title="No chapters yet"
          description="Create a chapter to begin organising lessons and quizzes."
          action={{ label: "Create chapter", href: "/admin/chapters/new" }}
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
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {chapterItems.map((chapter) => {
                const course = courseItems.find((c) => c._id === chapter.courseId);
                return (
                  <tr key={chapter._id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{chapter.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {course ? course.title : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {chapter.position ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(chapter.updatedAt ?? chapter._creationTime)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/chapters/${chapter._id}`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminContainer>
  );
}
