"use client";

import { useEffect, useMemo, useState } from "react";
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
import { LessonsSkeleton } from "@/features/admin/lessons/components/lesson-list.skeleton";

export function LessonList() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [chapterFilter, setChapterFilter] = useState<string>("all");

  const courses = useQuery(api.admin.courses.queries.list, {
    search: undefined,
    difficulty: undefined,
    featured: undefined,
    topicId: undefined,
  });

  const chapters = useQuery(api.admin.chapters.queries.list, {
    search: undefined,
    courseId: courseFilter !== "all" ? (courseFilter as Id<"courses">) : undefined,
  });

  const lessons = useQuery(api.admin.lessons.queries.list, {
    search: search || undefined,
    courseId: courseFilter !== "all" ? (courseFilter as Id<"courses">) : undefined,
    chapterId: chapterFilter !== "all" ? (chapterFilter as Id<"chapters">) : undefined,
  });

  useEffect(() => {
    setChapterFilter("all");
  }, [courseFilter]);

  const isLoading = lessons === undefined || chapters === undefined || courses === undefined;
  const lessonItems = useMemo(() => lessons ?? [], [lessons]);
  const courseItems = useMemo(() => courses ?? [], [courses]);
  const chapterItems = useMemo(() => chapters ?? [], [chapters]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title="Lessons"
        description="Create lessons with Plate content, link them to chapters, and attach videos."
        action={{ label: "New Lesson", href: "/admin/lessons/new" }}
      />

      <ListToolbar
        value={search}
        onValueChange={setSearch}
        placeholder="Search by title or slug"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[200px]">
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
            <Select value={chapterFilter} onValueChange={setChapterFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All chapters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All chapters</SelectItem>
                {chapterItems.map((chapter) => (
                  <SelectItem key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {isLoading ? (
        <LessonsSkeleton />
      ) : lessonItems.length === 0 ? (
        <EmptyState
          title="No lessons yet"
          description="Create lessons to populate your chapters."
          action={{ label: "Create lesson", href: "/admin/lessons/new" }}
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
                  Chapter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {lessonItems.map((lesson) => {
                const course = courseItems.find((c) => c._id === lesson.courseId);
                const chapter = chapterItems.find((c) => c._id === lesson.chapterId);
                return (
                  <tr key={lesson._id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{lesson.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {course ? course.title : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {chapter ? chapter.title : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(lesson.updatedAt ?? lesson._creationTime)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/lessons/${lesson._id}`}>Edit</Link>
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
