import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { ensureAdmin } from "../../utils";

const now = () => Date.now();

export const create = mutation({
  args: {
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
    title: v.string(),
    slug: v.string(),
    content: v.any(),
    videoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const [course, chapter] = await Promise.all([
      ctx.db.get(args.courseId),
      ctx.db.get(args.chapterId),
    ]);

    if (!course) {
      throw new Error("Course not found");
    }
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    if (chapter.courseId !== args.courseId) {
      throw new Error("Chapter does not belong to provided course");
    }

    const slugInUse = await ctx.db
      .query("lessons")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (slugInUse) {
      throw new Error("Slug already in use");
    }

    const lessonId = await ctx.db.insert("lessons", {
      ...args,
      updatedAt: now(),
    });

    return lessonId;
  },
});

export const update = mutation({
  args: {
    lessonId: v.id("lessons"),
    courseId: v.optional(v.id("courses")),
    chapterId: v.optional(v.id("chapters")),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.any()),
    videoUrl: v.optional(v.string()),
  },
  handler: async (ctx, { lessonId, slug, courseId, chapterId, ...rest }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(lessonId);
    if (!existing) {
      return null;
    }

    let targetCourseId = courseId ?? existing.courseId;
    let targetChapterId = chapterId ?? existing.chapterId;

    if (slug && slug !== existing.slug) {
      const slugInUse = await ctx.db
        .query("lessons")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (slugInUse) {
        throw new Error("Slug already in use");
      }
    }

    if (chapterId || courseId) {
      const chapter = await ctx.db.get(targetChapterId);
      if (!chapter) {
        throw new Error("Chapter not found");
      }
      const course = await ctx.db.get(targetCourseId);
      if (!course) {
        throw new Error("Course not found");
      }
      if (chapter.courseId !== course._id) {
        throw new Error("Chapter does not belong to the selected course");
      }
      targetCourseId = course._id;
      targetChapterId = chapter._id;
    }

    const updates: Record<string, unknown> = { updatedAt: now() };

    if (slug !== undefined) updates.slug = slug;
    if (courseId !== undefined || chapterId !== undefined) {
      updates.courseId = targetCourseId;
      updates.chapterId = targetChapterId;
    }

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    if (updates.content !== undefined && updates.content === null) {
      throw new Error("Content cannot be null");
    }

    await ctx.db.patch(lessonId, updates);

    if (
      (chapterId && chapterId !== existing.chapterId) ||
      (courseId && courseId !== existing.courseId)
    ) {
      const previousChapter = await ctx.db.get(existing.chapterId);
      if (previousChapter) {
        const nextOrder = previousChapter.contentOrder.filter(
          (entry) => entry.contentType !== "lesson" || entry.contentId !== lessonId,
        );
        if (nextOrder.length !== previousChapter.contentOrder.length) {
          await ctx.db.patch(existing.chapterId, {
            contentOrder: nextOrder,
            updatedAt: now(),
          });
        }
      }
    }

    return await ctx.db.get(lessonId);
  },
});

export const remove = mutation({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, { lessonId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(lessonId);
    if (!existing) {
      return false;
    }

    await ctx.db.delete(lessonId);

    const chapter = await ctx.db.get(existing.chapterId);
    if (chapter) {
      const filtered = chapter.contentOrder.filter(
        (entry) => entry.contentType !== "lesson" || entry.contentId !== lessonId,
      );
      if (filtered.length !== chapter.contentOrder.length) {
        await ctx.db.patch(chapter._id, {
          contentOrder: filtered,
          updatedAt: now(),
        });
      }
    }

    return true;
  },
});
