"use client";

import { Message } from "@/app/ai-chat/page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const ContentWithCitations = ({
  content,
  sources,
}: {
  content: string;
  sources?: { citation: number; eventId: string }[];
}) => {
  const contentRenderer = sources ? (
    <ReactMarkdown>{content}</ReactMarkdown>
  ) : (
    <p>{content}</p>
  );

  if (!sources || sources.length === 0) {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {contentRenderer}
      </div>
    );
  }

  const parts = content.split(/(\[\d+\])/g);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {parts.map((part, index) => {
        const citationMatch = part.match(/\[(\d+)\]/);
        if (citationMatch) {
          const citationNum = parseInt(citationMatch[1], 10);
          const source = sources.find((s) => s.citation === citationNum);
          if (source) {
            return (
              <Link key={index} href={`/chat?highlight=${source.eventId}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  {citationNum}
                </Badge>
              </Link>
            );
          }
        }
        return (
          <ReactMarkdown key={index} components={{ p: "span" }}>
            {part}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

export function MessageRender({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";

  const animationVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex items-start gap-4"
      variants={animationVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar */}
      <Avatar className="h-9 w-9 border">
        <AvatarFallback>
          {isAssistant ? (
            <Sparkles className="h-5 w-5 text-primary" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="flex-1 space-y-1">
        <p className="font-bold">
          {isAssistant ? message.persona || "AI Co-pilot" : "You"}
        </p>
        <div className="text-sm">
          {/* Use the citation-aware renderer for all messages */}
          <ContentWithCitations
            content={message.content}
            sources={message.sources}
          />
        </div>
      </div>
    </motion.div>
  );
}
