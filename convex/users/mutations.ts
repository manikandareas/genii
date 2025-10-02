import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { api, internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { internalMutation, mutation } from "../_generated/server";
import { workflow } from "../components";
import { ensureAuthenticated } from "../utils";

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await ctx.runQuery(api.users.queries.getUserByClerkId, {
      clerkId: clerkUserId,
    });

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const publicMetadata = (data.public_metadata ?? {}) as Partial<{
      onboardingStatus: "not_started" | "completed";
      role: "user" | "admin";
    }>;

    const firstName = data.first_name ?? "";
    const lastName = data.last_name ?? "";
    const email = data.email_addresses?.[0]?.email_address ?? "";
    const fullNameCandidate = `${firstName} ${lastName}`.trim();

    const userAttributes = {
      fullName:
        fullNameCandidate.length > 0
          ? fullNameCandidate
          : (data.username ?? email),
      email,
      avatarUrl: data.image_url ?? "",
      onboardingStatus:
        publicMetadata?.onboardingStatus === "completed"
          ? "completed"
          : "not_started",
      clerkId: data.id,
      firstName,
      lastName,
      username: data.username ?? "",
      role: publicMetadata?.role === "admin" ? "admin" : "user",
    } as Doc<"users">;

    const user = await ctx.runQuery(api.users.queries.getUserByClerkId, {
      clerkId: data.id,
    });
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const kickoffRecommendationWorkflow = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    await workflow.start(
      ctx,
      internal.users.recommendation.workflow.recommendationWorkflow,
      { userId },
    );
  },
});

export const saveOnboarding = mutation({
  args: {
    learningGoals: v.array(v.string()),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
    languagePreference: v.union(v.literal("id"), v.literal("en")),
    explanationStyle: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuthenticated(ctx);

    if (!identity) {
      throw new Error("Unauthorized");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      // we need to create a user
      await ctx.db.insert("users", {
        clerkId: identity.subject,
        fullName: identity.name || `${identity.firstName} ${identity.lastName}`,
        email: identity.email as string,
        avatarUrl:
          identity.pictureUrl ||
          `https://ui-avatars.com/api/?background=000000&color=fff&name=${identity.firstName} ${identity.lastName}`,
        firstName: identity.firstName?.toString() || "unknown",
        lastName: identity.lastName?.toString() || "unknown",
        username:
          identity.nickname ?? identity.email?.split("@")[0] ?? "unknown",
        role: "user",
        onboardingStatus: "completed",
      });

      user = await ctx.db
        .query("users")
        .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (!user) {
        throw new Error("User not found");
      }
    }

    await ctx.db.patch(user._id, {
      learningGoals: args.learningGoals,
      level: args.level,
      languagePreference: args.languagePreference,
      explanationStyle: args.explanationStyle,
      onboardingStatus: "completed",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.users.mutations.kickoffRecommendationWorkflow,
      { userId: user._id },
    );

    return {
      clerkId: identity.subject,
      onboardingStatus: "completed",
      role: "student",
      otherMetadata: {},
    };
  },
});

export const saveEmbeddings = mutation({
  args: {
    id: v.id("users"),
    embeddings: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { embedding: args.embeddings });
  },
});
