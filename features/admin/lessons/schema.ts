import { z } from "zod";

import type { Value } from "platejs";

const urlOptional = z
  .string()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""));

const plateValueSchema = z
  .array(z.unknown())
  .min(1, "Plate content is required");

export const lessonFormSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  chapterId: z.string().min(1, "Chapter is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: plateValueSchema,
  videoUrl: urlOptional,
});

export type LessonFormSchema = z.infer<typeof lessonFormSchema>;

export type LessonFormValues = Omit<LessonFormSchema, "content"> & {
  content: Value;
};
