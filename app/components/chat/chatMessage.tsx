import { Message } from "@/app/ai-chat/page";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
          <Bot className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-lg rounded-lg p-3 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {!isUser && (
          <p className="mb-1 font-bold text-xs text-muted-foreground">
            {message.persona || "Elyx Assistant"}
          </p>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {isUser && (
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
