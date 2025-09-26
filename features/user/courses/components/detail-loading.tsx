import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Skeleton } from "@/features/shared/components/ui/skeleton";

const chapterSkeletonKeys = ["ch1", "ch2", "ch3"] as const;
const itemSkeletonKeys = ["it1", "it2", "it3"] as const;

function DetailHeroSkeleton() {
  return (
    <section className="flex flex-col items-center justify-center space-y-8 text-center">
      {/* Difficulty badge */}
      <Skeleton className="h-7 w-20 rounded-full" />

      {/* Main title - matching actual h1 structure */}
      <Skeleton className="h-16 w-full max-w-lg xl:max-w-2xl" />

      {/* Topic badges row */}
      <div className="flex flex-wrap justify-center gap-3">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      {/* Description paragraph - matching actual structure */}
      <div className="flex max-w-2xl flex-col items-center space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* CTA button */}
      <Skeleton className="h-12 w-52 rounded-full" />

      {/* Video thumbnail - matching HeroVideoDialog structure */}
      <div className="relative mt-8 w-full max-w-4xl">
        <Skeleton className="aspect-video w-full rounded-xl border border-border/50" />
        {/* Play button overlay */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function DetailContentsSkeleton() {
  return (
    <section className="space-y-12">
      {/* Header section */}
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Contents badge */}
        <Skeleton className="h-8 w-24 rounded-full" />
        {/* Section title */}
        <Skeleton className="h-12 w-full max-w-lg xl:max-w-2xl" />
        {/* Description */}
        <div className="flex max-w-2xl flex-col items-center space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      {/* Content structure - two columns */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Course structure side */}
        <div className="space-y-6">
          {/* Course Structure title */}
          <Skeleton className="h-6 w-40" />

          {/* Course file tree container - clean Card instead of glass effect */}
          <Card>
            <CardContent className="space-y-4">
              {chapterSkeletonKeys.map((ch) => (
                <div className="space-y-3" key={ch}>
                  {/* Chapter title */}
                  <Skeleton className="h-5 w-48" />
                  {/* Chapter items */}
                  <div className="ml-4 space-y-2">
                    {itemSkeletonKeys.map((it) => (
                      <div
                        className="flex items-center gap-3"
                        key={`${ch}-${it}`}
                      >
                        <Skeleton className="h-4 w-4 flex-shrink-0 rounded" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Learning outcomes side */}
        <div className="space-y-6">
          {/* Learning outcomes title */}
          <Skeleton className="h-6 w-48" />
          {/* Learning outcomes list - clean background for readability */}
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="flex items-start gap-3"
                key={`outcome-${index.toString()}`}
              >
                <Skeleton className="mt-0.5 h-4 w-4 flex-shrink-0 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailPromoSkeleton() {
  return (
    <section className="relative mx-auto h-96 w-full overflow-hidden rounded-xl border border-border/50">
      {/* Background image skeleton */}
      <Skeleton className="h-full w-full" />

      {/* Overlay gradient simulation */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      {/* Content overlay - use glass effect here as it's a promotional hero overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 md:items-start md:justify-center">
        <div className="glass-card max-w-md space-y-4">
          {/* Title skeleton */}
          <Skeleton className="h-8 w-full max-w-xs" />

          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-12 w-full rounded-full md:w-40" />
        </div>
      </div>
    </section>
  );
}

function DetailLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <Card className="space-y-24">
        <CardContent>
          <DetailHeroSkeleton />
        </CardContent>

        <CardContent>
          <DetailContentsSkeleton />
        </CardContent>

        <CardContent>
          <DetailPromoSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

export default DetailLoading;
