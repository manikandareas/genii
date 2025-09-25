import type { Id } from "@/convex/_generated/dataModel";
import { ChapterEditor } from "@/features/admin/chapters/components/chapter-editor";

export default function ChapterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ChapterEditor chapterId={params.id as Id<"chapters">} />;
}
