import { Message } from "@/app/ai-chat/page";
import { MessageRender } from "./MessageRender";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function AIChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageRender key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-start gap-4">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback>
              <Loader2 className="h-5 w-5 animate-spin" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="font-bold">AI Co-pilot</p>
            <p className="text-sm text-muted-foreground italic">Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
}
