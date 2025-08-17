import { JourneyEvent } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  selectedMessage: JourneyEvent | null;
  traceContext: any[] | null;
  isLoading: boolean;
  filteredMessages: JourneyEvent[];
}

const SummaryView = ({ messages }: { messages: JourneyEvent[] }) => {
  const memberMessages = messages.filter(
    (m) => m.senderRole === "Member"
  ).length;
  const teamMessages = messages.length - memberMessages;
  const firstMessageDate = messages[0]?._dt?.toLocaleDateString();
  const lastMessageDate =
    messages[messages.length - 1]?._dt?.toLocaleDateString();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filtered View Summary</CardTitle>
          <CardDescription>
            Insights from the current selection.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Total Messages</span>{" "}
            <span className="font-semibold">{messages.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Member Messages</span>{" "}
            <span className="font-semibold">{memberMessages}</span>
          </div>
          <div className="flex justify-between">
            <span>Team Messages</span>{" "}
            <span className="font-semibold">{teamMessages}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {messages.length > 0 ? (
            <p>
              Showing messages from <br />{" "}
              <span className="font-semibold">{firstMessageDate}</span> to{" "}
              <span className="font-semibold">{lastMessageDate}</span>.
            </p>
          ) : (
            <p>No messages in view.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const TraceView = ({ selectedMessage, traceContext, isLoading }: Props) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Selected Message</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMessage ? (
            <div className="text-sm space-y-2">
              <p>
                <strong>From:</strong> {selectedMessage.sender} (
                {selectedMessage.senderRole})
              </p>
              <p>
                <strong>Time:</strong> {selectedMessage._dt?.toLocaleString()}
              </p>
              <blockquote className="mt-2 p-2 bg-muted rounded-md border-l-2 pl-3">
                {selectedMessage.message}
              </blockquote>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Decision Trace</CardTitle>
        </CardHeader>
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
                  <p className="font-bold text-primary">{ctx.sender}:</p>
                  <p>{ctx.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Click "Why this?" on a message to generate a trace.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export function ChatInsightPanel(props: Props) {
  return (
    <aside className="hidden w-96 flex-col border-l bg-muted/20 p-4 space-y-4 xl:flex">
      {props.selectedMessage ? (
        <TraceView {...props} />
      ) : (
        <SummaryView messages={props.filteredMessages} />
      )}
    </aside>
  );
}
