import type { Id } from "@/convex/_generated/dataModel";
import { ChapterEditor } from "@/features/admin/chapters/components/chapter-editor";

export default async function ChapterDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <ChapterEditor chapterId={params.id as Id<"chapters">} />;
}
