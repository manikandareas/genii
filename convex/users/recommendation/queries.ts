import { v } from "convex/values";
import type { Doc, Id } from "../../_generated/dataModel";
import { query } from "../../_generated/server";
import { ensureAuthenticated } from "../../utils";

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

type EnrichedRecommendation = {
  courseId: Id<"courses">;
  reason?: string;
  order: number;
  course: Doc<"courses">;
};

export const getCurrentUserRecommendation = query({
  handler: async (ctx) => {
    const identity = await ensureAuthenticated(ctx);

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const recommendation = await ctx.db
      .query("course_recommendations")
      .withIndex("by_user", (q) => q.eq("createdFor", user._id))
      .first();

    if (!recommendation) {
      return null;
    }

    const base = recommendation.recommendations ?? [];

    if (base.length === 0) {
      return {
        recommendation,
        recommendations: [] as EnrichedRecommendation[],
      };
    }

    const enriched = await Promise.all(
      base
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(async (item) => {
          if (!item.courseId) {
            return null;
          }

          const course = await ctx.db.get(item.courseId);
          if (!course) {
            return null;
          }

          return {
            courseId: item.courseId,
            reason: item.reason ?? undefined,
            order: item.order,
            course,
          } satisfies EnrichedRecommendation;
        }),
    );

    return {
      recommendation,
      recommendations: enriched.filter((item) => item !== null),
    };
  },
});
