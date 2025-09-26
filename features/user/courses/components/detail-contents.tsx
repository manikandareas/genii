import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/features/shared/components/ui/badge";
import { Gamepad } from "lucide-react";
import { COURSE_DETAIL_COPY } from "../constants/course-detail-copy";

interface DetailContentsProps {
  course: Doc<"courses">;
}

export function DetailContents({ course }: DetailContentsProps) {
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

      {/* <div className="flex w-full flex-col-reverse items-start gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <h3
            className="flex items-center justify-center gap-2 font-medium text-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            <FolderTree size={18} />
            {COURSE_DETAIL_COPY.contents.structure.title}
          </h3>
          <div
            className="rounded-xl border bg-white/3 p-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <CourseFileTree
              className="h-fit border-none"
              course={course}
              enrollment={enrollment}
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <h3 className="flex items-center justify-center gap-2 font-semibold text-lg">
            <Goal size={18} />
            {COURSE_DETAIL_COPY.contents.outcomes.title}
          </h3>
          <div
            className="rounded-xl border bg-white/3 p-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <LearningOutcomes
              className="h-full"
              items={
                COURSE_DETAIL_COPY.contents.outcomes
                  .defaultItems as unknown as string[]
              }
            />
          </div>
        </div>
      </div> */}
    </section>
  );
}

export default DetailContents;
