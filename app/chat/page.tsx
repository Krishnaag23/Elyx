"use client";

import { useState, useEffect, useMemo } from "react";
import { JourneyEvent } from "@/lib/types";
import { ChatFilterSidebar } from "../components/chat/chatFilterSidebar";
import { ChatMessageStream } from "../components/chat/chatMessageStream";
import { ChatInsightPanel } from "../components/chat/chatInsightPanel";

export default function ChatExplorerPage() {
  const [allMessages, setAllMessages] = useState<JourneyEvent[]>([]);
  const [filters, setFilters] = useState({ query: "", sender: "", role: "" });
  const [selectedMessage, setSelectedMessage] = useState<JourneyEvent | null>(
    null
  );
  const [traceContext, setTraceContext] = useState<any[] | null>(null);
  const [isLoadingTrace, setIsLoadingTrace] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/journey_log.json");
      const data: JourneyEvent[] = await response.json();
      const enrichedData = data.map((msg) => ({
        ...msg,
        _dt: new Date(msg.timeStamp),
      }));
      setAllMessages(enrichedData);
    };
    fetchData();
  }, []);

  const filteredMessages = useMemo(() => {
    return allMessages
      .filter((m) => {
        const messageText =
          `${m.message} ${m.sender} ${m.senderRole}`.toLowerCase();
        const qOk =
          !filters.query || messageText.includes(filters.query.toLowerCase());
        const senderOk = !filters.sender || m.sender === filters.sender;
        const roleOk = !filters.role || m.senderRole === filters.role;
        return qOk && senderOk && roleOk;
      })
      .sort((a, b) => a._dt!.getTime() - b._dt!.getTime());
  }, [allMessages, filters]);

  const handleRequestTrace = async (message: JourneyEvent) => {
    if (!message) return;
    setSelectedMessage(message);
    setIsLoadingTrace(true);
    setTraceContext(null);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `What was the context and rationale for this message: "${message.message}"`,
      }),
    });
    const data = await response.json();

    setTraceContext([{ sender: data.persona, message: data.response }]);
    setIsLoadingTrace(false);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      <ChatFilterSidebar
        allMessages={allMessages}
        filters={filters}
        onFilterChange={setFilters}
        statsData={filteredMessages}
      />
      <div className="flex-1 overflow-y-auto">
        <ChatMessageStream
          messages={filteredMessages}
          onSelectMessage={setSelectedMessage}
          onRequestTrace={handleRequestTrace}
        />
      </div>
      {/* --- MODIFICATION HERE --- */}
      <ChatInsightPanel
        selectedMessage={selectedMessage}
        traceContext={traceContext}
        isLoading={isLoadingTrace}
        filteredMessages={filteredMessages} 
      />
    </div>
  );
}
