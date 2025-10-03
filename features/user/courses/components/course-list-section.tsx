import { Doc } from "@/convex/_generated/dataModel";
import { BookOpen, Star } from "lucide-react";
import { COURSES_COPY } from "../constants/copy";
import { CourseCard } from "./course-card";
import { Separator } from "@/features/shared/components/ui/separator";

interface CourseListSectionProps {
  courses: Doc<"courses">[];
}

export function CourseListSection({ courses }: CourseListSectionProps) {
  // Separate featured and regular courses
  const featuredCourses = courses.filter((course) => course.featured);
  const regularCourses = courses.filter((course) => !course.featured);

  return (
    <section className="space-y-16">
      {/* Featured Courses Section */}
      {featuredCourses.length > 0 && (
        <div className="">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/5 px-3 py-1.5">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span>{COURSES_COPY.featuredCourses.badge}</span>
            </div>
            <div className="mb-6">
              <p className="mt-2 max-w-2xl text-base/7 text-muted-foreground">
                {COURSES_COPY.featuredCourses.description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} {...course} />
            ))}
          </div>
        </div>
      )}

      <Separator />
      {/* Regular Courses Grid */}
      {regularCourses.length > 0 && (
        <div className="">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/5 px-3 py-1.5">
              <BookOpen className="h-3 w-3 text-green-500" />
              <span>{COURSES_COPY.courseList.badge}</span>
            </div>
            <div className="mb-6">
              <p className="mt-2 max-w-2xl text-base/7 text-muted-foreground">
                {COURSES_COPY.courseList.descriptions.default}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularCourses.map((course) => (
              <CourseCard key={course._id} {...course} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
