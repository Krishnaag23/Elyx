// app/components/chat/ChatMessageStream.tsx
import { JourneyEvent } from '@/lib/types';
import { ChatMessageBubble } from './chatMessageBubble';

interface Props {
  messages: JourneyEvent[];
  onSelectMessage: (message: JourneyEvent) => void;
  onRequestTrace: (message: JourneyEvent) => void;
}

export function ChatMessageStream({ messages, onSelectMessage, onRequestTrace }: Props) {
  if (messages.length === 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">No messages match your filters.</div>;
  }
  return (
    <div className="p-4 space-y-4">
      {messages.map(message => (
        <ChatMessageBubble
          key={message.eventId}
          message={message}
          onSelect={() => onSelectMessage(message)}
          onTrace={() => onRequestTrace(message)}
        />
      ))}
    </div>
  );
}