import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { ensureAdmin } from "../../utils";
import type { Id } from "../../_generated/dataModel";

const now = () => Date.now();

const questionsValidator = v.array(
  v.object({
    question: v.string(),
    options: v.array(v.string()),
    correctOptionIndex: v.number(),
    explanation: v.optional(v.string()),
  }),
);

function validateQuestions(questions: Array<{ options: string[]; correctOptionIndex: number }>) {
  questions.forEach(({ options, correctOptionIndex }, index) => {
    if (options.length < 2 || options.length > 6) {
      throw new Error(`Question ${index + 1} must have between 2 and 6 options`);
    }
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      throw new Error(`Question ${index + 1} has an invalid correct option index`);
    }
  });
}

const normalizeContentOrder = (
  order:
    | Array<{
        contentId: Id<"lessons"> | Id<"quizzes">;
        contentType: "lesson" | "quiz";
        position?: number | null;
      }>
    | undefined,
) =>
  (order ?? []).map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    maxAttempt: v.optional(v.number()),
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
    questions: questionsValidator,
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
      .query("quizzes")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (slugInUse) {
      throw new Error("Slug already in use");
    }

    validateQuestions(args.questions);

    const quizId = await ctx.db.insert("quizzes", {
      ...args,
      updatedAt: now(),
    });

    return quizId;
  },
});

export const update = mutation({
  args: {
    quizId: v.id("quizzes"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    maxAttempt: v.optional(v.number()),
    courseId: v.optional(v.id("courses")),
    chapterId: v.optional(v.id("chapters")),
    questions: v.optional(questionsValidator),
  },
  handler: async (ctx, { quizId, slug, courseId, chapterId, questions, ...rest }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(quizId);
    if (!existing) {
      return null;
    }

    let targetCourseId = courseId ?? existing.courseId;
    let targetChapterId = chapterId ?? existing.chapterId;

    if (slug && slug !== existing.slug) {
      const slugInUse = await ctx.db
        .query("quizzes")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (slugInUse) {
        throw new Error("Slug already in use");
      }
    }

    if (questions) {
      validateQuestions(questions);
    }

    if (courseId || chapterId) {
      if (!targetCourseId) {
        throw new Error("Course is required when updating chapter");
      }
      if (!targetChapterId) {
        throw new Error("Chapter is required when updating course");
      }

      const [course, chapter] = await Promise.all([
        ctx.db.get(targetCourseId),
        ctx.db.get(targetChapterId),
      ]);

      if (!course) {
        throw new Error("Course not found");
      }
      if (!chapter) {
        throw new Error("Chapter not found");
      }
      if (chapter.courseId !== course._id) {
        throw new Error("Chapter does not belong to the selected course");
      }

      targetCourseId = course._id;
      targetChapterId = chapter._id;
    }

    const updates: Record<string, unknown> = { updatedAt: now() };
    if (slug !== undefined) updates.slug = slug;
    if (questions !== undefined) updates.questions = questions;
    if (courseId !== undefined || chapterId !== undefined) {
      updates.courseId = targetCourseId;
      updates.chapterId = targetChapterId;
    }

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(quizId, updates);

    if (
      (chapterId && chapterId !== existing.chapterId) ||
      (courseId && courseId !== existing.courseId)
    ) {
      const previousChapter =
        existing.chapterId !== undefined ? await ctx.db.get(existing.chapterId) : null;
      if (previousChapter) {
        const nextOrder = previousChapter.contentOrder.filter(
          (entry) => entry.contentType !== "quiz" || entry.contentId !== quizId,
        );
        if (nextOrder.length !== previousChapter.contentOrder.length) {
          await ctx.db.patch(previousChapter._id, {
            contentOrder: normalizeContentOrder(nextOrder),
            updatedAt: now(),
          });
        }
      }
    }

    return await ctx.db.get(quizId);
  },
});

export const remove = mutation({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, { quizId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db.get(quizId);
    if (!existing) {
      return false;
    }

    await ctx.db.delete(quizId);

    if (existing.chapterId) {
      const chapter = await ctx.db.get(existing.chapterId);
      if (chapter) {
        const filtered = chapter.contentOrder.filter(
          (entry) => entry.contentType !== "quiz" || entry.contentId !== quizId,
        );
        if (filtered.length !== chapter.contentOrder.length) {
          await ctx.db.patch(chapter._id, {
            contentOrder: normalizeContentOrder(filtered),
            updatedAt: now(),
          });
        }
      }
    }

    return true;
  },
});
