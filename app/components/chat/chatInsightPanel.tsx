import { JourneyEvent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  selectedMessage: JourneyEvent | null;
  traceContext: any[] | null;
  isLoading: boolean;
}

export function ChatInsightPanel({ selectedMessage, traceContext, isLoading }: Props) {
  return (
    <aside className="hidden w-96 flex-col border-l p-4 space-y-4 xl:flex">
      <Card>
        <CardHeader><CardTitle>Selected Message</CardTitle></CardHeader>
        <CardContent>
          {selectedMessage ? (
            <div>
              <p><strong>From:</strong> {selectedMessage.sender} ({selectedMessage.senderRole})</p>
              <p><strong>Time:</strong> {selectedMessage._dt?.toLocaleString()}</p>
              <p className="mt-2 p-2 bg-muted rounded-md">{selectedMessage.message}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Select a message to see details.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>AI Decision Trace</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          ) : traceContext ? (
            <div className="text-sm space-y-2">
              {traceContext.map((ctx, i) => (
                <div key={i}>
                  <p className="font-bold">{ctx.sender}:</p>
                  <p>{ctx.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Click "Why this?" on a message to generate a trace.</p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}