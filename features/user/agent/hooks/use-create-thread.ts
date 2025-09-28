import { useCallback, useState } from 'react';
import { useChatService } from './use-chat-service';

/**
 * Custom hook for creating new chat threads
 */
interface CreateThreadArgs {
  prompt: string;
  lessonId?: string;
  sectionKey?: string;
  contextTitle?: string;
  sectionContent?: string;
}

export const useCreateThread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { createThread } = useChatService();

  const createThreadMutation = createThread();

  const createNewThread = useCallback(
    async ({
      prompt,
      lessonId,
      sectionKey,
      contextTitle,
      sectionContent,
    }: CreateThreadArgs) => {
      if (!prompt.trim()) return null;

      setIsLoading(true);
      setError(null);

      try {
        const newId = await createThreadMutation({
          prompt,
          lessonId,
          sectionKey,
          contextTitle,
          sectionContent,
        });
        return newId;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to create thread')
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [createThreadMutation]
  );

  return {
    createThread: createNewThread,
    isLoading,
    error,
  };
};
