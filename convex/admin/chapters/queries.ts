import { v } from "convex/values";
import { query } from "../../_generated/server";
import { ensureAdmin } from "../../utils";
import { Id } from "../../_generated/dataModel";

export const list = query({
  args: {
    courseId: v.optional(v.id("courses")),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const chapters = args.courseId
      ? await ctx.db
          .query("chapters")
          .withIndex("by_course", (q) =>
            q.eq("courseId", args.courseId as Id<"courses">),
          )
          .collect()
      : await ctx.db.query("chapters").collect();
    const searchLower = args.search?.trim().toLowerCase();

    const filtered = chapters.filter((chapter) => {
      if (!searchLower) {
        return true;
      }
      const titleMatch = chapter.title.toLowerCase().includes(searchLower);
      const slugMatch = chapter.slug.toLowerCase().includes(searchLower);
      return titleMatch || slugMatch;
    });

    return filtered.sort((a, b) => {
      const positionA = a.position ?? a._creationTime;
      const positionB = b.position ?? b._creationTime;
      return positionA - positionB;
    });
  },
});

export const getById = query({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, { chapterId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const chapter = await ctx.db.get(chapterId);
    return chapter ?? null;
  },
});
