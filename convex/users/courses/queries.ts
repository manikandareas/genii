import { getAll } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";

export const findCoursesByIds = internalQuery({
  args: {
    ids: v.array(v.id("courses")),
  },
  handler: async (ctx, { ids }) => {
    return await getAll(ctx.db, ids);
  },
});

export const getCourses = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const getCourseBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});
