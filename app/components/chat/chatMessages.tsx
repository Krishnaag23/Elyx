import { Message } from "@/app/ai-chat/page"; 
import { ChatMessage } from "./chatMessage";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div className="text-sm">Thinking...</div>
        </div>
      )}
    </div>
  );
}