import { type UIMessage, useSmoothText } from "@convex-dev/agent/react";
import { Bot, User } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import { ToolDisplay } from "./tool-display";
import { useUser } from "@clerk/nextjs";

/**
 * Props for the Message component
 */
interface MessageProps extends UIMessage {
  className?: string;
}

/**
 * Message component that displays a chat message with proper styling based on the sender
 */
export const Message: React.FC<MessageProps> = (props) => {
  const { user } = useUser();
  // @ts-expect-error the content must be exist
  const { content, role, className, parts } = props;
  const textFromParts = useMemo(() => {
    if (!parts) return "";
    return parts
      .filter(
        // @ts-expect-error the type of part is not assignable to the type of UIMessagePart
        (part): part is { type: "text"; text?: string } => part.type === "text",
      )
      .map(
        (part) =>
          // @ts-expect-error the type of part is not assignable to the type of UIMessagePart
          part.text ?? "",
      )
      .filter((segment) => segment.trim().length > 0)
      .join("\n\n");
  }, [parts]);

  const baseContent = content ?? textFromParts;
  const [visibleText] = useSmoothText(baseContent ?? "");
  const isUser = role === "user";

  const hasSteps =
    !isUser && parts && parts.filter((p) => p.type !== "text").length > 0;

  return (
    <div className={cn("group relative mb-6 px-4", className)}>
      <div
        className={cn(
          "flex w-full max-w-4xl gap-3 md:gap-4",
          isUser
            ? "items-end justify-end text-right w-fit ml-auto"
            : "justify-start items-start",
        )}
      >
        {/* AI Avatar - only shown for AI messages */}
        {!isUser && (
          <Avatar className="mt-1 h-8 w-8 flex-shrink-0 bg-primary">
            <AvatarFallback className=" font-medium text-sm">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}

        {/* Message Content */}
        <div className={cn("min-w-0 flex-1", isUser ? "sm:max-w-[75%]" : "")}>
          <div
            className={cn(
              "relative w-full max-w-full overflow-hidden  text-left text-muted-foreground backdrop-blur-sm",
              isUser ? "ml-auto text-right" : "",
            )}
          >
            {/* Agent steps visualization */}
            {hasSteps && (
              <div className="p-4">
                <ToolDisplay parts={parts} />
              </div>
            )}

            {/* Final message text, only if there is content */}
            {visibleText && (
              <div
                className={cn(
                  "p-4 text-sm leading-relaxed",
                  isUser ? "text-right w-fit" : "",
                )}
              >
                <MarkdownRenderer content={visibleText} />
              </div>
            )}
          </div>
        </div>

        {/* User Avatar - only shown for user messages */}
        {isUser && (
          <Avatar className="mt-1 h-8 w-8 flex-shrink-0 bg-purple-500">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="font-medium text-sm text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
