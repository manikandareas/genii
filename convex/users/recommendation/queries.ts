import { v } from "convex/values";
import { query } from "../../_generated/server";

export const findUserRecommendation = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("course_recommendations")
      .withIndex("by_user", (q) => q.eq("createdFor", args.id))
      .first();
  },
});
