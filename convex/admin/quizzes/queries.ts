import { v } from "convex/values";
import { query } from "../../_generated/server";
import { ensureAdmin } from "../../utils";

export const list = query({
  args: {
    courseId: v.optional(v.id("courses")),
    chapterId: v.optional(v.id("chapters")),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const quizzes = args.chapterId
      ? await ctx.db
          .query("quizzes")
          .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
          .collect()
      : args.courseId
        ? await ctx.db
            .query("quizzes")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect()
        : await ctx.db.query("quizzes").collect();
    const searchLower = args.search?.trim().toLowerCase();

    const filtered = quizzes.filter((quiz) => {
      if (args.courseId && quiz.courseId !== args.courseId) {
        return false;
      }

      if (!searchLower) {
        return true;
      }
      const titleMatch = quiz.title.toLowerCase().includes(searchLower);
      const slugMatch = quiz.slug.toLowerCase().includes(searchLower);
      return titleMatch || slugMatch;
    });

    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getById = query({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, { quizId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const quiz = await ctx.db.get(quizId);
    return quiz ?? null;
  },
});
