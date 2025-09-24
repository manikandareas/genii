import { MutationCtx, QueryCtx } from "./_generated/server";

export const ensureAuthenticated = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  console.log("identity ensure", identity);
  if (!identity) {
    return null;
  }

  return identity;
};

export const ensureAdmin = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ensureAuthenticated(ctx);

  if (!identity || identity.role !== "admin") {
    return null;
  }

  return identity;
};
