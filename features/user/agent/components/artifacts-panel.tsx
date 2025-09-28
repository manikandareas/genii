"use client";

import { History, Loader2, SendHorizonal } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/features/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { AskContextChip } from "@/features/user/agent/components/context-chip";
import { ChatInput } from "@/features/user/agent/components/chat-input";
import {
  ChatSidebar,
  type ChatSidebarThread,
} from "@/features/user/agent/components/chat-sidebar";
import { MessagesArea } from "@/features/user/agent/components/message-area";
import { useSectionAsk } from "@/features/user/agent/context/ask-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/features/shared/components/ui/sheet";
import { Textarea } from "@/features/shared/components/ui/textarea";

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
    setIsMobileSidebarOpen(false);
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
    <div className="flex h-full flex-col border-l border-border/70 bg-background/95">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            aria-label="Buka riwayat percakapan"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(true)}
            size="icon"
            variant="ghost"
          >
            <History className="h-5 w-5" />
          </Button>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-muted-foreground">
              Artifacts
            </span>
            {activeContextTitle && (
              <AskContextChip
                className="w-fit bg-primary/5 text-xs"
                onClear={clearContext}
                title={activeContextTitle}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* <aside className="hidden h-full w-72 flex-shrink-0 border-r border-border/70 bg-background/90 md:flex">
          <ChatSidebar
            className="h-full"
            isLoading={isThreadsLoading}
            onSelectThread={handleThreadSelect}
            selectedThreadId={threadId}
            threads={threads}
          />
        </aside> */}

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

      <Sheet onOpenChange={setIsMobileSidebarOpen} open={isMobileSidebarOpen}>
        <SheetContent
          className={cn(
            "w-full max-w-xs border-border/70 border-r bg-background/95 p-0",
          )}
          side="left"
        >
          <SheetHeader className="border-b border-border/70 px-4 py-3">
            <SheetTitle className="text-left font-semibold text-base">
              Riwayat Percakapan
            </SheetTitle>
          </SheetHeader>
          <ChatSidebar
            className="h-full"
            isLoading={isThreadsLoading}
            onSelectThread={handleThreadSelect}
            selectedThreadId={threadId}
            threads={threads}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
