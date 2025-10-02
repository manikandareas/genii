"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Badge } from "./badge";

// Type definitions based on AI SDK
type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

interface ToolProps extends React.ComponentProps<typeof Collapsible> {
  children: React.ReactNode;
}

interface ToolHeaderProps
  extends Omit<React.ComponentProps<typeof CollapsibleTrigger>, "type"> {
  type: string;
  state: ToolState;
  className?: string;
}

interface ToolContentProps
  extends React.ComponentProps<typeof CollapsibleContent> {
  children: React.ReactNode;
}

interface ToolInputProps extends React.ComponentPropsWithoutRef<"div"> {
  input: Record<string, unknown>;
}

interface ToolOutputProps extends React.ComponentPropsWithoutRef<"div"> {
  output?: React.ReactNode;
  errorText?: string;
}

const Tool = React.forwardRef<
  React.ElementRef<typeof Collapsible>,
  ToolProps
>(({ children, ...props }, ref) => {
  return (
    <Collapsible ref={ref} {...props}>
      {children}
    </Collapsible>
  );
});
Tool.displayName = "Tool";

const getStateConfig = (state: ToolState) => {
  switch (state) {
    case "input-streaming":
      return {
        icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
        label: "Pending",
        variant: "secondary" as const,
      };
    case "input-available":
      return {
        icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
        label: "Running",
        variant: "default" as const,
      };
    case "output-available":
      return {
        icon: <Check className="h-3.5 w-3.5" />,
        label: "Completed",
        variant: "default" as const,
      };
    case "output-error":
      return {
        icon: <X className="h-3.5 w-3.5" />,
        label: "Error",
        variant: "destructive" as const,
      };
  }
};

const ToolHeader = React.forwardRef<
  React.ElementRef<typeof CollapsibleTrigger>,
  ToolHeaderProps
>(({ type, state, className, ...props }, ref) => {
  const config = getStateConfig(state);

  return (
    <CollapsibleTrigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          {config.icon}
        </div>
        <span className="font-mono text-sm font-medium">tool-{type}</span>
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
});
ToolHeader.displayName = "ToolHeader";

const ToolContent = React.forwardRef<
  React.ElementRef<typeof CollapsibleContent>,
  ToolContentProps
>(({ children, ...props }, ref) => {
  return (
    <CollapsibleContent
      ref={ref}
      className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      {...props}
    >
      <div className="space-y-3 p-4">{children}</div>
    </CollapsibleContent>
  );
});
ToolContent.displayName = "ToolContent";

const ToolInput = React.forwardRef<HTMLDivElement, ToolInputProps>(
  ({ input, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Input
        </div>
        <div className="rounded-lg bg-muted p-3">
          <pre className="overflow-auto text-xs">
            <code>{JSON.stringify(input, null, 2)}</code>
          </pre>
        </div>
      </div>
    );
  },
);
ToolInput.displayName = "ToolInput";

const ToolOutput = React.forwardRef<HTMLDivElement, ToolOutputProps>(
  ({ output, errorText, className, ...props }, ref) => {
    if (errorText) {
      return (
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          <div className="text-xs font-medium uppercase tracking-wide text-destructive">
            Error
          </div>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{errorText}</p>
          </div>
        </div>
      );
    }

    if (!output) return null;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Output
        </div>
        <div className="rounded-lg bg-muted p-3">
          {typeof output === "string" ? (
            <pre className="overflow-auto text-xs">
              <code>{output}</code>
            </pre>
          ) : (
            output
          )}
        </div>
      </div>
    );
  },
);
ToolOutput.displayName = "ToolOutput";

export { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput };
export type { ToolState, ToolProps, ToolHeaderProps, ToolInputProps, ToolOutputProps };
