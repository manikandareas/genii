import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Lock, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseBadge } from "./course-badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";

type CourseCardProps = Doc<"courses"> & {
  withEnrollButton?: boolean;
  onEnroll?: () => void;
  isLoading?: boolean;
};

export const CourseCard = (props: CourseCardProps) => {
  return (
    <Link
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      href={props.withEnrollButton ? "#" : `/courses/${props.slug}`}
    >
      <Card className="pt-0 group hover:-translate-y-1 relative flex h-full flex-col overflow-hidden transition-all duration-200">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {props.thumbnail?.url && (
            <Image
              alt={props.title}
              className={cn(
                "aspect-video w-full object-cover transition-all duration-300 group-hover:scale-105",
                props.readonly && "grayscale group-hover:grayscale-0",
              )}
              loading="lazy"
              src={props.thumbnail.url}
              width={500}
              height={500}
            />
          )}

          {/* Difficulty Badge - Floating */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            {props.featured && (
              <Badge
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 font-medium text-xs shadow-sm backdrop-blur-sm",
                )}
                variant={"secondary"}
              >
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                Featured
              </Badge>
            )}
            <CourseBadge difficulty={props.difficulty || "beginner"} />
          </div>

          {/* Readonly Badge - Top Right */}
          {props.readonly && (
            <div className="absolute top-3 right-3 z-20">
              <Badge
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 font-medium text-xs shadow-sm backdrop-blur-sm",
                  "bg-muted/90 text-muted-foreground border border-border/50",
                )}
              >
                <Lock className="h-3 w-3" />
                Coming Soon
              </Badge>
            </div>
          )}
        </div>

        {/* Content Container */}
        <CardContent className="flex flex-1 flex-col space-y-4">
          {/* Title */}
          <h3 className="line-clamp-2 font-medium text-text-primary text-xl tracking-tight transition-colors duration-200">
            {props.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-3 flex-1 text-muted-foreground text-sm leading-relaxed">
            {props.description}
          </p>

          {/* Course Stats */}
          <div className="flex items-center gap-4 text-text-muted text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>2-3 hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>1.2k students</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
