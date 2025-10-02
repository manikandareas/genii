import type { UIMessage } from "@convex-dev/agent/react";
import { Check } from "lucide-react";
import React from "react";

type UIMessagePart = UIMessage["parts"][number];

const Step = ({
  title,
  children,
  isLast,
}: {
  title: string;
  children: React.ReactNode;
  isLast: boolean;
}) => (
  <div className="flex gap-4">
    {/* Icon and vertical line */}
    <div className="flex flex-col items-center self-stretch">
      <div className="z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <Check className="h-4 w-4" />
      </div>
      {!isLast && <div className="w-px flex-grow bg-gray-300" />}
    </div>

    {/* Content */}
    <div className="w-full pt-0.5 pb-6">
      <h3 className="-mt-1 font-semibold text-gray-800 text-sm">{title}</h3>
      <div className="mt-2 text-gray-600 text-xs">{children}</div>
    </div>
  </div>
);

export const StepsContainer = ({ parts }: { parts: UIMessagePart[] }) => {
  // Filter out text parts, as they are part of the final message content.
  const steps = parts.filter((p) => p.type !== "text");

  return (
    <div className="relative">
      {steps.map((part, index) => {
        const isLast = index === steps.length - 1;
        if (part.type === "reasoning") {
          return (
            <Step isLast={isLast} key={index.toString()} title="Thinking">
              {/* @ts-expect-error the type of part is not assignable to the type of UIMessagePart */}
              <p className="text-gray-600">{part.reasoning}</p>
            </Step>
          );
        }
        // Handle new tool format from Convex Agent
        if (part.type.startsWith("tool-")) {
          const toolName = part.type.replace("tool-", "");

          switch (toolName) {
            case "find_relevant_context": {
              // @ts-expect-error the type of part is not assignable to the type of UIMessagePart
              const rawOutput = part.output || part.result;

              // Parse the output if it's a JSON string
              let parsedOutput;
              try {
                parsedOutput =
                  typeof rawOutput === "string"
                    ? JSON.parse(rawOutput)
                    : rawOutput;
              } catch {
                parsedOutput = rawOutput;
              }
              const inputData = part.input || part.args || {};
              const query =
                inputData.query || inputData.library || "Unknown query";
              const library = inputData.library || "";

              // Handle different response formats
              if (parsedOutput?.type === "text") {
                const searchTitle = library
                  ? `Searching ${library}`
                  : "Searching Documentation";
                const isError =
                  parsedOutput.text.includes("does not exist") ||
                  parsedOutput.text.includes("error");

                return (
                  <React.Fragment key={index.toString()}>
                    <Step isLast={false} title={searchTitle}>
                      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <dl className="grid gap-3 text-xs text-muted-foreground">
                          <div className="flex flex-wrap items-center gap-2">
                            <dt className="font-medium uppercase tracking-wide text-[11px] text-muted-foreground/70">
                              Query
                            </dt>
                            <dd className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                              {query}
                            </dd>
                          </div>
                          {library && (
                            <div className="flex flex-wrap items-center gap-2">
                              <dt className="font-medium uppercase tracking-wide text-[11px] text-muted-foreground/70">
                                Library
                              </dt>
                              <dd className="inline-flex items-center rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                                {library}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </Step>
                    <Step
                      isLast={isLast}
                      title={isError ? "Search Failed" : "Documentation Found"}
                    >
                      <div
                        className={`rounded-xl border p-4 shadow-sm ${
                          isError
                            ? "border-destructive/20 bg-destructive/5"
                            : "border-primary/20 bg-primary/5"
                        }`}
                      >
                        <div
                          className={`text-sm whitespace-pre-wrap leading-relaxed ${
                            isError ? "text-destructive" : "text-primary"
                          }`}
                        >
                          {parsedOutput.text}
                        </div>
                      </div>
                    </Step>
                  </React.Fragment>
                );
              }

              // Handle array results (legacy format)
              if (Array.isArray(parsedOutput)) {
                if (parsedOutput.length === 0) {
                  return (
                    <Step
                      isLast={isLast}
                      key={index.toString()}
                      title="No resources found"
                    >
                      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <p className="text-xs text-muted-foreground">
                          The search returned no results.
                        </p>
                      </div>
                    </Step>
                  );
                }

                return (
                  <React.Fragment key={index.toString()}>
                    <Step isLast={false} title={"Searched"}>
                      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Payload
                        </div>
                        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs text-foreground">
                          <code>{JSON.stringify(inputData, null, 2)}</code>
                        </pre>
                      </div>
                    </Step>
                    <Step
                      isLast={isLast}
                      title={`Synthesized ${parsedOutput.length} sources`}
                    >
                      <div className="-mx-3 flex gap-3 overflow-x-auto px-1 pb-1">
                        {parsedOutput.map((result, i) => {
                          try {
                            const domain = new URL(result.url).hostname.replace(
                              "www.",
                              "",
                            );
                            return (
                              <a
                                className="group block h-full w-64 flex-shrink-0 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
                                href={result.url}
                                key={i.toString()}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <div className="mb-3 flex items-center">
                                  <img
                                    alt={`${domain} favicon`}
                                    className="mr-2 h-4 w-4 rounded"
                                    src={
                                      result.og ||
                                      `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
                                    }
                                  />
                                  <span className="flex-1 truncate text-xs font-medium text-muted-foreground">
                                    {domain}
                                  </span>
                                  <svg
                                    className="ml-2 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground"
                                    fill="none"
                                    height="14"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="14"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <title>Open in new tab</title>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" x2="21" y1="14" y2="3" />
                                  </svg>
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
                    </Step>
                  </React.Fragment>
                );
              }

              // Fallback for unknown format
              return (
                <Step
                  isLast={isLast}
                  key={index.toString()}
                  title="Context Search"
                >
                  <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <dl className="grid gap-3 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-2">
                        <dt className="font-medium uppercase tracking-wide text-[11px] text-muted-foreground/70">
                          Query
                        </dt>
                        <dd className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                          {query}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-[11px] text-muted-foreground/70">
                          Response
                        </dt>
                        <dd className="mt-2 rounded-lg bg-muted p-3">
                          <pre className="text-xs text-foreground whitespace-pre-wrap">
                            {typeof parsedOutput === "string"
                              ? parsedOutput
                              : JSON.stringify(parsedOutput, null, 2)}
                          </pre>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Step>
              );
            }
            default:
              return (
                <Step isLast={isLast} key={index.toString()} title={title}>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-muted p-2 text-muted-foreground">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      <code>
                        {/* @ts-expect-error the type of part is not assignable to the type of UIMessagePart */}
                        {JSON.stringify(part.input || part.args || {}, null, 2)}
                      </code>
                    </pre>
                  </div>
                </Step>
              );
          }
        }

        return null;
      })}
    </div>
  );
};
