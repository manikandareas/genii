import { z } from "zod";

export const contentOrderItemSchema = z.object({
  contentId: z.string().min(1, "Content ID is required").optional(),
  contentType: z.enum(["lesson", "quiz"], {
    error: () => ({ message: "Select content type" }),
  }),
  position: z.number().nullable(),
});

export const chapterFormSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  position: z.string().optional(),
  contentOrder: z.array(contentOrderItemSchema).optional(),
});

export type ChapterFormValues = z.infer<typeof chapterFormSchema>;
