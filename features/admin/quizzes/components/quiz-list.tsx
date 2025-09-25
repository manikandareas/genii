"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
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
import { QuizzesSkeleton } from "@/features/admin/quizzes/components/quiz-list.skeleton";

export function QuizList() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [chapterFilter, setChapterFilter] = useState<string>("all");

  const { data: courses, isPending: coursesPending } = useQuery(
    convexQuery(api.admin.courses.queries.list, {
      search: undefined,
      difficulty: undefined,
      featured: undefined,
      topicId: undefined,
    }),
  );

  const { data: chapters, isPending: chaptersPending } = useQuery(
    convexQuery(api.admin.chapters.queries.list, {
      search: undefined,
      courseId:
        courseFilter !== "all" ? (courseFilter as Id<"courses">) : undefined,
    }),
  );

  const { data: quizzes, isPending: quizzesPending } = useQuery(
    convexQuery(api.admin.quizzes.queries.list, {
      search: search || undefined,
      courseId:
        courseFilter !== "all" ? (courseFilter as Id<"courses">) : undefined,
      chapterId:
        chapterFilter !== "all"
          ? (chapterFilter as Id<"chapters">)
          : undefined,
    }),
  );

  useEffect(() => {
    setChapterFilter("all");
  }, [courseFilter]);

  const isLoading = quizzesPending || coursesPending || chaptersPending;
  const quizItems = useMemo(() => quizzes ?? [], [quizzes]);
  const courseItems = useMemo(() => courses ?? [], [courses]);
  const chapterItems = useMemo(() => chapters ?? [], [chapters]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title="Quizzes"
        description="Author quizzes with ordered questions and answer explanations."
        action={{ label: "New Quiz", href: "/admin/quizzes/new" }}
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
        <QuizzesSkeleton />
      ) : quizItems.length === 0 ? (
        <EmptyState
          title="No quizzes yet"
          description="Create quizzes to reinforce learning at the end of chapters."
          action={{ label: "Create quiz", href: "/admin/quizzes/new" }}
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
                  Questions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Max attempts
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {quizItems.map((quiz) => {
                const course = courseItems.find((c) => c._id === quiz.courseId);
                const chapter = chapterItems.find((c) => c._id === quiz.chapterId);
                return (
                  <tr key={quiz._id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{quiz.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {course ? course.title : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {chapter ? chapter.title : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{quiz.questions.length}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {quiz.maxAttempt ?? "Unlimited"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(quiz.updatedAt ?? quiz._creationTime)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/quizzes/${quiz._id}`}>Edit</Link>
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
