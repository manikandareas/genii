import { z } from "zod";

const urlOptional = z
  .string()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""));

export const lessonFormSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  chapterId: z.string().min(1, "Chapter is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Plate JSON is required"),
  videoUrl: urlOptional,
});

export type LessonFormValues = z.infer<typeof lessonFormSchema>;
