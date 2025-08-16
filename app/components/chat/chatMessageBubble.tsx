import { JourneyEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface Props {
  message: JourneyEvent;
  onSelect: () => void;
  onTrace: () => void;
}

export function ChatMessageBubble({ message, onSelect, onTrace }: Props) {
  const isMember = message.senderRole === 'Member';
  return (
    <div className={cn("flex items-end gap-2", isMember && "justify-end")}>
      <div className={cn("flex flex-col rounded-lg p-3 max-w-lg", 
          isMember ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
        onClick={onSelect}
      >
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="font-bold text-sm">{message.sender}</span>
          <span className="text-xs opacity-70">{ new Date(message.timeStamp)?.toLocaleTimeString()}</span>
        </div>
        <p className="text-sm">{message.message}</p>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant={isMember ? "secondary" : "default"}>{message.senderRole}</Badge>
          <Button variant="ghost" size="sm" className="h-auto p-1" onClick={e => { e.stopPropagation(); onTrace(); }}>
            <Sparkles className="h-4 w-4 mr-1"/> Why this?
          </Button>
        </div>
      </div>
    </div>
  );
}