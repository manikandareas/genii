import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { Doc, Id } from "../../_generated/dataModel";
import { workflow } from "../../components";

export const recommendationWorkflow = workflow.define({
  args: {
    userId: v.id("users"),
  },
  handler: async (step, args) => {
    await step.runMutation(
      internal.users.recommendation.mutations.upsertCourseRecommendation,
      {
        status: "in_progress",
        generationMessage: "Memulai mencari kursus yang cocok untukmu",
        query: "",
        createdFor: args.userId,
      },
    );

    const { embeddings, success, query } = await step.runAction(
      internal.users.actions.generateAndStoreUserEmbeddings,
      { id: args.userId },
    );

    if (!success) {
      await step.runMutation(
        internal.users.recommendation.mutations.upsertCourseRecommendation,
        {
          status: "failed",
          query,
          createdFor: args.userId,
          generationMessage: "Gagal menghasilkan rekomendasi",
        },
      );
    }

    const recommendedCandidates = await step.runAction(
      internal.users.recommendation.actions.similarCourses,
      { embedding: embeddings },
    );

    await step.runMutation(
      internal.users.recommendation.mutations.upsertCourseRecommendation,
      {
        status: "in_progress",
        query,
        createdFor: args.userId,
        generationMessage: "Mengurutkan kursus sesuai kebutuhan mu",
      },
    );

    const courses = await step.runQuery(
      internal.users.courses.queries.findCoursesByIds,
      { ids: recommendedCandidates.map((c) => c._id) },
    );

    const sortedCandidates = await step.runAction(
      internal.users.recommendation.actions.sortCandidatesAndGenerateReasons,
      { candidates: courses as Doc<"courses">[], userQuery: query },
    );

    await step.runMutation(
      internal.users.recommendation.mutations.upsertCourseRecommendation,
      {
        status: "completed",
        query,
        createdFor: args.userId,
        generationMessage: "Journey mu sudah siap dimulai!",
        summary: sortedCandidates.summary,
        recommendations: sortedCandidates.recommendations.map((r) => ({
          courseId: r.courseId as Id<"courses">,
          reason: r.reason,
          order: r.order,
        })),
      },
    );
  },
});
