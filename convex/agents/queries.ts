import { getThreadMetadata, vStreamArgs } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { geniiAgent } from "./genii";
import { components } from "../_generated/api";

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const { threadId, paginationOpts, streamArgs } = args;
    // await authorizeThreadAccess(ctx, threadId);
    const streams = await geniiAgent.syncStreams(ctx, { threadId, streamArgs });

    const paginated = await geniiAgent.listMessages(ctx, {
      threadId,
      paginationOpts,
    });

    return {
      ...paginated,
      streams,
    };
  },
});

export const roomDetails = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const { threadId } = args;
    const room = await ctx.db
      .query("chat_conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", threadId))
      .first();
    return room;
  },
});

export const userRooms = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const rooms = await ctx.db
      .query("chat_conversations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", user.subject))
      .collect();
    return rooms;
  },
});

export const getThreadDetails = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    // TODO: authorizeThreadAccess
    const { title, summary } = await getThreadMetadata(ctx, components.agent, {
      threadId,
    });
    return { title, summary };
  },
});
