import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { api } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await ctx.runQuery(api.users.queries.getUserByClerkId, {
      clerkId: clerkUserId,
    });

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const publicMetadata = (data.public_metadata ?? {}) as Partial<{
      onboardingStatus: "not_started" | "completed";
      role: "user" | "admin";
    }>;

    const firstName = data.first_name ?? "";
    const lastName = data.last_name ?? "";
    const email = data.email_addresses?.[0]?.email_address ?? "";
    const fullNameCandidate = `${firstName} ${lastName}`.trim();

    const userAttributes = {
      fullName:
        fullNameCandidate.length > 0
          ? fullNameCandidate
          : (data.username ?? email),
      email,
      avatarUrl: data.image_url ?? "",
      onboardingStatus:
        publicMetadata?.onboardingStatus === "completed"
          ? "completed"
          : "not_started",
      clerkId: data.id,
      firstName,
      lastName,
      username: data.username ?? "",
      role: publicMetadata?.role === "admin" ? "admin" : "user",
    } as Doc<"users">;

    const user = await ctx.runQuery(api.users.queries.getUserByClerkId, {
      clerkId: data.id,
    });
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});
