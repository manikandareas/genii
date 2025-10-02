import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { ensureUser } from "../../utils";

/**
 * Start a new quiz attempt
 */
export const startAttempt = mutation({
  args: {
    quizId: v.id("quizzes"),
    courseId: v.optional(v.id("courses")),
    chapterId: v.optional(v.id("chapters")),
  },
  handler: async (ctx, args) => {
    const identity = await ensureUser(ctx);
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

    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Check if there's already an in-progress attempt
    const existingAttempts = await ctx.db
      .query("quiz_attempts")
      .withIndex("by_user_quiz", (q) =>
        q.eq("userId", user._id).eq("quizId", args.quizId),
      )
      .collect();

    const inProgressAttempt = existingAttempts.find(
      (a) => a.status === "in_progress",
    );

    if (inProgressAttempt) {
      return inProgressAttempt._id;
    }

    // Check max attempts
    const completedAttempts = existingAttempts.filter(
      (a) => a.status === "graded",
    );

    if (
      quiz.maxAttempt &&
      completedAttempts.length >= quiz.maxAttempt
    ) {
      throw new Error("Maximum attempts reached");
    }

    // Create new attempt
    const attemptId = await ctx.db.insert("quiz_attempts", {
      userId: user._id,
      quizId: args.quizId,
      courseId: args.courseId,
      chapterId: args.chapterId,
      attemptNumber: existingAttempts.length + 1,
      status: "in_progress",
      answers: [],
      totalQuestions: quiz.questions.length,
      startedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return attemptId;
  },
});

/**
 * Submit answer for a question
 */
export const submitAnswer = mutation({
  args: {
    attemptId: v.id("quiz_attempts"),
    questionIndex: v.number(),
    selectedOptionIndex: v.number(),
    timeTakenMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureUser(ctx);
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

    const attempt = await ctx.db.get(args.attemptId);

    if (!attempt || attempt.userId !== user._id) {
      throw new Error("Attempt not found or unauthorized");
    }

    if (attempt.status !== "in_progress") {
      throw new Error("Attempt is not in progress");
    }

    const quiz = await ctx.db.get(attempt.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const question = quiz.questions[args.questionIndex];
    if (!question) {
      throw new Error("Question not found");
    }

    // Determine if answer is correct
    const isCorrect = question.correctOptionIndex === args.selectedOptionIndex;

    // Update or add answer
    const existingAnswerIndex = attempt.answers.findIndex(
      (a) => a.questionIndex === args.questionIndex,
    );

    const newAnswer = {
      questionIndex: args.questionIndex,
      selectedOptionIndex: args.selectedOptionIndex,
      outcome: isCorrect ? ("correct" as const) : ("incorrect" as const),
      timeTakenMs: args.timeTakenMs,
    };

    let updatedAnswers;
    if (existingAnswerIndex >= 0) {
      updatedAnswers = [...attempt.answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers = [...attempt.answers, newAnswer];
    }

    await ctx.db.patch(args.attemptId, {
      answers: updatedAnswers,
      updatedAt: Date.now(),
    });

    return {
      isCorrect,
      explanation: question.explanation,
      correctOptionIndex: question.correctOptionIndex,
    };
  },
});

/**
 * Complete quiz attempt
 */
export const completeAttempt = mutation({
  args: {
    attemptId: v.id("quiz_attempts"),
  },
  handler: async (ctx, { attemptId }) => {
    const identity = await ensureUser(ctx);
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

    const attempt = await ctx.db.get(attemptId);

    if (!attempt || attempt.userId !== user._id) {
      throw new Error("Attempt not found or unauthorized");
    }

    if (attempt.status !== "in_progress") {
      throw new Error("Attempt is not in progress");
    }

    // Calculate score
    const correctCount = attempt.answers.filter(
      (a) => a.outcome === "correct",
    ).length;
    const totalQuestions = attempt.totalQuestions;
    const percentage = (correctCount / totalQuestions) * 100;
    const score = Math.round(percentage);

    const submittedAt = Date.now();
    const durationMs = attempt.startedAt
      ? submittedAt - attempt.startedAt
      : undefined;

    await ctx.db.patch(attemptId, {
      status: "graded",
      correctCount,
      score,
      percentage,
      submittedAt,
      durationMs,
      updatedAt: Date.now(),
    });

    // Update course enrollment if applicable
    if (attempt.courseId) {
      const quiz = await ctx.db.get(attempt.quizId);
      if (quiz) {
        const enrollment = await ctx.db
          .query("course_enrollments")
          .withIndex("by_user_course", (q) =>
            q.eq("userId", user._id).eq("courseId", attempt.courseId!),
          )
          .first();

        if (enrollment) {
          const contentsCompleted = enrollment.contentsCompleted || [];
          const quizIdString = attempt.quizId;
          const existingCompletion = contentsCompleted.find(
            (c) => c.contentId === quizIdString,
          );

          if (!existingCompletion && percentage >= 70) {
            // Mark as completed if score >= 70%
            const updatedContents = [
              ...contentsCompleted,
              {
                contentId: quizIdString,
                contentType: "quiz" as const,
                completedAt: Date.now(),
              },
            ];

            await ctx.db.patch(enrollment._id, {
              contentsCompleted: updatedContents,
              lastActivityAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        }
      }
    }

    return attemptId;
  },
});
