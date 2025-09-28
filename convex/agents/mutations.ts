import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { mutation } from '../_generated/server';
import { geniiAgent } from './genii';

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
      throw new Error('User not authenticated');
    }
    const { threadId } = await geniiAgent.createThread(ctx, {
      userId: identity.subject,
    });

    await ctx.db.insert('chat_conversations', {
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

    ctx.runMutation(api.agents.mutations.streamChatAsynchronously, {
      prompt: args.prompt,
      threadId,
      sectionContext: args.sectionContent ?? undefined,
      contextTitle: args.contextTitle ?? undefined,
      isFirstMessage: true,
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
    { prompt, threadId, sectionContext, contextTitle, isFirstMessage }
  ) => {
    const conversation = await ctx.db
      .query('chat_conversations')
      .withIndex('by_thread_id', (q) => q.eq('threadId', threadId))
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

    if (resolvedSectionContext && isFirstMessage) {
      const sectionPromptLines = [
        'Gunakan konteks materi berikut untuk menjawab pertanyaan pengguna secara akurat. Jika jawaban tidak ada dalam konteks ini, jelaskan bahwa informasi tidak tersedia dan sarankan langkah berikutnya.',
        resolvedContextTitle ? `Judul bagian: ${resolvedContextTitle}` : null,
        resolvedSectionContext,
      ].filter((line): line is string => Boolean(line));

      const { messages } = await geniiAgent.saveMessages(ctx, {
        threadId,
        messages: [
          { role: 'system', content: sectionPromptLines.join('\n\n') },
          { role: 'user', content: prompt },
        ],
        skipEmbeddings: true,
      });

      promptMessageId = messages.at(-1)?._id as string;
    } else {
      const { messageId } = await geniiAgent.saveMessage(ctx, {
        threadId,
        prompt,
        skipEmbeddings: true,
      });
      promptMessageId = messageId;
    }

    await ctx.scheduler.runAfter(0, internal.agents.actions.streamChat, {
      threadId,
      promptMessageId,
    });
  },
});

export const remove = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('User not authenticated');
    }

    const conversation = await ctx.db
      .query('chat_conversations')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .unique();

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.clerkId !== identity.subject) {
      throw new Error('User not authorized to delete this conversation');
    }

    await ctx.db.delete(conversation._id);
  },
});
