import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../../_generated/server";
import { ensureAdmin } from "../../utils";

export const list = query({
  args: {
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { search, paginationOpts }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const baseQuery = ctx.db.query("assets").order("desc");
    const page = await baseQuery.paginate(paginationOpts);

    if (!search) {
      return page;
    }

    const lowerSearch = search.toLowerCase();
    return {
      ...page,
      page: page.page.filter((asset) =>
        asset.filename.toLowerCase().includes(lowerSearch),
      ),
    };
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

export const getThumbnailUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
