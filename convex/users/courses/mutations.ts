import { v } from "convex/values";

import { mutation } from "../../_generated/server";
import { ensureAuthenticated } from "../../utils";

export const enrollInCourse = mutation({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    const identity = await ensureAuthenticated(ctx);

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const course = await ctx.db.get(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    const existingEnrollment = await ctx.db
      .query("course_enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", courseId),
      )
      .first();

    const timestamp = Date.now();

    if (existingEnrollment) {
      await ctx.db.patch(existingEnrollment._id, {
        updatedAt: timestamp,
        lastActivityAt: timestamp,
      });

      return await ctx.db.get(existingEnrollment._id);
    }

    const enrollmentId = await ctx.db.insert("course_enrollments", {
      userId: user._id,
      courseId,
      courseSlug: course.slug,
      status: "not_started",
      percentComplete: 0,
      contentsCompleted: [],
      lastActivityAt: timestamp,
      updatedAt: timestamp,
    });

    return await ctx.db.get(enrollmentId);
  },
});
