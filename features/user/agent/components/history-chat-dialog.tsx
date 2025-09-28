import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/features/shared/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { Input } from "@/features/shared/components/ui/input";
import { Separator } from "@/features/shared/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import {
  History as HistoryIcon,
  Loader,
  MoreVertical,
  Search,
  Trash,
} from "lucide-react";
import React, { useMemo, useState } from "react";

export type ChatConversations = Doc<"chat_conversations">;

interface HistoryChatDialogProps {
  threads?: ChatConversations[];
  selectedThreadId?: string | null;
  onSelectThread: (threadId: string) => void;
  isLoading?: boolean;
  className?: string;
  emptyState?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function HistoryChatDialog({
  threads,
  selectedThreadId,
  onSelectThread,
  isLoading = false,
  emptyState,
  open,
  onOpenChange,
}: HistoryChatDialogProps) {
  const { user } = useUser();
  const removeConversation = useMutation(api.agents.mutations.remove);
  const [searchTerm, setSearchTerm] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const filteredThreads = useMemo(() => {
    if (!threads) return [];
    const normalized = searchTerm.trim().toLowerCase();

    const sorted = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);

    if (!normalized) return sorted;

    return sorted.filter((thread) => {
      const haystack = [thread.title, thread.contextTitle, thread.sectionKey]
        .filter((part): part is string => Boolean(part?.length))
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [threads, searchTerm]);

  const handleRemove = async (threadId: string) => {
    try {
      await removeConversation({ threadId });
    } catch (error) {
      console.error("Failed to remove conversation", error);
    }
  };
  const triggerButton = (
    <Button size="icon" variant="ghost">
      <HistoryIcon />
    </Button>
  );

  const historyContent = (
    <>
      <div className="relative">
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          aria-label="Cari percakapan"
          className="pl-9"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Cari thread atau topik"
          value={searchTerm}
        />
      </div>

      <Separator />
      <div className="flex-1 overflow-y-auto py-3">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Memuat percakapan...
          </div>
        )}

        {!isLoading && filteredThreads.length === 0 && (
          <div className="rounded-lg border border-border/70 border-dashed bg-background/60 p-6 text-center text-muted-foreground text-sm">
            {emptyState ?? "Belum ada percakapan untuk ditampilkan."}
          </div>
        )}

        <ul className="space-y-1">
          {filteredThreads.map((thread) => {
            const isActive = thread.threadId === selectedThreadId;
            const title = thread.title?.trim() ?? "";
            const displayTitle =
              title.length > 0 ? title : "Percakapan tanpa judul";
            const subtitleRaw = thread.contextTitle?.trim() ?? "";
            const subtitle =
              subtitleRaw || thread.sectionKey?.trim() || "Tanpa konteks";

            return (
              <li key={thread.threadId}>
                <button
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left transition-colors",
                    isActive
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "hover:border-border/80 hover:bg-muted/70",
                  )}
                  onClick={() => onSelectThread(thread.threadId)}
                  type="button"
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-sm capitalize">
                      {displayTitle}
                    </span>
                    <span className="truncate text-muted-foreground text-xs">
                      {subtitle}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-2 h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Button
                          className="w-full"
                          onClick={() => handleRemove(thread.threadId)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-2xl sm:max-h-[80vh] overflow-y-scroll flex flex-col">
          <DialogHeader>
            <DialogTitle>Hai {user?.username || user?.firstName}</DialogTitle>
            <DialogDescription>Riwayat percakapan</DialogDescription>
          </DialogHeader>
          <div className="flex flex-1 flex-col space-y-4">{historyContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[85vh] overflow-y-scroll flex flex-col pb-4">
        <DrawerHeader className="text-left">
          <DrawerTitle>Hai {user?.username || user?.firstName}</DrawerTitle>
          <DrawerDescription>Riwayat percakapan</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-1 flex-col space-y-4 px-4">
          {historyContent}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
