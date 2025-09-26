import { v } from "convex/values";
import { query } from "../_generated/server";
import { ensureAdmin, ensureAuthenticated } from "../utils";

export const assertUserAuthenticated = query({
  handler: async (ctx) => {
    const identity = await ensureAuthenticated(ctx);

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      console.error("User not registered at Convex");
      return null;
    }

    return user;
  },
});

export const assertUserAsAdmin = query({
  handler: async (ctx) => {
    const identity = await ensureAdmin(ctx);

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      console.error("User not registered at Convex");
      return null;
    }

    if (user.role !== "admin") {
      return null;
    }

    return user;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});
