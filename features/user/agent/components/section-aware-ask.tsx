import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AskContextChip } from "@/features/user/agent/components/context-chip";
import { FloatingBar } from "@/features/user/agent/components/floating-input";
import { AIResponseDialog } from "@/features/user/agent/components/ai-response-dialog";
import { useSectionAsk } from "@/features/user/agent/context/ask-context";
import { useCreateThread } from "@/features/user/agent/hooks/use-create-thread";

interface SectionAwareAskProps {
  lessonId: string;
}

export function SectionAwareAsk({ lessonId }: SectionAwareAskProps) {
  const {
    context,
    clearContext,
    isDialogOpen,
    setDialogOpen,
    setHistorySections,
    historySelection,
    clearHistorySelection,
  } = useSectionAsk();

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const { createThread, isLoading: isCreatingThread } = useCreateThread();

  const userRooms = useQuery(api.agents.queries.userRooms, {});

  const lessonThreads = useMemo(() => {
    if (!userRooms) return;
    return userRooms.filter((room) => room.lessonId === lessonId);
  }, [lessonId, userRooms]);

  useEffect(() => {
    if (!lessonThreads) return;
    setHistorySections(lessonThreads.map((room) => room.sectionKey ?? null));
  }, [lessonThreads, setHistorySections]);

  useEffect(() => {
    if (!lessonThreads) return;
    if (!historySelection?.sectionKey) return;

    const match = lessonThreads
      .filter((room) => room.sectionKey === historySelection.sectionKey)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0];

    if (!match) {
      clearHistorySelection();
      return;
    }

    setActiveThreadId(match.threadId);
    setDialogOpen(true);
  }, [historySelection, lessonThreads, clearHistorySelection, setDialogOpen]);

  const handleSubmit = useCallback(
    async (rawValue: string) => {
      const prompt = rawValue.trim();
      if (!prompt) return;
      console.log({
        prompt,
        lessonId,
        sectionKey: context?.sectionKey,
        contextTitle: context?.title,
        sectionContent: context?.content,
      });
      try {
        const threadId = await createThread({
          prompt,
          lessonId,
          sectionKey: context?.sectionKey,
          contextTitle: context?.title,
          sectionContent: context?.content,
        });

        if (!threadId) return;

        setActiveThreadId(threadId);
        setDialogOpen(true);
        clearHistorySelection();
      } catch (error) {
        console.error("Failed to create thread", error);
      }
    },
    [
      context?.sectionKey,
      context?.title,
      context?.content,
      createThread,
      lessonId,
      setDialogOpen,
      clearHistorySelection,
    ],
  );

  const handleDialogChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
        setActiveThreadId(null);
      }
    },
    [setDialogOpen],
  );

  const handleThreadSelect = useCallback(
    (threadId: string) => {
      clearHistorySelection();
      setActiveThreadId(threadId);
      setDialogOpen(true);
    },
    [clearHistorySelection, setDialogOpen],
  );

  const dialogContextTitle = useMemo(() => {
    const activeThread = lessonThreads?.find(
      (thread) => thread.threadId === activeThreadId,
    );

    if (activeThread?.contextTitle) return activeThread.contextTitle;
    if (activeThread?.sectionKey && historySelection?.title) {
      return historySelection.title;
    }

    return context?.title;
  }, [activeThreadId, context?.title, historySelection?.title, lessonThreads]);

  return (
    <>
      {!isDialogOpen && (
        <FloatingBar
          leftSlot={
            context ? (
              <AskContextChip
                key={context.sectionKey}
                onClear={clearContext}
                title={context.title ?? "Bagian terpilih"}
              />
            ) : null
          }
          onSubmit={handleSubmit}
        />
      )}
      {/* <AIResponseDialog
        contextTitle={dialogContextTitle ?? undefined}
        isCreatingThread={isCreatingThread}
        isThreadsLoading={lessonThreads === undefined}
        onOpenChange={handleDialogChange}
        onThreadSelect={handleThreadSelect}
        open={isDialogOpen}
        threadId={activeThreadId}
        threads={lessonThreads}
      /> */}
    </>
  );
}
