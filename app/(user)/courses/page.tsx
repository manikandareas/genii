import { api } from "@/convex/_generated/api";
import { CourseListSection } from "@/features/user/courses/components/course-list-section";
import { fetchQuery } from "convex/nextjs";
import React from "react";

export default async function CoursesPage() {
  const courses = await fetchQuery(api.users.courses.queries.getCourses, {});
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="space-y-20">
        <CourseListSection courses={courses} />
      </div>
    </div>
  );
}
