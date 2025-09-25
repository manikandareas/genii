import { TopicEditor } from "@/features/admin/topics/components/topic-editor";
import type { Id } from "@/convex/_generated/dataModel";

export default function TopicDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <TopicEditor topicId={params.id as Id<"topics">} />;
}
