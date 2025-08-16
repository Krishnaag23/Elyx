"use client";

import { useState } from "react";
import { ChatInput } from "../components/chat/chatInput";
import { ChatMessages } from "../components/chat/chatMessages";
import { CornerDownLeft } from "lucide-react";

// Define the structure for a single message in our chat state
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  persona?: string; // To store the name of the AI persona
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message to the state immediately for a responsive feel
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: userInput,
      role: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call our RAG backend API
      const response = await fetch('/api/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userInput }),
      });

      if (!response.ok) {
        throw new Error('API response was not ok.');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        role: 'assistant',
        persona: data.persona, // Store the persona from the API response
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Failed to get a response from the RAG API:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        role: 'assistant',
        persona: 'System',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-5rem)]">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3">
              <CornerDownLeft className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Ask about Rohan's Journey</h2>
            <p className="max-w-md text-muted-foreground">
              You can ask questions like "Why was Zone 2 cardio introduced?" or "What was the outcome of the 6-month check-in?". The relevant AI persona will answer.
            </p>
          </div>
        ) : (
          <ChatMessages messages={messages} isLoading={isLoading} />
        )}
      </div>
      <div className="border-t bg-background p-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}