"use client";

import { Loader2, SendHorizonal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/features/shared/components/ui/button";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { ChatInput } from "@/features/user/agent/components/chat-input";
import { type ChatSidebarThread } from "@/features/user/agent/components/chat-sidebar";
import { AskContextChip } from "@/features/user/agent/components/context-chip";
import { MessagesArea } from "@/features/user/agent/components/message-area";
import { useSectionAsk } from "@/features/user/agent/context/ask-context";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import HistoryChatDialog from "./history-chat-dialog";

interface ArtifactsPanelProps {
  threadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onStartConversation: (prompt: string) => Promise<void> | void;
  onClose: () => void;
  threads: ChatSidebarThread[];
  isThreadsLoading?: boolean;
  isCreatingThread?: boolean;
  contextTitle?: string;
}

export function ArtifactsPanel({
  threadId,
  onThreadSelect,
  onStartConversation,
  onClose,
  threads,
  isThreadsLoading = false,
  isCreatingThread = false,
  contextTitle,
}: ArtifactsPanelProps) {
  const {
    setDialogOpen,
    clearHistorySelection,
    context,
    clearContext,
    historySelection,
  } = useSectionAsk();

  const threadDetails = useQuery(
    convexQuery(
      api.agents.queries.getThreadDetails,
      threadId ? { threadId } : "skip",
    ),
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeContextTitle = useMemo(() => {
    if (contextTitle) return contextTitle;
    if (historySelection?.title) return historySelection.title;
    return context?.title;
  }, [context?.title, contextTitle, historySelection?.title]);

  const handleThreadSelect = (selectedThreadId: string) => {
    clearHistorySelection();
    onThreadSelect(selectedThreadId);
    setDialogOpen(true);
    setIsSidebarOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
    clearHistorySelection();
    onClose();
  };

  const handleNewConversationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draftPrompt.trim();
    if (!trimmed || isCreatingThread || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onStartConversation(trimmed);
      setDraftPrompt("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col border-l border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleClose}>
            <X />
          </Button>
          <span className=" font-semibold text-muted-foreground truncate w-52 md:max-w-sm md:w-full text-sm">
            {threadDetails?.data?.title || draftPrompt || "Artifacts"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeContextTitle && (
            <AskContextChip
              className="w-fit bg-primary/5 text-xs"
              onClear={clearContext}
              title={activeContextTitle}
            />
          )}

          <HistoryChatDialog
            onSelectThread={handleThreadSelect}
            threads={threads}
            selectedThreadId={threadId}
            isLoading={isThreadsLoading}
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 sm:px-6">
            {threadId ? (
              <MessagesArea threadId={threadId} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <p className="font-medium text-base">Mulai percakapan baru</p>
                <p className="max-w-xs text-sm">
                  Pilih thread di sebelah kiri atau kirim pertanyaan baru
                  menggunakan formulir di bawah.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border/70 px-4 py-4 sm:px-6">
            {threadId ? (
              <ChatInput disabled={isCreatingThread} threadId={threadId} />
            ) : (
              <form
                className="space-y-3"
                onSubmit={handleNewConversationSubmit}
              >
                {context && (
                  <AskContextChip
                    className="w-fit bg-primary/10"
                    onClear={clearContext}
                    title={context.title ?? "Bagian terpilih"}
                  />
                )}
                <Textarea
                  aria-label="Pertanyaan baru"
                  className="min-h-[96px] resize-y rounded-xl"
                  disabled={isCreatingThread || isSubmitting}
                  onChange={(event) => setDraftPrompt(event.target.value)}
                  placeholder="Tulis pertanyaan untuk memulai percakapan..."
                  value={draftPrompt}
                />
                <div className="flex items-center justify-end gap-2">
                  {(isCreatingThread || isSubmitting) && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengirim pertanyaan…
                    </div>
                  )}
                  <Button
                    className="inline-flex items-center gap-2"
                    disabled={
                      !draftPrompt.trim() || isCreatingThread || isSubmitting
                    }
                    size="sm"
                    type="submit"
                  >
                    <SendHorizonal className="h-4 w-4" />
                    Kirim
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
