import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { clerkClient, embedText } from "../lib";
import { buildPreferenceEmbeddingText } from "../utils";
import { api } from "../_generated/api";

export const updateClerkPublicMetadata = action({
  args: {
    clerkId: v.string(),
    onboardingStatus: v.string(),
    role: v.string(),
    otherMetadata: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    try {
      const res = await clerkClient.users.updateUserMetadata(args.clerkId, {
        publicMetadata: {
          onboardingStatus: args.onboardingStatus,
          role: args.role,
          ...args.otherMetadata,
        },
      });

      return res ? { success: true } : { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
});

export const generateAndStoreUserEmbeddings = internalAction({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.queries.getUserById, {
      id: args.id,
    });

    if (!user) {
      return { success: false, embeddings: [], query: "" };
    }

    const text = buildPreferenceEmbeddingText({
      explanationStyle: user.explanationStyle,
      level: user.level,
      languagePreference: user.languagePreference,
      learningGoals: user.learningGoals ?? [],
    });

    const embeddings = await embedText(text);

    await ctx.runMutation(api.users.mutations.saveEmbeddings, {
      embeddings,
      id: args.id,
    });

    return { success: true, embeddings, query: text };
  },
});
