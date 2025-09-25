"use client";

import { useMemo, useState } from "react";
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
import { Checkbox } from "@/features/shared/components/ui/checkbox";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { difficultyOptions } from "@/features/admin/courses/schema";
import { CoursesSkeleton } from "@/features/admin/courses/components/course-list.skeleton";
import { Label } from "@/features/shared/components/ui/label";

export function CourseList() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const { data: topics, isPending: topicsPending } = useQuery(
    convexQuery(api.admin.topics.queries.list, { search: undefined }),
  );
  const { data: courses, isPending: coursesPending } = useQuery(
    convexQuery(api.admin.courses.queries.list, {
      search: search || undefined,
      difficulty:
        difficulty !== "all"
          ? (difficulty as (typeof difficultyOptions)[number])
          : undefined,
      featured: featuredOnly ? true : undefined,
      topicId:
        topicFilter !== "all" ? (topicFilter as Id<"topics">) : undefined,
    }),
  );

  const isLoading = coursesPending || topicsPending;
  const courseItems = useMemo(() => courses ?? [], [courses]);
  const topicItems = useMemo(() => topics ?? [], [topics]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title="Courses"
        description="Create and update courses, manage their metadata and relationships."
        action={{ label: "New Course", href: "/admin/courses/new" }}
      />

      <ListToolbar
        value={search}
        onValueChange={setSearch}
        placeholder="Search by title or slug"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulties</SelectItem>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All topics</SelectItem>
                {topicItems.map((topic) => (
                  <SelectItem key={topic._id} value={topic._id}>
                    {topic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3">
              <Checkbox
                id="featured"
                checked={featuredOnly}
                onCheckedChange={(checked) =>
                  setFeaturedOnly(checked as boolean)
                }
              />
              <Label htmlFor="featured">Featured Only</Label>
            </div>
          </div>
        }
      />

      {isLoading ? (
        <CoursesSkeleton />
      ) : courseItems.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="Create a course to start organizing chapters and lessons."
          action={{ label: "Create course", href: "/admin/courses/new" }}
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
                  Difficulty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Topics
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Featured
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {courseItems.map((course) => (
                <tr key={course._id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {course.title}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-muted-foreground">
                    {course.difficulty}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {course.topicIds
                      .map(
                        (id) =>
                          topicItems.find((topic) => topic._id === id)?.title,
                      )
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {course.featured ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(course.updatedAt ?? course._creationTime)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/courses/${course._id}`}>Edit</Link>
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
