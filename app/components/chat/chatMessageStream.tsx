import React from "react";
import { JourneyEvent } from "@/lib/types";
import { ChatMessageBubble } from "./chatMessageBubble";
import { Badge } from "@/components/ui/badge";

interface Props {
  messages: JourneyEvent[];
  onSelectMessage: (message: JourneyEvent) => void;
  onRequestTrace: (message: JourneyEvent) => void;
}

export function ChatMessageStream({
  messages,
  onSelectMessage,
  onRequestTrace,
}: Props) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No messages match your filters.
      </div>
    );
  }

  let lastDate: string | null = null;

  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => {
        // --- NEW LOGIC FOR DATE SEPARATORS ---
        const messageDate = message._dt!.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const showSeparator = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <React.Fragment key={message.eventId}>
            {showSeparator && (
              <div className="sticky top-0 z-10 flex justify-center py-2 backdrop-blur-sm">
                <Badge variant="secondary" className="shadow-sm">
                  {messageDate}
                </Badge>
              </div>
            )}
            <ChatMessageBubble
              message={message}
              onSelect={() => onSelectMessage(message)}
              onTrace={() => onRequestTrace(message)}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
