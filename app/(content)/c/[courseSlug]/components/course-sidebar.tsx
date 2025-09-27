'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  CircleDot,
  Search,
  ChevronLeft,
} from "lucide-react";
import { useCourseContent } from "../course-content-context";
import { cn } from "@/lib/utils";

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes
    ? `${hours} j ${remainingMinutes} m`
    : `${hours} j`;
}

const statusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "in_progress":
      return <CircleDot className="h-4 w-4 text-highlight" />;
    default:
      return <Circle className="h-4 w-4 text-white/40" />;
  }
};

export default function CourseSidebar() {
  const { course, chapters } = useCourseContent();
  const pathname = usePathname();

  return (
    <aside className="relative hidden min-h-screen w-[320px] flex-col border-r border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(125,76,255,0.24),transparent_55%)] bg-slate-950/95 text-slate-100 shadow-[0_0_40px_rgba(12,10,40,0.35)] lg:flex">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
      <div className="relative flex h-full flex-col gap-8 px-6 pb-8 pt-8">
        <div className="flex items-center justify-between gap-3">
          <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10">
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold tracking-wide text-white/80">
            {course.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>

        <div className="relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 shadow-inner focus-within:border-white/20">
          <Search className="h-4 w-4 text-white/40" />
          <input
            placeholder="Cari pelajaran"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <span className="text-[11px] font-mono uppercase tracking-wide text-white/30">
            ⌘K
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-[11px] uppercase tracking-wide text-white/70">
          <div>
            <div className="text-lg font-semibold text-white">
              {course.totalLessons}
            </div>
            Pelajaran
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {course.totalQuizzes}
            </div>
            Quiz
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {formatDuration(course.totalDurationMinutes)}
            </div>
            Durasi
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-white/40">
          <span>Daftar Pelajaran</span>
          <BookOpen className="h-4 w-4 text-white/50" />
        </div>

        <nav className="-mx-1 flex-1 space-y-6 overflow-y-auto pr-2">
          {chapters.map((chapter, index) => (
            <div key={chapter.chapter._id} className="space-y-3">
              <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
                <span>
                  {index.toString().padStart(2, "0")} {chapter.chapter.title}
                </span>
              </div>
              <div className="space-y-1">
                {chapter.contents.map((item) => {
                  const href = `/c/${course.slug}/${item.type === "lesson" ? "l" : "q"}/${item.doc.slug}`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={item.doc._id}
                      href={href}
                      className={cn(
                        "group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition",
                        isActive
                          ? "border-white/20 bg-white/10 text-white shadow-[0_12px_40px_rgba(15,15,35,0.25)]"
                          : "text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <div className="mt-0.5">
                        {isActive ? (
                          <CircleDot className="h-4 w-4 text-highlight" />
                        ) : (
                          statusIcon(item.status)
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold leading-tight text-inherit">
                            {item.doc.title}
                          </p>
                          <span className="text-[11px] uppercase tracking-wide text-white/40">
                            {formatDuration(item.estimatedDurationMinutes)}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs text-white/50">
                          {item.summary}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
