import { v } from "convex/values";
import { query } from "../../_generated/server";
import { ensureUser } from "../../utils";

/**
 * Get quiz by slug for user
 */
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    const identity = await ensureUser(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const quiz = await ctx.db
      .query("quizzes")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    return quiz ?? null;
  },
});

/**
 * Get current quiz attempt for user
 */
export const getCurrentAttempt = query({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, { quizId }) => {
    const identity = await ensureUser(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the latest in_progress attempt
    const attempts = await ctx.db
      .query("quiz_attempts")
      .withIndex("by_user_quiz", (q) =>
        q.eq("userId", user._id).eq("quizId", quizId),
      )
      .collect();

    const inProgressAttempt = attempts.find((a) => a.status === "in_progress");

    return inProgressAttempt ?? null;
  },
});

/**
 * Get quiz attempt by ID
 */
export const getAttemptById = query({
  args: {
    attemptId: v.id("quiz_attempts"),
  },
  handler: async (ctx, { attemptId }) => {
    const identity = await ensureUser(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const attempt = await ctx.db.get(attemptId);

    if (!attempt || attempt.userId !== user._id) {
      throw new Error("Attempt not found or unauthorized");
    }

    return attempt;
  },
});

/**
 * Get all attempts for a quiz
 */
export const getAttemptsByQuiz = query({
  args: {
    quizId: v.optional(v.id("quizzes")),
  },
  handler: async (ctx, { quizId }) => {
    if (!quizId) {
      return [];
    }

    const identity = await ensureUser(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const attempts = await ctx.db
      .query("quiz_attempts")
      .withIndex("by_user_quiz", (q) =>
        q.eq("userId", user._id).eq("quizId", quizId),
      )
      .collect();

  return attempts.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

/**
 * List recent quiz attempts for current user
 */
export const listRecentAttempts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    const identity = await ensureUser(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const attempts = await ctx.db
      .query("quiz_attempts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const sorted = attempts.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    const capped = typeof limit === "number" ? sorted.slice(0, Math.max(0, limit)) : sorted.slice(0, 10);
    return capped;
  },
});
