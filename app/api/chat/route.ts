import { NextResponse } from "next/server";
import { searchVectorStore } from "@/lib/rag/vectorStore";
import { createRagPrompt } from "@/lib/llm/prompts";
import { generateGoogleChatResponse } from "@/lib/llm/google";

const SENDER_TO_PERSONA_MAP: { [key: string]: string } = {
  Rohan: "System",
  Ruby: "Ruby",
  "Dr. Warren": "Dr. Warren",
  Advik: "Advik",
  Carla: "Carla",
  Rachel: "Rachel",
  Neel: "Neel",
  System: "System",
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const messageContentMatch = query.match(/"([^"]*)"/);
    const searchQuery = messageContentMatch ? messageContentMatch[1] : query;

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Could not parse message content from query" },
        { status: 400 }
      );
    }

    const results = await searchVectorStore(searchQuery, 3);

    const context = results.map((r) => r.pageContent).join("\n\n---\n\n");

    let personaName = "Neel";
    if (results.length > 0 && results[0].metadata.sender) {
      const topSender = results[0].metadata.sender as string;
      personaName = SENDER_TO_PERSONA_MAP[topSender] || "Neel";
    }

    const prompt = createRagPrompt(personaName, context, query);

    console.log(`Context Recieved: ${context}`);

    const answer = await generateGoogleChatResponse(prompt);

    console.log(`Answer: ${answer}`);

    return NextResponse.json({ response: answer, persona: personaName });
  } catch (error) {
    console.error("Trace Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
