"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, CircleDot, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCourseContent } from "../contexts/course-content-context";

const statusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "in_progress":
      return <CircleDot className="h-4 w-4 text-highlight" />;
    default:
      return <Circle className="h-4 w-4 text-sidebar-foreground/40" />;
  }
};

interface CourseSidebarProps {
  variant?: "default" | "drawer" | "animated";
  className?: string;
}

export default function CourseSidebar({
  variant = "default",
  className,
}: CourseSidebarProps) {
  const { course, chapters } = useCourseContent();
  const pathname = usePathname();

  const containerClasses = cn(
    "relative flex flex-col bg-sidebar text-sidebar-foreground",
    variant === "default"
      ? "fixed left-0 top-0 z-50 hidden h-screen w-[320px] border-r border-sidebar-border shadow-[0_0_40px_hsl(var(--muted)/0.35)] lg:flex"
      : variant === "animated"
        ? "h-full w-full border-r border-sidebar-border shadow-[0_0_40px_hsl(var(--muted)/0.35)]"
        : "h-full w-full overflow-hidden shadow-none",
    className,
  );

  return (
    <aside className={containerClasses}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--sidebar-primary)/0.15),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-sidebar-accent/5 via-transparent to-sidebar-accent/5" />
      <div className="relative flex h-full flex-col gap-8 pb-8 pt-8">
        <div className="mx-6 relative flex items-center gap-3 rounded-full border border-sidebar-border bg-sidebar-accent px-4 py-2 text-sm text-sidebar-foreground shadow-inner focus-within:border-sidebar-border/60">
          <Search className="h-4 w-4 text-sidebar-foreground/60" />
          <input
            placeholder="Cari pelajaran"
            className="w-full bg-transparent text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:outline-none"
          />
          <span className="text-[11px] font-mono uppercase tracking-wide text-sidebar-foreground/50">
            ⌘K
          </span>
        </div>

        <div className="px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sidebar-border/50 hover:scrollbar-thumb-sidebar-border">
          <nav className="-mx-1 flex-1 space-y-6 pr-2">
            {chapters.map((chapter, index) => (
              <div key={chapter.chapter._id} className="space-y-3">
                <div className="flex items-center gap-2 px-1 text-xs font-semibold uppercase text-sidebar-foreground">
                  <span className="tracking-[0.1em] text-lg text-muted-foreground font-mono">
                    {index.toString().padStart(2, "0")}
                  </span>
                  {chapter.chapter.title}
                </div>
                <div className="space-y-1">
                  {chapter.contents.map((item) => {
                    const href = `/courses/${course.slug}/${item.type === "lesson" ? "l" : "q"}/${item.doc.slug}`;
                    const isActive = pathname.includes(item.doc.slug);

                    return (
                      <Link
                        key={item.doc._id}
                        href={href}
                        className={cn(
                          "group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition",
                          isActive
                            ? "border-sidebar-border bg-sidebar-accent text-sidebar-foreground shadow-[0_12px_40px_hsl(var(--sidebar-accent)/0.25)]"
                            : "text-sidebar-foreground/70 hover:border-sidebar-border/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <div className="mt-0.5">
                          {isActive && statusIcon("in_progress")}
                          {item.status === "completed" &&
                            statusIcon(item.status)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-base font-semibold leading-tight text-inherit">
                              {item.doc.title}
                            </p>
                          </div>
                          {/* <p className="line-clamp-2 text-xs text-sidebar-foreground/70">
                            {item.estimatedDurationMinutes}
                          </p> */}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
