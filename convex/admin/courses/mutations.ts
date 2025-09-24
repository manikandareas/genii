import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { ensureAdmin } from "../../utils";

const now = () => Date.now();

const difficultyValidator = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
);

const resourcesValidator = v.optional(
  v.array(
    v.object({
      label: v.string(),
      url: v.string(),
    }),
  ),
);

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    difficulty: difficultyValidator,
    topicIds: v.array(v.id("topics")),
    learningOutcomes: v.optional(v.array(v.string())),
    resources: resourcesValidator,
    featured: v.optional(v.boolean()),
    readonly: v.optional(v.boolean()),
    thumbnail: v.optional(
      v.object({
        assetRef: v.id("_storage"),
        url: v.optional(v.string()),
        metadata: v.optional(v.any()),
      }),
    ),
    trailerUrl: v.optional(v.string()),
    resourcesDigest: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const slugInUse = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (slugInUse) {
      throw new Error("Slug already in use");
    }

    for (const topicId of args.topicIds) {
      const topic = await ctx.db.get(topicId);
      if (!topic) {
        throw new Error(`Topic ${topicId} not found`);
      }
    }

    const courseId = await ctx.db.insert("courses", {
      ...args,
      updatedAt: now(),
    });

    return courseId;
  },
});

export const update = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    difficulty: v.optional(difficultyValidator),
    topicIds: v.optional(v.array(v.id("topics"))),
    learningOutcomes: v.optional(v.array(v.string())),
    resources: resourcesValidator,
    featured: v.optional(v.boolean()),
    readonly: v.optional(v.boolean()),
    thumbnail: v.optional(
      v.object({
        assetRef: v.id("_storage"),
        url: v.optional(v.string()),
        metadata: v.optional(v.any()),
      }),
    ),
    trailerUrl: v.optional(v.string()),
    resourcesDigest: v.optional(v.string()),
  },
  handler: async (ctx, { courseId, slug, topicIds, ...rest }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(courseId);
    if (!existing) {
      return null;
    }

    if (slug && slug !== existing.slug) {
      const slugInUse = await ctx.db
        .query("courses")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      if (slugInUse) {
        throw new Error("Slug already in use");
      }
    }

    if (topicIds) {
      for (const topicId of topicIds) {
        const topic = await ctx.db.get(topicId);
        if (!topic) {
          throw new Error(`Topic ${topicId} not found`);
        }
      }
    }

    const updates: Record<string, unknown> = { updatedAt: now() };
    if (slug !== undefined) updates.slug = slug;
    if (topicIds !== undefined) updates.topicIds = topicIds;

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(courseId, updates);
    return await ctx.db.get(courseId);
  },
});

export const remove = mutation({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.get(courseId);
    if (!course) {
      return false;
    }

    const chapter = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .first();

    if (chapter) {
      throw new Error("Course has chapters and cannot be deleted");
    }

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .first();
    if (lessons) {
      throw new Error("Course has lessons and cannot be deleted");
    }

    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .first();
    if (quizzes) {
      throw new Error("Course has quizzes and cannot be deleted");
    }

    await ctx.db.delete(courseId);
    return true;
  },
});
