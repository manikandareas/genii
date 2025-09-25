import { z } from "zod";

export const contentOrderItemSchema = z.object({
  contentType: z.enum(["lesson", "quiz"], {
    error: () => ({ message: "Select content type" }),
  }),
  contentId: z.string().min(1, "Select content"),
});

export const chapterFormSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  contentOrder: z.array(contentOrderItemSchema).optional(),
});

export type ChapterFormValues = z.infer<typeof chapterFormSchema>;
