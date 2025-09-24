import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { ensureAdmin } from "../../utils";

const now = () => Date.now();

const contentOrderValidator = v.optional(
  v.array(
    v.object({
      contentId: v.union(v.id("lessons"), v.id("quizzes")),
      contentType: v.union(v.literal("lesson"), v.literal("quiz")),
      position: v.optional(v.number()),
    }),
  ),
);

export const create = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    position: v.optional(v.number()),
    contentOrder: contentOrderValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const slugInUse = await ctx.db
      .query("chapters")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (slugInUse) {
      throw new Error("Slug already in use");
    }

    const chapterId = await ctx.db.insert("chapters", {
      ...args,
      contentOrder: args.contentOrder ?? [],
      updatedAt: now(),
    });

    return chapterId;
  },
});

export const update = mutation({
  args: {
    chapterId: v.id("chapters"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    position: v.optional(v.number()),
    contentOrder: contentOrderValidator,
  },
  handler: async (ctx, { chapterId, slug, contentOrder, ...rest }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(chapterId);
    if (!existing) {
      return null;
    }

    if (slug && slug !== existing.slug) {
      const slugInUse = await ctx.db
        .query("chapters")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (slugInUse) {
        throw new Error("Slug already in use");
      }
    }

    const updates: Record<string, unknown> = { updatedAt: now() };
    if (slug !== undefined) updates.slug = slug;
    if (contentOrder !== undefined) updates.contentOrder = contentOrder;

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(chapterId, updates);
    return await ctx.db.get(chapterId);
  },
});

export const remove = mutation({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, { chapterId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const chapter = await ctx.db.get(chapterId);
    if (!chapter) {
      return false;
    }

    const lesson = await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", chapterId))
      .first();
    if (lesson) {
      throw new Error("Chapter has lessons and cannot be deleted");
    }

    const quiz = await ctx.db
      .query("quizzes")
      .withIndex("by_chapter", (q) => q.eq("chapterId", chapterId))
      .first();
    if (quiz) {
      throw new Error("Chapter has quizzes and cannot be deleted");
    }

    await ctx.db.delete(chapterId);
    return true;
  },
});
