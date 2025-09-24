import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { ensureAdmin } from "../../utils";

const now = () => Date.now();

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const slugInUse = await ctx.db
      .query("topics")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (slugInUse) {
      throw new Error("Slug already in use");
    }

    const topicId = await ctx.db.insert("topics", {
      ...args,
      updatedAt: now(),
    });

    return topicId;
  },
});

export const update = mutation({
  args: {
    topicId: v.id("topics"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, { topicId, slug, ...rest }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(topicId);
    if (!existing) {
      return null;
    }

    if (slug && slug !== existing.slug) {
      const slugInUse = await ctx.db
        .query("topics")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      if (slugInUse) {
        throw new Error("Slug already in use");
      }
    }

    const updates: Record<string, unknown> = { updatedAt: now() };

    if (slug !== undefined) updates.slug = slug;
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(topicId, updates);
    return await ctx.db.get(topicId);
  },
});

export const remove = mutation({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, { topicId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const topic = await ctx.db.get(topicId);
    if (!topic) {
      return false;
    }

    const courses = await ctx.db.query("courses").collect();
    const inUse = courses.some((course) =>
      course.topicIds.some((courseTopicId) => courseTopicId === topicId),
    );

    if (inUse) {
      throw new Error("Topic is referenced by existing courses");
    }

    await ctx.db.delete(topicId);
    return true;
  },
});
