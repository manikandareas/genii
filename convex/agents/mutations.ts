import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { geniiAgent } from "./genii";

export const createThread = mutation({
  args: {
    prompt: v.string(),
    lessonId: v.optional(v.string()),
    sectionKey: v.optional(v.string()),
    contextTitle: v.optional(v.string()),
    sectionContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User not authenticated");
    }
    const { threadId } = await geniiAgent.createThread(ctx, {
      userId: identity.subject,
    });

    await ctx.db.insert("chat_conversations", {
      threadId,
      clerkId: identity.subject,
      lessonId: args.lessonId ?? undefined,
      sectionKey: args.sectionKey ?? undefined,
      contextTitle: args.contextTitle ?? undefined,
      sectionContent: args.sectionContent ?? undefined,
      title: args.prompt,
      updatedAt: Date.now(),
      isArchived: false,
    });

    await ctx.runMutation(api.agents.mutations.streamChatAsynchronously, {
      prompt: args.prompt,
      threadId,
      sectionContext: args.sectionContent ?? undefined,
      contextTitle: args.contextTitle ?? undefined,
      isFirstMessage: true,
    });

    await ctx.scheduler.runAfter(0, internal.agents.actions.updateThreadTitle, {
      threadId,
    });

    return threadId;
  },
});

export const streamChatAsynchronously = mutation({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    sectionContext: v.optional(v.string()),
    contextTitle: v.optional(v.string()),
    isFirstMessage: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { prompt, threadId, sectionContext, contextTitle, isFirstMessage },
  ) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Get user preferences
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const conversation = await ctx.db
      .query("chat_conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", threadId))
      .unique();

    const trimmedSectionContext = sectionContext?.trim();
    const resolvedSectionContext =
      trimmedSectionContext || conversation?.sectionContent?.trim();
    const resolvedContextTitle = contextTitle ?? conversation?.contextTitle;

    if (conversation) {
      await ctx.db.patch(conversation._id, {
        updatedAt: Date.now(),
        ...(trimmedSectionContext
          ? { sectionContent: trimmedSectionContext }
          : {}),
        ...(contextTitle ? { contextTitle } : {}),
      });
    }

    let promptMessageId: string;

    // Build user preference prompt
    const userPreferencePrompt = buildUserPreferencePrompt(user);

    if (resolvedSectionContext && isFirstMessage) {
      const sectionPromptLines = [
        userPreferencePrompt,
        "Gunakan konteks materi berikut untuk menjawab pertanyaan pengguna secara akurat. Jika jawaban tidak ada dalam konteks ini, jelaskan bahwa informasi tidak tersedia dan sarankan langkah berikutnya.",
        resolvedContextTitle ? `Judul bagian: ${resolvedContextTitle}` : null,
        resolvedSectionContext,
      ].filter((line): line is string => Boolean(line));

      const { messages } = await geniiAgent.saveMessages(ctx, {
        threadId,
        messages: [
          { role: "system", content: sectionPromptLines.join("\n\n") },
          { role: "user", content: prompt },
        ],
        skipEmbeddings: true,
      });

      promptMessageId = messages.at(-1)?._id as string;
    } else {
      // For subsequent messages, add user preference as system message
      const { messages } = await geniiAgent.saveMessages(ctx, {
        threadId,
        messages: [
          { role: "system", content: userPreferencePrompt },
          { role: "user", content: prompt },
        ],
        skipEmbeddings: true,
      });

      promptMessageId = messages.at(-1)?._id as string;
    }

    await ctx.scheduler.runAfter(0, internal.agents.actions.streamChat, {
      threadId,
      promptMessageId,
    });
  },
});

