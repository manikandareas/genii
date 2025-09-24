import { v } from "convex/values";
import { query } from "../../_generated/server";
import { ensureAdmin } from "../../utils";

export const list = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, { search }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const lowerSearch = search?.trim().toLowerCase();

    const topics = await ctx.db.query("topics").collect();
    const filtered = lowerSearch
      ? topics.filter((topic) => {
          const titleMatch = topic.title.toLowerCase().includes(lowerSearch);
          const slugMatch = topic.slug.toLowerCase().includes(lowerSearch);
          return titleMatch || slugMatch;
        })
      : topics;

    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getById = query({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, { topicId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const topic = await ctx.db.get(topicId);
    return topic ?? null;
  },
});
