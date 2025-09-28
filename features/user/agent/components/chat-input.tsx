import { Loader2, SendHorizonal } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/features/shared/components/ui/button";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { useChat } from "../hooks/use-chat";

interface IChatInputProps {
  threadId: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<IChatInputProps> = ({
  threadId,
  disabled,
}) => {
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading } = useChat(threadId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMessage = message.trim();

    if (finalMessage) {
      try {
        await sendMessage(finalMessage);
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <form
        className="relative flex items-center gap-2"
        onSubmit={handleSubmit}
      >
        <Textarea
          className="max-h-[200px] min-h-[48px] flex-1 resize-none rounded-xl sm:min-h-[60px]"
          disabled={isLoading || disabled}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Tanyakan yang kamu inginkan..."}
          rows={1}
          value={message}
        />

        <Button
          disabled={!message.trim() || isLoading || disabled}
          size="icon"
          type="submit"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};
