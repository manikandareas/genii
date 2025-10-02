"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import React from "react";
import Image from "next/image";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  type ToolState,
} from "@/features/shared/components/ui/tool";

type UIMessagePart = UIMessage["parts"][number];

interface ToolDisplayProps {
  parts: UIMessagePart[];
}

/**
 * Converts Convex agent tool parts to Tool component format
 */
export const ToolDisplay: React.FC<ToolDisplayProps> = ({ parts }) => {
  // Filter out text parts as they are displayed separately
  const toolParts = parts.filter((p) => p.type !== "text");

  return (
    <div className="space-y-2">
      {toolParts.map((part, index) => {
        // Handle reasoning parts
        if (part.type === "reasoning") {
          return (
            <Tool key={index}>
              <ToolHeader type="reasoning" state="output-available" />
              <ToolContent>
                <div className="text-sm text-muted-foreground">
                  {/* @ts-expect-error - reasoning type exists in Convex agent */}
                  {part.reasoning}
                </div>
              </ToolContent>
            </Tool>
          );
        }

        // Handle tool calls (format: "tool-{toolName}")
        if (part.type.startsWith("tool-")) {
          const toolName = part.type.replace("tool-", "");
          // @ts-expect-error - dynamic tool properties
          const input = part.input || part.args || {};
          // @ts-expect-error - dynamic tool properties
          const rawOutput = part.output || part.result;
          // @ts-expect-error - dynamic tool properties
          const errorText = part.error;

          // Determine tool state
          let state: ToolState = "output-available";
          if (errorText) {
            state = "output-error";
          } else if (!rawOutput) {
            state = "input-available";
          }

          return (
            <Tool key={index}>
              <ToolHeader type={toolName} state={state} />
              <ToolContent>
                {Object.keys(input).length > 0 && <ToolInput input={input} />}
                
                {toolName === "find_relevant_context" ? (
                  <ToolOutput
                    output={
                      <FindRelevantContextOutput
                        output={rawOutput}
                        input={input}
                      />
                    }
                    errorText={errorText}
                  />
                ) : (
                  <ToolOutput
                    output={
                      rawOutput ? (
                        typeof rawOutput === "string" ? (
                          rawOutput
                        ) : (
                          <pre className="overflow-auto text-xs">
                            <code>{JSON.stringify(rawOutput, null, 2)}</code>
                          </pre>
                        )
                      ) : undefined
                    }
                    errorText={errorText}
                  />
                )}
              </ToolContent>
            </Tool>
          );
        }

        return null;
      })}
    </div>
  );
};

/**
 * Custom output renderer for find_relevant_context tool
 */
const FindRelevantContextOutput: React.FC<{
  output: unknown;
  input: Record<string, unknown>;
}> = ({ output, input }) => {
  // Parse the output if it's a JSON string
  let parsedOutput;
  try {
    parsedOutput =
      typeof output === "string" ? JSON.parse(output) : output;
  } catch {
    parsedOutput = output;
  }

  const query = input.query || input.library || "Unknown query";
  const library = input.library || "";

  // Handle text response format
  if (parsedOutput && typeof parsedOutput === "object" && "type" in parsedOutput && parsedOutput.type === "text") {
    const isError =
      typeof parsedOutput.text === "string" &&
      (parsedOutput.text.includes("does not exist") ||
        parsedOutput.text.includes("error"));

    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Query
          </div>
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {String(query)}
          </div>
        </div>
        {library && (
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Library
            </div>
            <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              {String(library)}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Result
          </div>
          <div
            className={`rounded-lg border p-3 ${
              isError
                ? "border-destructive/20 bg-destructive/5 text-destructive"
                : "border-primary/20 bg-primary/5 text-primary"
            }`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {String(parsedOutput.text)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle array results (legacy format)
  if (Array.isArray(parsedOutput)) {
    if (parsedOutput.length === 0) {
      return (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            The search returned no results.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Found {parsedOutput.length} sources
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {parsedOutput.map((result: { url: string; title?: string; description?: string; og?: string }, i: number) => {
            try {
              const domain = new URL(result.url).hostname.replace("www.", "");
              return (
                <a
                  key={i}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full w-64 flex-shrink-0 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center">
                    <Image
                      alt={`${domain} favicon`}
                      className="mr-2 h-4 w-4 rounded"
                      src={
                        result.og ||
                        `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
                      }
                      width={16}
                      height={16}
                      unoptimized
                    />
                    <span className="flex-1 truncate text-xs font-medium text-muted-foreground">
                      {domain}
                    </span>
                  </div>
                  <p className="line-clamp-4 text-sm leading-relaxed text-card-foreground">
                    {result.description || result.title}
                  </p>
                </a>
              );
            } catch {
              return null;
            }
          })}
        </div>
      </div>
    );
  }

  // Fallback for unknown format
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Query
        </div>
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {String(query)}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Response
        </div>
        <div className="rounded-lg bg-muted p-3">
          <pre className="overflow-auto text-xs">
            <code>
              {typeof parsedOutput === "string"
                ? parsedOutput
                : JSON.stringify(parsedOutput, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
