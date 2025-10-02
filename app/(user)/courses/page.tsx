import { api } from "@/convex/_generated/api";
import { CourseListSection } from "@/features/user/courses/components/course-list-section";
import { fetchQuery } from "convex/nextjs";
import React from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo.config";

export const metadata: Metadata = constructMetadata({
  title: "Jelajahi Kursus",
  description:
    "Temukan berbagai kursus pembelajaran AI-powered yang dirancang untuk membantu Anda menguasai berbagai keterampilan. Mulai perjalanan belajar Anda dengan Genii.",
  keywords: [
    "kursus online",
    "pembelajaran AI",
    "belajar online",
    "kursus programming",
    "kursus teknologi",
    "e-learning Indonesia",
  ],
});

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
