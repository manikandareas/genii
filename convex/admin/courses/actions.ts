import { v } from "convex/values";
import { api } from "../../_generated/api";
import { internalAction } from "../../_generated/server";
import { embedText } from "../../lib";
import { buildCourseQuery } from "../../utils";

export const generateAndStoreCourseEmbeddings = internalAction({
  args: {
    id: v.id("courses"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
    topics: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { title, slug, description, difficulty, topics } = args;

    const value = buildCourseQuery({
      title,
      slug,
      description,
      difficulty,
      topics,
    });

    const embedding = await embedText(value);
    await ctx.runMutation(api.admin.courses.mutations.saveEmbedding, {
      courseId: args.id,
      embedding,
    });

    return { success: true, embedding, query: value };
  },
});
