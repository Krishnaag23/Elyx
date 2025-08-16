// app/journey/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { JourneyEvent } from '@/lib/types';
import { JourneyTimeline } from '../components/journey/journeyTimeline';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';

export default function JourneyPage() {
  const [messages, setMessages] = useState<JourneyEvent[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<JourneyEvent | null>(null);
  const [traceContext, setTraceContext] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/journey_log.json');
      const data = await response.json();
      setMessages(data);
    };
    fetchData();
  }, []);

  const handleSelectItem = async (eventId: string) => {
    const message = messages.find(m => m.eventId === eventId);
    if (!message) return;
    
    setSelectedMessage(message);
    setIsLoading(true);

    // Call our AI backend to get the context!
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `In one paragraph, what was the context and rationale for this message: "${message.message}"` }),
    });
    const data = await response.json();
    setTraceContext(data.response);
    setIsLoading(false);
  };

  return (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Interactive Journey Timeline</h1>
        <p className="text-muted-foreground">
          Zoom, pan, and click on events to explore the full conversation history.
        </p>
      </div>
      
      {messages.length > 0 ? (
        <JourneyTimeline messages={messages} onSelectItem={handleSelectItem} />
      ) : (
        <Skeleton className="w-full h-[calc(100vh-10rem)]" />
      )}

      <Dialog open={!!selectedMessage} onOpenChange={(isOpen) => !isOpen && setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decision Trace & Context</DialogTitle>
            <DialogDescription>
              AI-generated summary of what led to this event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Original Message:</h4>
              <p className="p-2 mt-1 text-sm bg-muted rounded-md">"{selectedMessage?.message}"</p>
            </div>
            <div>
              <h4 className="font-semibold">AI Context Summary:</h4>
              {isLoading ? (
                <div className="space-y-2 mt-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ) : (
                <p className="text-sm mt-1">{traceContext}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}