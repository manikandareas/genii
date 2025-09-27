import type { ReactNode } from "react";

import CourseSidebar from "./components/course-sidebar";
import { CourseContentProvider } from "./course-content-context";
import { buildMockCourseContent } from "./mock-data";

interface ContentLayoutProps {
  children: ReactNode;
  params: {
    courseSlug: string;
  };
}

export default function ContentLayout({ children, params }: ContentLayoutProps) {
  const courseData = buildMockCourseContent(params.courseSlug);

  return (
    <CourseContentProvider value={courseData}>
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.2),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.2),transparent_50%)]" />
        <div className="absolute inset-x-20 top-[-20%] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(241,244,255,0.18),transparent_70%)] blur-3xl" />
        <div className="relative z-0 flex min-h-screen">
          <CourseSidebar />
          <main className="relative flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(41,67,96,0.35),transparent_65%)] px-6 py-10 md:px-12">
              <div className="mx-auto w-full max-w-5xl space-y-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </CourseContentProvider>
  );
}
