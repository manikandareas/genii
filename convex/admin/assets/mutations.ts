import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { ensureAdmin } from "../../utils";

const now = () => Date.now();

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const createFromUpload = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    size: v.number(),
    mimeType: v.string(),
    url: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const downloadUrl = args.url ?? (await ctx.storage.getUrl(args.storageId));
    if (!downloadUrl) {
      throw new Error("Unable to resolve asset URL");
    }

    const assetId = await ctx.db.insert("assets", {
      filename: args.filename,
      storageId: args.storageId,
      size: args.size,
      mimeType: args.mimeType,
      url: downloadUrl,
      uploadedBy: args.uploadedBy ?? identity.subject,
      updatedAt: now(),
    });

    return assetId;
  },
});

export const touch = mutation({
  args: {
    assetId: v.id("assets"),
  },
  handler: async (ctx, { assetId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const asset = await ctx.db.get(assetId);
    if (!asset) {
      return false;
    }

    await ctx.db.patch(assetId, { updatedAt: now() });
    return true;
  },
});

export const remove = mutation({
  args: {
    assetId: v.id("assets"),
  },
  handler: async (ctx, { assetId }) => {
    const identity = await ensureAdmin(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const asset = await ctx.db.get(assetId);
    if (!asset) {
      return false;
    }

    await ctx.storage.delete(asset.storageId);
    await ctx.db.delete(assetId);
    return true;
  },
});
