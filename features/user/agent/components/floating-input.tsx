import { Send } from "lucide-react";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Floating primitives in shadcn-style
 * - <FloatingInput> mirrors shadcn <Input> API (forwardRef + ComponentProps<'input'>)
 * - <FloatingBar> positions a form at bottom-center with micro-interactions
 *   (hover scale, focus width expand) and accepts left/right slots.
 */

// —— 1) Flexible input primitive (shadcn-compatible) ——
export const FloatingInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      className={cn(
        // Base from shadcn <Input>, kept flexible
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none",
        "transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
        "placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

        // Focus/validation states
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      data-slot="input"
      ref={ref}
      type={type}
      {...props}
    />
  );
});
FloatingInput.displayName = "FloatingInput";

// —— 2) Bottom-center floating bar container ——
export function FloatingBar({
  onSubmit,
  className,
  inputClassName,
  placeholder = "Tanya apa saja…",
  initialValue = "",
  leftSlot = null,
  rightSlot,
}: {
  onSubmit?: (value: string) => void | Promise<void>;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  initialValue?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  const [value, setValue] = React.useState(initialValue);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    await onSubmit?.(v);
    setValue("");
  }

  return (
    <div
      className={cn(
        "group fixed inset-x-0 bottom-3 z-50 mx-auto flex justify-center sm:bottom-5",
        className,
      )}
    >
      <form
        aria-label="Floating ask input"
        className={cn(
          // Width + micro-interactions
          "w-[min(92vw,560px)] transition-all duration-200 ease-out",
          "focus-within:w-[min(92vw,640px)] group-hover:scale-[1.02]",
          // Card look using shadcn tokens
          "relative flex items-center gap-2 rounded-2xl border bg-card/70 px-3 py-2 text-card-foreground",
          "border-border shadow-lg backdrop-blur",
          // Focus ring on container
          "focus-within:ring-4 focus-within:ring-ring/20",
        )}
        onSubmit={handleSubmit}
      >
        {leftSlot && (
          <div aria-hidden className="text-muted-foreground/90">
            {leftSlot}
          </div>
        )}
        <FloatingInput
          aria-label={placeholder}
          autoComplete="off"
          className={cn(
            "h-6 border-0 bg-transparent px-0 text-[15px] leading-6 shadow-none md:h-7",
            "focus-visible:border-0 focus-visible:ring-0",
            inputClassName,
          )}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          value={value}
        />
        {rightSlot ?? (
          <button
            aria-label="Kirim"
            className={cn(
              "grid place-items-center rounded-xl border p-2",
              "border-border bg-accent/20 transition-transform duration-200 hover:bg-accent/30",
              "hover:scale-105 active:scale-95",
            )}
            type="submit"
          >
            <Send className="size-4" />
          </button>
        )}
      </form>
    </div>
  );
}
