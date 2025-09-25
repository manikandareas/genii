import { z } from "zod";

export const topicFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required").optional().or(z.literal("")),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid color value")
    .optional()
    .or(z.literal("")),
});

export type TopicFormValues = z.infer<typeof topicFormSchema>;
