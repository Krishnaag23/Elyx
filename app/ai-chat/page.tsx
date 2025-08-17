"use client";

import { useState } from "react";
import { ChatInput } from "../components/chat/chatInput";
import { AIChatMessages } from "../components/ai/aiChatMessages";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  persona?: string;
  sources?: { citation: number; eventId: string }[];
}

// ---  Suggested Prompts ---
const suggestedPrompts = [
  "Summarize the key outcomes of the journey.",
  "What were the main friction points and their resolutions?",
  "Explain the rationale for introducing Zone 2 cardio.",
  "How was the member's travel schedule accommodated?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return; // Prevent multiple sends

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: userInput,
      role: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/rag-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });
      if (!response.ok) throw new Error("API response was not ok.");
      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        role: "assistant",
        persona: data.persona,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get a response from the RAG API:", error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content:
          "Sorry, I'm having trouble connecting. Please try again later.",
        role: "assistant",
        persona: "System",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-5rem)]">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">AI Co-pilot</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Ask high-level questions about Rohan's journey. Start with a
              suggestion or type your own query below.
            </p>
            {/* --- NEW: Suggested Prompts Section --- */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {suggestedPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <AIChatMessages messages={messages} isLoading={isLoading} />
        )}
      </div>
      <div className="border-t bg-background p-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
