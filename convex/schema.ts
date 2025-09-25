import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    firstName: v.string(),
    fullName: v.string(),
    lastName: v.string(),
    avatarUrl: v.string(),
    email: v.string(),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
    onboardingStatus: v.optional(
      v.union(v.literal("not_started"), v.literal("completed")),
    ),
    learningGoals: v.optional(v.array(v.string())),
    studyReason: v.optional(v.string()),
    studyPlan: v.optional(v.string()),
    level: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
      ),
    ),
    studyStreak: v.optional(v.number()),
    streakStartDate: v.optional(v.number()),
    explanationStyle: v.optional(v.string()),
    languagePreference: v.optional(
      v.union(v.literal("id"), v.literal("en"), v.literal("mix")),
    ),
    analytics: v.optional(
      v.object({
        totalXP: v.optional(v.number()),
        currentLevel: v.optional(v.number()),
        totalStudyTimeMinutes: v.optional(v.number()),
        averageSessionTime: v.optional(v.number()),
        strongestSkills: v.optional(v.array(v.string())),
        improvementAreas: v.optional(v.array(v.string())),
      }),
    ),
    emailPreferences: v.optional(
      v.object({
        welcomeEmail: v.optional(v.boolean()),
        achievementEmails: v.optional(v.boolean()),
        courseCompletionEmails: v.optional(v.boolean()),
        weeklyDigest: v.optional(v.boolean()),
        unsubscribedAt: v.optional(v.number()),
      }),
    ),
    lastEmailSent: v.optional(v.number()),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_email", ["email"]),

  topics: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
    thumbnail: v.optional(
      v.object({
        assetRef: v.id("_storage"),
        url: v.optional(v.string()),
        metadata: v.optional(v.any()),
      }),
    ),
    trailerUrl: v.optional(v.string()),
    topicIds: v.array(v.id("topics")),
    learningOutcomes: v.optional(v.array(v.string())),
    resources: v.optional(
      v.array(
        v.object({
          label: v.string(),
          url: v.string(),
        }),
      ),
    ),
    featured: v.optional(v.boolean()),
    readonly: v.optional(v.boolean()),
    resourcesDigest: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_difficulty", ["difficulty"])
    .index("by_featured", ["featured"]),

  chapters: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    position: v.optional(v.number()),
    contentOrder: v.array(
      v.object({
        contentId: v.union(v.id("lessons"), v.id("quizzes")),
        contentType: v.union(v.literal("lesson"), v.literal("quiz")),
        position: v.optional(v.number()),
      }),
    ),
    updatedAt: v.number(),
  })
    .index("by_course", ["courseId"])
    .index("by_slug", ["slug"]),

  lessons: defineTable({
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
    title: v.string(),
    slug: v.string(),
    content: v.any(),
    videoUrl: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_chapter", ["chapterId"])
    .index("by_course", ["courseId"]),

  quizzes: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    maxAttempt: v.optional(v.number()),
    courseId: v.optional(v.id("courses")),
    chapterId: v.optional(v.id("chapters")),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctOptionIndex: v.number(),
        explanation: v.optional(v.string()),
      }),
    ),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_course", ["courseId"])
    .index("by_chapter", ["chapterId"]),

  assets: defineTable({
    filename: v.string(),
    storageId: v.id("_storage"),
    url: v.string(),
    mimeType: v.string(),
    size: v.number(),
    uploadedBy: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_filename", ["filename"]),

  course_enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    courseSlug: v.optional(v.string()),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
    ),
    percentComplete: v.optional(v.number()),
    contentsCompleted: v.optional(
      v.array(
        v.object({
          contentId: v.string(),
          contentType: v.optional(
            v.union(
              v.literal("lesson"),
              v.literal("quiz"),
              v.literal("assessment"),
            ),
          ),
          completedAt: v.optional(v.number()),
        }),
      ),
    ),
    dateCompleted: v.optional(v.number()),
    lastActivityAt: v.optional(v.number()),
    metadata: v.optional(
      v.object({
        cohortId: v.optional(v.string()),
        context: v.optional(v.string()),
      }),
    ),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]),

  quiz_attempts: defineTable({
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    courseId: v.optional(v.id("courses")),
    chapterId: v.optional(v.id("chapters")),
    attemptNumber: v.number(),
    status: v.union(
      v.literal("in_progress"),
      v.literal("submitted"),
      v.literal("graded"),
    ),
    answers: v.array(
      v.object({
        questionIndex: v.number(),
        selectedOptionIndex: v.number(),
        outcome: v.optional(
          v.union(v.literal("correct"), v.literal("incorrect")),
        ),
        timeTakenMs: v.optional(v.number()),
      }),
    ),
    correctCount: v.optional(v.number()),
    totalQuestions: v.number(),
    score: v.optional(v.number()),
    percentage: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    submittedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    feedback: v.optional(v.string()),
    metadata: v.optional(v.any()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_quiz", ["quizId"])
    .index("by_user_quiz", ["userId", "quizId"])
    .index("by_status", ["status"]),

  course_recommendations: defineTable({
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    query: v.string(),
    createdForUserId: v.optional(v.id("users")),
    summary: v.optional(v.string()),
    recommendations: v.optional(
      v.array(
        v.object({
          courseId: v.optional(v.id("courses")),
          courseSlug: v.optional(v.string()),
          reason: v.optional(v.string()),
          data: v.optional(v.string()),
        }),
      ),
    ),
    message: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_user", ["createdForUserId"]),

  /**
   * Legacy conversation structure (kept for backward compatibility during rollout)
   */
  chat_conversations: defineTable({
    clerkId: v.string(),
    threadId: v.string(),
    sectionKey: v.optional(v.string()),
    lessonId: v.optional(v.string()),
    contextTitle: v.optional(v.string()),
    sectionContent: v.optional(v.string()),
    title: v.optional(v.string()),
    updatedAt: v.number(),
    isArchived: v.boolean(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_thread_id", ["threadId"])
    .index("by_section_key", ["sectionKey"])
    .index("by_lesson_id", ["lessonId"]),
});
