import { TopicEditor } from "@/features/admin/topics/components/topic-editor";
import type { Id } from "@/convex/_generated/dataModel";

export default async function TopicDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <TopicEditor topicId={params.id as Id<"topics">} />;
}
