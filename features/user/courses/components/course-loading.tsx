import { Skeleton } from "@/features/shared/components/ui/skeleton";

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="mb-2 aspect-video w-full rounded-md" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
}

const skeletonKeys = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

function CourseLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-20 xl:px-0">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-3/4 max-w-xl" />
            <Skeleton className="h-5 w-2/3 max-w-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skeletonKeys.map((key) => (
            <CourseCardSkeleton key={key} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseLoading;
