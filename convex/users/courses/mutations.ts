import { v } from "convex/values";

import { mutation } from "../../_generated/server";
import { ensureAuthenticated } from "../../utils";
import type { Doc } from "../../_generated/dataModel";

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

export const setLessonCompletion = mutation({
  args: {
    courseId: v.id("courses"),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
  },
  handler: async (ctx, { courseId, lessonId, completed }) => {
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

    const lesson = await ctx.db.get(lessonId);

    if (!lesson || lesson.courseId !== courseId) {
      throw new Error("Lesson not found for course");
    }

    const enrollment = await ctx.db
      .query("course_enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", courseId),
      )
      .first();

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .collect();

    const totalContents = chapters.reduce((total, chapter) => {
      return total + chapter.contentOrder.length;
    }, 0);

    const now = Date.now();

    const existingEntries = [...(enrollment.contentsCompleted ?? [])];
    const lessonIdString = String(lessonId);
    const entryIndex = existingEntries.findIndex(
      (entry) => entry.contentId === lessonIdString,
    );

    if (!completed) {
      return enrollment;
    }

    if (entryIndex !== -1) {
      return enrollment;
    }

    existingEntries.push({
      contentId: lessonIdString,
      contentType: "lesson",
      completedAt: now,
    });

    const completedCount = existingEntries.length;
    const percentComplete = totalContents
      ? Math.round((completedCount / totalContents) * 100)
      : 0;

    let status: Doc<"course_enrollments">["status"] = "in_progress";

    if (totalContents > 0 && completedCount >= totalContents) {
      status = "completed";
    }

    const patch: Partial<Doc<"course_enrollments">> = {
      contentsCompleted: existingEntries,
      percentComplete,
      status,
      lastActivityAt: now,
      updatedAt: now,
    };

    if (status === "completed") {
      patch.dateCompleted = now;
    }

    await ctx.db.patch(enrollment._id, patch);

    return await ctx.db.get(enrollment._id);
  },
});
