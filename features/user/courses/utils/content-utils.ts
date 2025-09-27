import type { Doc } from "@/convex/_generated/dataModel";

import type {
  CourseChapter,
  CourseContentItem,
  CourseContentItemStatus,
} from "../types";

type EnrollmentDoc = Doc<"course_enrollments"> | null;

type PlateNode = {
  text?: string;
  children?: PlateNode[];
};

type PlateValue = PlateNode[];

export function normalisePlateValue(content: unknown): PlateValue {
  if (Array.isArray(content)) {
    return content as PlateValue;
  }

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed as PlateValue;
      }
    } catch {
      return [];
    }
  }

  if (typeof content === "object" && content !== null) {
    const nodes = (content as { data?: { nodes?: PlateValue } }).data?.nodes;
    if (Array.isArray(nodes)) {
      return nodes as PlateValue;
    }
  }

  return [];
}

export function getOrderedContents(
  chapters: CourseChapter[],
): CourseContentItem[] {
  return chapters
    .flatMap((chapter) => chapter.contents)
    .slice()
    .sort((a, b) => a.order - b.order);
}

export function applyEnrollmentToChapters(
  chapters: CourseChapter[],
  enrollment: EnrollmentDoc,
): CourseChapter[] {
  if (chapters.length === 0) {
    return chapters;
  }

  const completedIds = new Set(
    (enrollment?.contentsCompleted ?? []).map((entry) => entry.contentId),
  );

  const orderedContents = getOrderedContents(chapters);

  const statusMap = new Map<string, CourseContentItemStatus>();
  let assignedActive = false;

  orderedContents.forEach((item) => {
    const contentId = String(item.doc._id);
    let status: CourseContentItemStatus = "locked";

    if (completedIds.has(contentId)) {
      status = "completed";
    } else if (!assignedActive) {
      status = "in_progress";
      assignedActive = true;
    }

    statusMap.set(contentId, status);
  });

  // Handle edge case: if all items completed, ensure none left as locked/in_progress
  if (!assignedActive && orderedContents.length > 0) {
    orderedContents.forEach((item) => {
      const contentId = String(item.doc._id);
      if (
        !statusMap.has(contentId) ||
        statusMap.get(contentId) !== "completed"
      ) {
        statusMap.set(contentId, "completed");
      }
    });
  }

  return chapters.map((chapter) => ({
    chapter: chapter.chapter,
    contents: chapter.contents
      .map((content) => ({
        ...content,
        status:
          statusMap.get(String(content.doc._id)) ?? content.status ?? "locked",
      }))
      .sort((a, b) => a.order - b.order),
  }));
}
