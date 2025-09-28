import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { geniiAgent } from './genii';

export const streamChat = internalAction({
  args: {
    promptMessageId: v.string(),
    threadId: v.string(),
  },
  handler: async (ctx, { promptMessageId, threadId }) => {
    const { thread } = await geniiAgent.continueThread(ctx, { threadId });
    const result = await thread.streamText(
      { promptMessageId },
      { saveStreamDeltas: true }
    );
    await result.consumeStream();
  },
});
