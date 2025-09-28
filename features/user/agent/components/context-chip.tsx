import { motion } from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AskContextChipProps {
  title: string;
  onClear?: () => void;
  className?: string;
}

export function AskContextChip({
  title,
  onClear,
  className,
}: AskContextChipProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-medium text-primary text-xs shadow-xs backdrop-blur",
        className,
      )}
      exit={{ opacity: 0, scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.95 }}
      layout
    >
      #
      <span className="max-w-[140px] truncate" title={title}>
        {title}
      </span>
      {onClear && (
        <button
          aria-label="Hapus konteks"
          className="ml-1 rounded-full border border-transparent p-1 text-primary transition-colors hover:border-primary/40 hover:bg-primary/20"
          onClick={onClear}
          type="button"
        >
          <X aria-hidden className="size-3" />
        </button>
      )}
    </motion.div>
  );
}
