import { z } from "zod/v4";

export const recommendationCourseSchema = z.object({
  courseId: z
    .string()
    .describe("The unique identifier of the recommended course"),
  reason: z
    .string()
    .describe(
      "A concise explanation (2-3 sentences) of why this course is recommended and how it fits in the learning journey",
    ),
  order: z
    .number()
    .describe(
      "The sequential position of this course in the learning journey (starting from 1)",
    ),
});

export const recommendationSchema = z.object({
  summary: z
    .string()
    .describe(
      "A comprehensive overview (3-4 sentences) explaining the learning path strategy, how courses work together, and what the user will achieve",
    ),
  recommendations: z
    .array(recommendationCourseSchema)
    .describe(
      "An ordered list of recommended courses forming a coherent learning journey",
    ),
});
