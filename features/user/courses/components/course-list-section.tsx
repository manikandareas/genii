import { Doc } from "@/convex/_generated/dataModel";
import { BookOpen } from "lucide-react";
import { COURSES_COPY } from "../constants/copy";
import { CourseCard } from "./course-card";

interface CourseListSectionProps {
  courses: Doc<"courses">[];
}

export function CourseListSection({ courses }: CourseListSectionProps) {
  return (
    <section>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/5 px-3 py-1.5">
            <BookOpen className="h-3 w-3 text-green-500" />
            <span className="field-label">{COURSES_COPY.courseList.badge}</span>
          </div>
          <div className="mb-6">
            <p className="mt-2 max-w-2xl text-base/7 text-text-secondary">
              {COURSES_COPY.courseList.descriptions.default}
            </p>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {courses.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      )}
    </section>
  );
}
