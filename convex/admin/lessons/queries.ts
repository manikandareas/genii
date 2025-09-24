import { v } from "convex/values";
import { query } from "../../_generated/server";
import { ensureAdmin } from "../../utils";
import { Id } from "../../_generated/dataModel";

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

    const lessons = args.chapterId
      ? await ctx.db
          .query("lessons")
          .withIndex("by_chapter", (q) =>
            q.eq("chapterId", args.chapterId as Id<"chapters">),
          )
          .collect()
      : args.courseId
        ? await ctx.db
            .query("lessons")
            .withIndex("by_course", (q) =>
              q.eq("courseId", args.courseId as Id<"courses">),
            )
            .collect()
        : await ctx.db.query("lessons").collect();
    const searchLower = args.search?.trim().toLowerCase();

    const filtered = lessons.filter((lesson) => {
      if (args.courseId && lesson.courseId !== args.courseId) {
        return false;
      }

      if (!searchLower) {
        return true;
      }
      const titleMatch = lesson.title.toLowerCase().includes(searchLower);
      const slugMatch = lesson.slug.toLowerCase().includes(searchLower);
      return titleMatch || slugMatch;
    });

    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getById = query({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, { lessonId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const lesson = await ctx.db.get(lessonId);
    return lesson ?? null;
  },
});
