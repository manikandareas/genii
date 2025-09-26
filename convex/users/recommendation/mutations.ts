import { v } from "convex/values";
import { api } from "../../_generated/api";
import { internalMutation } from "../../_generated/server";

export const upsertCourseRecommendation = internalMutation({
  args: {
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    query: v.string(),
    createdFor: v.optional(v.id("users")),
    summary: v.optional(v.string()),
    recommendations: v.optional(
      v.array(
        v.object({
          courseId: v.optional(v.id("courses")),
          reason: v.optional(v.string()),
          order: v.number(),
        }),
      ),
    ),
    generationMessage: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    if (!args.createdFor) {
      throw new Error("createdFor is required");
    }

    const isExists = await ctx.runQuery(
      api.users.recommendation.queries.findUserRecommendation,
      { id: args.createdFor },
    );
    if (isExists) {
      await ctx.db.patch(isExists._id, args);
    } else {
      await ctx.db.insert("course_recommendations", args);
    }
  },
});
