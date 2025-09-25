import { z } from "zod";

export const difficultyOptions = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

const urlOptional = z
  .string()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""));

export const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(difficultyOptions, {
    error: () => ({ message: "Select a difficulty" }),
  }),
  topicIds: z.array(z.string()).min(1, "Select at least one topic"),
  learningOutcomes: z
    .array(z.string().min(1, "Outcome cannot be empty"))
    .optional(),
  resources: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        url: z.string().url("Enter a valid URL"),
      }),
    )
    .optional(),
  featured: z.boolean(),
  readonly: z.boolean(),
  thumbnailAssetRef: z.string().optional().or(z.literal("")).or(z.literal("__no_thumbnail")),
  thumbnailUrl: urlOptional,
  trailerUrl: urlOptional,
  resourcesDigest: z.string().optional().or(z.literal("")),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
