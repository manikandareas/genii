import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query } from "../../_generated/server";
import { ensureAdmin } from "../../utils";

export const list = query({
  args: {
    search: v.optional(v.string()),
    pagination: v.optional(paginationOptsValidator),
  },
  handler: async (ctx, { search, pagination }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const baseQuery = ctx.db.query("assets").order("desc");

    if (pagination) {
      const page = await baseQuery.paginate(pagination);
      if (!search) {
        return page;
      }

      return {
        ...page,
        page: page.page.filter((asset) =>
          asset.filename.toLowerCase().includes(search.toLowerCase()),
        ),
      };
    }

    const assets = await baseQuery.collect();
    if (!search) {
      return assets;
    }

    const lowerSearch = search.toLowerCase();
    return assets.filter((asset) => asset.filename.toLowerCase().includes(lowerSearch));
  },
});

export const getById = query({
  args: {
    assetId: v.id("assets"),
  },
  handler: async (ctx, { assetId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const asset = await ctx.db.get(assetId);
    return asset ?? null;
  },
});
