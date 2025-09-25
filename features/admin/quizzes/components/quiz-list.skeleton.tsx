export function QuizzesSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-md border border-border bg-muted/60"
        />
      ))}
    </div>
  );
}
