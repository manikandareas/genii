import { History } from "lucide-react";
import { useMemo, useState } from "react";

// import {
// 	ChatSidebar,
// 	type ChatSidebarThread,
// } from "~/components/ai-elements/chat-sidebar";
import { Button } from "@/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/features/shared/components/ui/sheet";
import { ChatInput } from "./chat-input";
import { AskContextChip } from "./context-chip";
import { MessagesArea } from "./message-area";
import { ChatSidebar, ChatSidebarThread } from "./chat-sidebar";

export interface AIResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string | null;
  onThreadSelect: (threadId: string) => void;
  threads?: ChatSidebarThread[];
  isThreadsLoading?: boolean;
  isCreatingThread?: boolean;
  contextTitle?: string;
}

export function AIResponseDialog({
  open,
  onOpenChange,
  threadId,
  onThreadSelect,
  threads,
  isThreadsLoading = false,
  isCreatingThread = false,
  contextTitle,
}: AIResponseDialogProps) {
  const activeThread = useMemo(
    () => threads?.find((thread) => thread.threadId === threadId),
    [threads, threadId],
  );

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleThreadSelect = (selectedThreadId: string) => {
    onThreadSelect(selectedThreadId);
    setIsMobileSidebarOpen(false);
  };

  const displayContextTitle =
    contextTitle ?? activeThread?.contextTitle ?? undefined;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="top-0 left-0 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 md:top-1/2 md:left-1/2 md:h-auto md:max-h-[85vh] md:min-h-[75vh] md:w-auto md:min-w-[80vw] md:max-w-none md:translate-x-[-50%] md:translate-y-[-50%] md:flex-row md:rounded-3xl md:border lg:max-h-[80vh] lg:min-h-[95vh]">
        <ChatSidebar
          className="hidden w-full max-w-sm border-border/70 border-r bg-background/95 md:flex md:h-full md:w-72 md:max-w-[18rem] md:bg-transparent"
          isLoading={isThreadsLoading}
          onSelectThread={handleThreadSelect}
          selectedThreadId={threadId}
          threads={threads}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DialogHeader className="flex flex-col gap-3 px-4 py-3 text-center md:flex-row md:justify-between md:pr-10 sm:px-6 sm:py-4 md:text-left">
            <div className="flex items-center gap-3">
              <Sheet
                onOpenChange={setIsMobileSidebarOpen}
                open={isMobileSidebarOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    aria-label="Buka riwayat percakapan"
                    className="md:hidden"
                    size="icon"
                    variant="ghost"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="w-full gap-0 border-border/70 border-r bg-background/95 p-0 sm:max-w-sm"
                  side="left"
                >
                  <SheetHeader className="border-border/70 border-b px-4 py-3">
                    <SheetTitle className="text-left font-semibold text-base">
                      Riwayat Percakapan
                    </SheetTitle>
                  </SheetHeader>
                  <ChatSidebar
                    className="h-full w-full border-0"
                    isLoading={isThreadsLoading}
                    onSelectThread={handleThreadSelect}
                    selectedThreadId={threadId}
                    threads={threads}
                  />
                </SheetContent>
              </Sheet>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <span
                  aria-hidden
                  className="rounded-lg bg-primary/10 px-2 py-1 font-semibold text-primary"
                >
                  Genii
                </span>
              </DialogTitle>
            </div>
            {displayContextTitle && (
              <DialogDescription className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground text-sm md:justify-start">
                Konteks:{" "}
                <AskContextChip
                  className="w-fit bg-primary/5"
                  title={displayContextTitle}
                />
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 sm:px-6 sm:pb-6">
            {threadId ? (
              <MessagesArea threadId={threadId} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <p className="font-medium text-base">Mulai percakapan baru</p>
                <p className="max-w-xs text-sm">
                  Buat pertanyaan dari halaman lesson atau pilih thread di sisi
                  kiri untuk melihat riwayat.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:px-6 sm:pt-4 sm:pb-4">
            {threadId ? (
              <ChatInput disabled={isCreatingThread} threadId={threadId} />
            ) : (
              <p className="w-full text-center text-muted-foreground text-sm">
                Kirim pertanyaan dari bar bawah untuk memulai sesi baru.
              </p>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
