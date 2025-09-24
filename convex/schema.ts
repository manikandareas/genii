import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
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
    goal: v.optional(v.string()),
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
});