function buildUserPreferencePrompt(
  user:
    | {
        level?: "beginner" | "intermediate" | "advanced";
        explanationStyle?: string;
        languagePreference?: "id" | "en";
      }
    | null
    | undefined,
): string {
  const preferences: string[] = [];

  // Language preference
  const language = user?.languagePreference ?? "id";
  if (language === "id") {
    preferences.push(
      "Jawab dalam Bahasa Indonesia yang jelas dan mudah dipahami.",
    );
  } else {
    preferences.push("Answer in clear and easy-to-understand English.");
  }

  // Level-based instruction
  const level = user?.level ?? "beginner";
  const levelInstructions = {
    beginner:
      language === "id"
        ? "Pengguna adalah pemula. Gunakan bahasa yang sangat sederhana, hindari jargon teknis, dan berikan penjelasan langkah demi langkah dengan contoh konkret."
        : "User is a beginner. Use very simple language, avoid technical jargon, and provide step-by-step explanations with concrete examples.",
    intermediate:
      language === "id"
        ? "Pengguna memiliki pemahaman dasar. Gunakan istilah teknis yang umum dengan penjelasan singkat, dan fokus pada konsep praktis dengan contoh yang relevan."
        : "User has basic understanding. Use common technical terms with brief explanations, and focus on practical concepts with relevant examples.",
    advanced:
      language === "id"
        ? "Pengguna sudah berpengalaman. Gunakan terminologi teknis yang tepat, fokus pada detail implementasi, best practices, dan edge cases."
        : "User is experienced. Use precise technical terminology, focus on implementation details, best practices, and edge cases.",
  };
  preferences.push(levelInstructions[level]);

  // Explanation style with detailed instructions
  const explanationStyle = user?.explanationStyle;
  if (explanationStyle) {
    const styleInstructions = {
      simple:
        language === "id"
          ? "Gaya penjelasan: SEDERHANA & PRAKTIS. Langsung to the point, fokus pada aplikasi praktis. Hindari teori panjang, berikan contoh kode yang bisa langsung dipraktikkan. Format: definisi singkat → cara pakai → contoh kode praktis."
          : "Explanation style: SIMPLE & PRACTICAL. Get straight to the point, focus on practical application. Avoid lengthy theory, provide code examples that can be immediately practiced. Format: brief definition → how to use → practical code example.",
      detailed:
        language === "id"
          ? "Gaya penjelasan: DETAIL & MENDALAM. Berikan penjelasan komprehensif yang mencakup teori, konsep fundamental, best practices, dan implikasi teknis. Jelaskan tidak hanya 'how' tetapi juga 'why'. Sertakan detail implementasi, performa, dan edge cases yang perlu diperhatikan."
          : "Explanation style: DETAILED & COMPREHENSIVE. Provide thorough explanations covering theory, fundamental concepts, best practices, and technical implications. Explain not just 'how' but also 'why'. Include implementation details, performance considerations, and edge cases to watch out for.",
      analogy:
        language === "id"
          ? "Gaya penjelasan: ANALOGI & STORYTELLING. Gunakan perumpamaan, cerita, dan analogi yang relate-able untuk menjelaskan konsep. Buat perbandingan dengan situasi sehari-hari yang mudah dipahami. Hindari penjelasan teknis kering, jadikan pembelajaran lebih engaging dan memorable dengan storytelling."
          : "Explanation style: ANALOGY & STORYTELLING. Use relatable analogies, stories, and comparisons to explain concepts. Draw parallels with everyday situations that are easy to understand. Avoid dry technical explanations, make learning more engaging and memorable through storytelling.",
    };

    const styleInstruction =
      styleInstructions[explanationStyle as keyof typeof styleInstructions];
    if (styleInstruction) {
      preferences.push(styleInstruction);
    } else {
      // Fallback for unknown styles
      const fallback =
        language === "id"
          ? `Gaya penjelasan yang disukai: ${explanationStyle}`
          : `Preferred explanation style: ${explanationStyle}`;
      preferences.push(fallback);
    }
  }

  return preferences.join("\n\n");
}

export const remove = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const conversation = await ctx.db
      .query("chat_conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (conversation.clerkId !== identity.subject) {
      throw new Error("User not authorized to delete this conversation");
    }

    await ctx.db.delete(conversation._id);
  },
});
