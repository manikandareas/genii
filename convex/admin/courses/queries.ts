import { v } from "convex/values";
import { query } from "../../_generated/server";
import { ensureAdmin } from "../../utils";

export const list = query({
  args: {
    search: v.optional(v.string()),
    difficulty: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
      ),
    ),
    featured: v.optional(v.boolean()),
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const courses =
      args.difficulty !== undefined
        ? await ctx.db
            .query("courses")
            .withIndex("by_difficulty", (q) =>
              q.eq(
                "difficulty",
                args.difficulty as "beginner" | "intermediate" | "advanced",
              ),
            )
            .collect()
        : args.featured !== undefined
          ? await ctx.db
              .query("courses")
              .withIndex("by_featured", (q) => q.eq("featured", args.featured))
              .collect()
          : await ctx.db.query("courses").collect();
    const searchLower = args.search?.trim().toLowerCase();

    const filtered = courses
      .filter((course) => {
        if (
          args.featured !== undefined &&
          (course.featured ?? false) !== args.featured
        ) {
          return false;
        }

        if (args.topicId && !course.topicIds.includes(args.topicId)) {
          return false;
        }

        if (!searchLower) {
          return true;
        }

        const titleMatch = course.title.toLowerCase().includes(searchLower);
        const slugMatch = course.slug.toLowerCase().includes(searchLower);

        return titleMatch || slugMatch;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);

    return filtered;
  },
});

export const getById = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.get(courseId);
    return course ?? null;
  },
});
