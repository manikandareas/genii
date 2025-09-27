import { getAll } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";
import { ensureAuthenticated } from "../../utils";
import type { Doc, Id } from "../../_generated/dataModel";

export const findCoursesByIds = internalQuery({
  args: {
    ids: v.array(v.id("courses")),
  },
  handler: async (ctx, { ids }) => {
    return await getAll(ctx.db, ids);
  },
});

export const getCourses = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const getCourseBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getEnrollmentForCourse = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    const identity = await ensureAuthenticated(ctx);

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("course_enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", courseId),
      )
      .first();
  },
});

export const getCourseContent = query({
  args: {
    courseSlug: v.string(),
  },
  handler: async (ctx, { courseSlug }) => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", courseSlug))
      .first();

    if (!course) {
      return null;
    }

    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .collect();

    const orderedChapters = chapters.sort((a, b) => {
      const aPosition = a.position ?? a._creationTime;
      const bPosition = b.position ?? b._creationTime;
      return aPosition - bPosition;
    });

    const lessonIds = new Set<Id<"lessons">>();
    const quizIds = new Set<Id<"quizzes">>();

    orderedChapters.forEach((chapter) => {
      chapter.contentOrder.forEach((entry) => {
        if (entry.contentType === "lesson") {
          lessonIds.add(entry.contentId as Id<"lessons">);
        }
        if (entry.contentType === "quiz") {
          quizIds.add(entry.contentId as Id<"quizzes">);
        }
      });
    });

    const [lessons, quizzes] = await Promise.all([
      lessonIds.size
        ? getAll(ctx.db, Array.from(lessonIds))
        : Promise.resolve([]),
      quizIds.size
        ? getAll(ctx.db, Array.from(quizIds))
        : Promise.resolve([]),
    ]);

    const lessonById = lessons.reduce<Record<string, Doc<"lessons">>>(
      (acc, lesson) => {
        if (lesson) {
          acc[lesson._id] = lesson;
        }
        return acc;
      },
      {},
    );

    const quizById = quizzes.reduce<Record<string, Doc<"quizzes">>>(
      (acc, quiz) => {
        if (quiz) {
          acc[quiz._id] = quiz;
        }
        return acc;
      },
      {},
    );

    const identity = await ensureAuthenticated(ctx);
    let enrollment: Doc<"course_enrollments"> | null = null;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (user) {
        enrollment = await ctx.db
          .query("course_enrollments")
          .withIndex("by_user_course", (q) =>
            q.eq("userId", user._id).eq("courseId", course._id),
          )
          .first();
      }
    }

    return {
      course,
      chapters: orderedChapters,
      lessons: lessonById,
      quizzes: quizById,
      enrollment,
    };
  },
});
