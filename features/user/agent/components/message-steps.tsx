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
              <p className="text-gray-600">{part.reasoning}</p>
            </Step>
          );
        }
        if (part.type === "tool-invocation") {
          const title = `Call to ${part.toolInvocation.toolName}`;
          switch (part.toolInvocation.toolName) {
            case "find_relevant_context": {
              const toolResults = (
                part.toolInvocation as {
                  result: {
                    content: string;
                    description: string;
                    og: string;
                    title: string;
                    url: string;
                  }[];
                }
              ).result;
              if (!Array.isArray(toolResults) || toolResults.length === 0) {
                return (
                  <Step
                    isLast={isLast}
                    key={index.toString()}
                    title="No resources found"
                  >
                    <div className="text-gray-500">
                      The search returned no results.
                    </div>
                  </Step>
                );
              }
              return (
                <React.Fragment key={index.toString()}>
                  <Step isLast={false} title={"Searched"}>
                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-100 p-2 text-gray-700">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        <code>
                          {JSON.stringify(part.toolInvocation.args, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </Step>
                  <Step
                    isLast={isLast}
                    title={`Synthesized ${toolResults.length} sources`}
                  >
                    <div className="-m-2 flex space-x-4 overflow-x-auto p-1">
                      {toolResults.map((result, i) => {
                        try {
                          const domain = new URL(result.url).hostname.replace(
                            "www.",
                            "",
                          );
                          return (
                            <a
                              className="block w-60 flex-shrink-0 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-gray-300 hover:shadow-sm"
                              href={result.url}
                              key={i.toString()}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <div className="mb-2 flex items-center">
                                <img
                                  alt={`${domain} favicon`}
                                  className="mr-2 h-4 w-4 rounded"
                                  src={
                                    result.og ||
                                    `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
                                  }
                                />
                                <span className="flex-1 truncate text-gray-500 text-xs">
                                  {domain}
                                </span>
                                <svg
                                  className="ml-2 text-gray-400"
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
                              <p className="line-clamp-4 text-gray-700 text-sm">
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
            default:
              return (
                <Step isLast={isLast} key={index.toString()} title={title}>
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-100 p-2 text-gray-700">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      <code>
                        {JSON.stringify(part.toolInvocation.args, null, 2)}
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
