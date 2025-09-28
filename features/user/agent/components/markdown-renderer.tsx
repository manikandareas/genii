import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { buttonVariants } from "@/features/shared/components/ui/button";
import { cn } from "@/lib/utils";

// Define a generic type for ReactMarkdown components
type MarkdownComponentProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>;

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * A reusable Markdown renderer component with math and code highlighting support
 */
export const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, []);

  const handleCopy = useCallback((code: string, index: number) => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    const writeToClipboard = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          const fallback = document.createElement("textarea");
          fallback.value = code;
          fallback.setAttribute("readonly", "");
          fallback.style.position = "absolute";
          fallback.style.left = "-9999px";
          document.body.append(fallback);
          fallback.select();
          document.execCommand("copy");
          fallback.remove();
        }
        setCopiedBlock(index);
        resetTimeoutRef.current = setTimeout(() => {
          setCopiedBlock(null);
          resetTimeoutRef.current = null;
        }, 2000);
      } catch {
        setCopiedBlock(null);
      }
    };

    writeToClipboard().catch(() => {
      setCopiedBlock(null);
    });
  }, []);

  let blockCounter = -1;

  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none text-muted-foreground",
        "prose-code:text-muted-foreground prose-em:text-muted-foreground prose-strong:text-muted-foreground",
        "prose-hr:border-border prose-pre:bg-transparent prose-headings:text-muted-foreground",
        "prose-th:font-medium prose-td:text-muted-foreground prose-th:text-muted-foreground",
        "dark:prose-invert",
        className,
      )}
    >
      <ReactMarkdown
        components={{
          // Code block styling
          code({
            inline,
            className,
            children,
            ...props
          }: MarkdownComponentProps) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeContent = String(children).replace(/\n$/, "");
            const blockIndex = ++blockCounter;
            const isCopied = copiedBlock === blockIndex;

            if (!inline && language) {
              return (
                <div className="relative my-6 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm">
                  <div className="flex items-center justify-between border-border/60 border-b bg-muted px-4 py-2 font-mono text-muted-foreground text-xs uppercase tracking-[0.18em]">
                    <span>{language}</span>
                    <button
                      aria-label={isCopied ? "Code copied" : "Copy code"}
                      className="rounded-md border border-border/60 bg-background/80 px-2 py-1 font-medium text-[0.7rem] text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      onClick={() => handleCopy(codeContent, blockIndex)}
                      type="button"
                    >
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    customStyle={{
                      margin: 0,
                      borderRadius: "0 0 0.75rem 0.75rem",
                      background: "transparent",
                      padding: "1.5rem",
                      fontSize: "0.9rem",
                      lineHeight: "1.65",
                    }}
                    language={language}
                    lineNumberStyle={{
                      minWidth: "2.5rem",
                      paddingRight: "0.75rem",
                      color: "var(--muted-foreground)",
                    }}
                    showLineNumbers
                    style={dark}
                    wrapLines
                    {...props}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                </div>
              );
            }
            if (inline) {
              return (
                <code
                  className="rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-muted-foreground text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="my-6 overflow-x-auto rounded-xl border border-border/50 bg-muted p-6 text-sm shadow-sm">
                <code
                  className="block font-mono text-muted-foreground leading-7"
                  {...props}
                >
                  {children}
                </code>
              </pre>
            );
          },

          // Table styling
          table({ children, ...props }: MarkdownComponentProps) {
            return (
              <div className="my-8 overflow-x-auto rounded-xl border border-border/50 bg-muted shadow-sm">
                <table className="w-full border-collapse" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: MarkdownComponentProps) {
            return (
              <th
                className="border-border/60 border-b bg-muted px-5 py-3 text-left font-medium text-muted-foreground text-sm"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }: MarkdownComponentProps) {
            return (
              <td
                className="border-border/40 border-b px-5 py-3 text-muted-foreground text-sm"
                {...props}
              >
                {children}
              </td>
            );
          },
          hr({ ...props }: MarkdownComponentProps) {
            return <hr className="my-12 border-border/60" {...props} />;
          },

          // List styling
          ul({ children, ...props }: MarkdownComponentProps) {
            return (
              <ul
                className="list-disc space-y-2 pl-6 marker:text-primary/70"
                {...props}
              >
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: MarkdownComponentProps) {
            return (
              <ol
                className="list-decimal space-y-2 pl-6 marker:font-medium marker:text-primary/70"
                {...props}
              >
                {children}
              </ol>
            );
          },
          li({ children, ...props }: MarkdownComponentProps) {
            return (
              <li className="pl-2 leading-7" {...props}>
                {children}
              </li>
            );
          },

          // Heading styling
          h1({ children, ...props }: MarkdownComponentProps) {
            return (
              <h1
                className="mt-10 mb-6 font-semibold text-3xl text-muted-foreground tracking-tight"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: MarkdownComponentProps) {
            return (
              <h2
                className="mt-8 mb-5 font-semibold text-2xl text-muted-foreground tracking-tight"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: MarkdownComponentProps) {
            return (
              <h3
                className="mt-7 mb-4 font-semibold text-muted-foreground text-xl tracking-tight"
                {...props}
              >
                {children}
              </h3>
            );
          },

          // Paragraph styling
          p({ children, ...props }: MarkdownComponentProps) {
            // To avoid hydration errors with nested divs in paragraphs
            return (
              <div
                className="paragraph mb-5 text-base text-muted-foreground leading-7"
                {...props}
              >
                {children}
              </div>
            );
          },

          // Blockquote styling
          blockquote({ children, ...props }: MarkdownComponentProps) {
            return (
              <blockquote
                className="my-6 rounded-xl border-primary/30 border-l-4 bg-primary/5 px-6 py-4 text-muted-foreground italic shadow-sm"
                {...props}
              >
                {children}
              </blockquote>
            );
          },

          a({
            children,
            href,
            ...props
          }: MarkdownComponentProps & { href?: string }) {
            const isExternal = href && /^https?:\/\//.test(href);
            return (
              <a
                className={buttonVariants({
                  variant: "link",
                  className:
                    "inline-flex items-center gap-1 font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary/80",
                })}
                href={href}
                rel={isExternal ? "noopener noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
                {...props}
              >
                {children}
                {isExternal && (
                  <svg
                    aria-label="(opens in a new tab)"
                    className="ml-1 inline-block h-4 w-4 text-primary/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <title>Open in new tab</title>
                    <path
                      d="M17 7V17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10m-1-4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </a>
            );
          },
        }}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              throwOnError: false,
              strict: false,
              output: "html",
              displayMode: false,
            },
          ],
        ]}
        remarkPlugins={[remarkGfm, remarkMath]}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
