import { getAll } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { internalQuery } from "../../_generated/server";

export const findCoursesByIds = internalQuery({
  args: {
    ids: v.array(v.id("courses")),
  },
  handler: async (ctx, { ids }) => {
    return await getAll(ctx.db, ids);
  },
});
