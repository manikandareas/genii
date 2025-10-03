import {
  Card,
  CardContent,
  CardHeader,
} from "@/features/shared/components/ui/card";

export function TimelineSkeleton() {
  return (
    <div className="w-full font-sans">
      <div className="relative max-w-7xl mx-auto pb-12 sm:pb-20">
        {/* Skeleton Items */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex pt-8 sm:pt-16 md:pt-24 lg:pt-40 gap-4 sm:gap-6 md:gap-10 justify-between"
          >
            {/* Left Side - Title & Reason */}
            <div className="sticky flex flex-col md:flex-row z-40 items-start md:items-center top-20 sm:top-32 md:top-40 self-start sm:w-full sm:max-w-sm lg:max-w-md">
              {/* Circle Indicator */}
              <div className="h-8 w-8 sm:h-10 sm:w-10 absolute left-2 sm:left-3 md:left-3 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-muted animate-pulse" />
              </div>

              <div className="flex flex-col items-start gap-2 sm:gap-3 md:gap-5 w-full">
                {/* Title Skeleton - Desktop */}
                <div className="hidden md:block md:pl-16 lg:pl-20 w-full">
                  <div className="h-8 lg:h-10 xl:h-12 2xl:h-14 bg-muted rounded animate-pulse w-3/4" />
                </div>
                {/* Reason Skeleton - Desktop */}
                <div className="hidden md:block md:pl-16 lg:pl-20 w-full space-y-2">
                  <div className="h-3 lg:h-4 bg-muted/70 rounded animate-pulse w-full max-w-md" />
                  <div className="h-3 lg:h-4 bg-muted/70 rounded animate-pulse w-2/3 max-w-md" />
                </div>
              </div>
            </div>

            {/* Right Side - Content Card */}
            <div className="relative pl-12 sm:pl-16 md:pl-4 pr-4 w-full">
              {/* Title & Reason Skeleton - Mobile */}
              <div className="md:hidden mb-4 space-y-3">
                <div className="h-7 sm:h-8 bg-muted rounded animate-pulse w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted/70 rounded animate-pulse w-full" />
                  <div className="h-3 bg-muted/70 rounded animate-pulse w-2/3" />
                </div>
              </div>

              {/* Card Skeleton */}
              <Card className="w-full sm:ml-auto max-w-none sm:w-md overflow-hidden border shadow-sm">
                {/* Thumbnail Skeleton */}
                <div className="relative aspect-video w-full h-48 bg-muted animate-pulse" />

                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start gap-3">
                    {/* Title Skeleton */}
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded animate-pulse w-4/5" />
                      <div className="h-5 bg-muted rounded animate-pulse w-3/5" />
                    </div>
                    {/* Badge Skeleton */}
                    <div className="h-6 w-10 bg-muted rounded-full animate-pulse shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 bg-muted/70 rounded animate-pulse w-full" />
                    <div className="h-3 bg-muted/70 rounded animate-pulse w-full" />
                    <div className="h-3 bg-muted/70 rounded animate-pulse w-4/5" />
                  </div>

                  {/* Footer Skeleton */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                    <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                    <div className="h-9 w-full sm:w-32 bg-muted rounded-md animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {/* Vertical Line Skeleton */}
        <div className="absolute left-6 sm:left-8 md:left-8 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-muted to-transparent" />
      </div>
    </div>
  );
}
