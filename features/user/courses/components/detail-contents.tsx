"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/features/shared/components/ui/badge";
import { CheckCircle2, Gamepad } from "lucide-react";
import { COURSE_DETAIL_COPY } from "../constants/course-detail-copy";

interface DetailContentsProps {
  course: Doc<"courses">;
}

export function DetailContents({ course }: DetailContentsProps) {
  const learningOutcomes = (course.learningOutcomes ?? []).filter(
    (outcome) => outcome.trim().length > 0,
  );

  return (
    <section className="flex flex-col items-center gap-16">
      <div className="flex flex-col items-center gap-6">
        <Badge
          className="bg-white/5 transition-colors"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--border)",
          }}
          variant="secondary"
        >
          <Gamepad className="mr-1.5" /> {COURSE_DETAIL_COPY.contents.badge}
        </Badge>
        <h2
          className="max-w-lg text-center font-light text-3xl leading-[1.1] tracking-tight md:text-4xl xl:max-w-2xl"
          style={{ color: "var(--text-primary)" }}
        >
          {COURSE_DETAIL_COPY.contents.title}
        </h2>
        <p
          className="max-w-2xl text-pretty text-center text-base/7 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {COURSE_DETAIL_COPY.contents.description}
        </p>
      </div>

      {learningOutcomes.length > 0 && (
        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learningOutcomes.map((outcome, index) => (
            <li
              key={`${outcome}-${index}`}
              className="flex items-start gap-3 rounded-2xl border bg-white/3 p-5 transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--border)" }}
            >
              <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
              <span
                className="text-left text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {outcome}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default DetailContents;
