import { z } from "zod";

export const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  options: z
    .array(z.string().min(1, "Option text is required"))
    .min(2, "Provide at least two options")
    .max(6, "Maximum six options"),
  correctOptionIndex: z.number().int().min(0, "Select the correct option"),
  explanation: z.string().optional().or(z.literal("")),
});

export const quizFormSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  chapterId: z.string().min(1, "Chapter is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  maxAttempt: z.string().optional(),
  questions: z.array(quizQuestionSchema).min(1, "Add at least one question"),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
