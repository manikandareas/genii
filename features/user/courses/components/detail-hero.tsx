"use client";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/features/shared/components/ui/button";
import {
  extractYoutubeId,
  HeroVideoDialog,
} from "@/features/shared/components/ui/hero-video-dialog";
import { SignInButton } from "@clerk/nextjs";
import { CourseBadge } from "./course-badge";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import { Loader, Lock, Star } from "lucide-react";
import { COURSE_DETAIL_COPY } from "../constants/course-detail-copy";
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/lib/utils";

type IDetailHero = {
  course: Doc<"courses"> & {
    topics: Doc<"topics">[];
  };
  onEnrollClick: () => void;
};

export function DetailHero(props: IDetailHero) {
  const { data: user, isLoading } = useQuery(
    convexQuery(api.users.queries.getMe, {}),
  );

  const { data: enrollment, isLoading: isEnrollmentLoading } = useQuery(
    convexQuery(api.users.courses.queries.getEnrollmentForCourse, {
      courseId: props.course._id,
    }),
  );

  const pathname = usePathname();
  const hasUser = Boolean(user?._id);
  const ctaLabel = hasUser
    ? enrollment?._id
      ? COURSE_DETAIL_COPY.cta.enrolled.continue
      : COURSE_DETAIL_COPY.cta.notEnrolled.primary
    : COURSE_DETAIL_COPY.ctaVariations.primary;
  return (
    <section className="flex flex-col items-center justify-center gap-8">
      <div className="flex items-center gap-3">
        {props.course.featured && (
          <Badge
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 font-medium text-xs shadow-sm",
            )}
            variant={"secondary"}
          >
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            Featured
          </Badge>
        )}
        <CourseBadge difficulty={props.course.difficulty} />
        {props.course.readonly && (
          <Badge
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 font-medium text-xs shadow-sm",
              "bg-muted/90 text-muted-foreground border border-border/50",
            )}
          >
            <Lock className="h-3 w-3" />
            Coming Soon
          </Badge>
        )}
      </div>
      <h1 className="max-w-lg text-center font-light text-5xl text-primary leading-[1.1] tracking-tight md:text-6xl xl:max-w-2xl">
        {props.course.title}
      </h1>
      <div className="flex flex-wrap justify-center gap-3 max-w-xl">
        {props.course.topics?.map((topic) => (
          <Badge
            className="bg-white/5 capitalize transition-colors "
            key={topic._id}
            variant={"secondary"}
          >
            {topic.icon} {topic.title}
          </Badge>
        ))}
      </div>

      <p className="max-w-2xl text-pretty text-center text-base/7 leading-relaxed">
        {props.course.description}
      </p>
      {hasUser ? (
        <Button disabled={isEnrollmentLoading} onClick={props.onEnrollClick}>
          {ctaLabel}
        </Button>
      ) : !isLoading ? (
        <SignInButton fallbackRedirectUrl={pathname} mode="modal">
          <Button>Sign In Untuk Belajar</Button>
        </SignInButton>
      ) : isLoading ? (
        <Loader className="ml-2 h-4 w-4 animate-spin" />
      ) : null}
      <HeroVideoDialog
        className="mt-8 overflow-hidden rounded-xl border border-hairline"
        videoUrl={props.course.trailerUrl as string}
        youtubeId={
          extractYoutubeId(props.course.trailerUrl as string) ?? "Ke90Tje7VS0"
        }
      />
    </section>
  );
}
