export function AssetsSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-md border border-border bg-muted/60"
        />
      ))}
    </div>
  );
}
