"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import AdminContainer from "@/features/admin/components/container";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import { Button } from "@/features/shared/components/ui/button";

export function AdminDashboardView() {
  const topics = useQuery(api.admin.topics.queries.list, { search: undefined });
  const courses = useQuery(api.admin.courses.queries.list, {
    search: undefined,
    difficulty: undefined,
    featured: undefined,
    topicId: undefined,
  });
  const chapters = useQuery(api.admin.chapters.queries.list, {
    search: undefined,
    courseId: undefined,
  });
  const lessons = useQuery(api.admin.lessons.queries.list, {
    search: undefined,
    courseId: undefined,
    chapterId: undefined,
  });
  const quizzes = useQuery(api.admin.quizzes.queries.list, {
    search: undefined,
    courseId: undefined,
    chapterId: undefined,
  });

  const stats = [
    { name: "Topics", value: topics?.length ?? 0, href: "/admin/topics" },
    { name: "Courses", value: courses?.length ?? 0, href: "/admin/courses" },
    { name: "Chapters", value: chapters?.length ?? 0, href: "/admin/chapters" },
    { name: "Lessons", value: lessons?.length ?? 0, href: "/admin/lessons" },
    { name: "Quizzes", value: quizzes?.length ?? 0, href: "/admin/quizzes" },
  ];

  return (
    <AdminContainer className="flex flex-col gap-10">
      <PageHeader
        title="Content administration"
        description="Monitor curriculum coverage and jump into edit flows."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="rounded-lg border border-border/70 bg-card p-5 shadow-sm transition hover:border-primary/60">
            <p className="text-sm text-muted-foreground">{stat.name}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
              Manage
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Next actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/courses/new">Create course</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/lessons/new">Create lesson</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/assets">Upload asset</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Use the quick links to build out your curriculum quickly. All updates sync instantly to Convex.
        </p>
      </section>
    </AdminContainer>
  );
}
