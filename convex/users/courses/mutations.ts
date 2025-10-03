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

    // Check if user already enrolled in this course
    const existingEnrollment = await ctx.db
      .query("course_enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", courseId),
      )
      .first();

    if (existingEnrollment) {
      throw new Error("Anda sudah terdaftar di kursus ini");
    }

    // Create new enrollment
    const timestamp = Date.now();
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

    const enrollment = await ctx.db.get(enrollmentId);

    // Get first lesson slug
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .collect();

    const orderedChapters = chapters.sort((a, b) => {
      const aPosition = a.position ?? a._creationTime;
      const bPosition = b.position ?? b._creationTime;
      return aPosition - bPosition;
    });

    const prioritizedLessonIds: Doc<"lessons">["_id"][] = [];
    const seenLessonIds = new Set<string>();

    for (const chapter of orderedChapters) {
      const sortedEntries = (chapter.contentOrder ?? [])
        .map((entry, index) => ({ entry, index }))
        .sort((a, b) => {
          const aPosition = a.entry.position ?? a.index;
          const bPosition = b.entry.position ?? b.index;
          return aPosition - bPosition;
        });

      for (const { entry } of sortedEntries) {
        if (entry?.contentType !== "lesson" || !entry.contentId) {
          continue;
        }

        const lessonId = entry.contentId as Doc<"lessons">["_id"];
        const lessonKey = String(lessonId);

        if (!seenLessonIds.has(lessonKey)) {
          prioritizedLessonIds.push(lessonId);
          seenLessonIds.add(lessonKey);
        }
      }
    }

    let firstLessonSlug: string | null = null;

    for (const lessonId of prioritizedLessonIds) {
      const lesson = await ctx.db.get(lessonId);
      if (lesson?.slug) {
        firstLessonSlug = lesson.slug;
        break;
      }
    }

    if (!firstLessonSlug) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .collect();

      const fallbackLesson = lessons
        .filter((lesson): lesson is Doc<"lessons"> => Boolean(lesson))
        .sort((a, b) => a._creationTime - b._creationTime)
        .find((lesson) => Boolean(lesson.slug));

      if (fallbackLesson) {
        firstLessonSlug = fallbackLesson.slug;
      }
    }

    return {
      enrollment,
      firstLessonSlug,
      courseSlug: course.slug,
    };
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
