"use client";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CourseForm } from "@/features/admin/courses/components/course-form";
import AdminContainer from "@/features/admin/components/container";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { CoursesSkeleton } from "@/features/admin/courses/components/course-list.skeleton";

interface CourseEditorProps {
  courseId: Id<"courses">;
}

export function CourseEditor({ courseId }: CourseEditorProps) {
  const { data: course, isPending } = useQuery(
    convexQuery(api.admin.courses.queries.getById, { courseId }),
  );

  if (isPending) {
    return (
      <AdminContainer className="flex flex-col gap-8">
        <CoursesSkeleton />
      </AdminContainer>
    );
  }

  if (!course) {
    return (
      <AdminContainer>
        <EmptyState
          title="Course not found"
          description="It may have been removed or you do not have access."
          action={{ label: "Back to courses", href: "/admin/courses" }}
        />
      </AdminContainer>
    );
  }

  return <CourseForm courseId={courseId} initialData={course} />;
}
