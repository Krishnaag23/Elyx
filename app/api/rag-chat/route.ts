// app/api/rag-chat/route.ts
import { NextResponse } from "next/server";
import { searchVectorStore } from "@/lib/rag/vectorStore";
import { createRagPrompt } from "@/lib/llm/prompts";
import { generateGoogleChatResponse } from "@/lib/llm/google";

// Map sender names to their persona keys in the prompts file
const SENDER_TO_PERSONA_MAP: { [key: string]: string } = {
  Rohan: "System", // Rohan doesn't answer himself
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

    const results = await searchVectorStore(query, 5);

    const context = results.map((r) => r.pageContent).join("\n\n");

    let personaName = "Neel"; // Default to the lead for a safe, strategic answer
    if (results.length > 0 && results[0].metadata.sender) {
      const topSender = results[0].metadata.sender as string;
      personaName = SENDER_TO_PERSONA_MAP[topSender] || "Neel";
    }
    console.log(`Recieved context from RAG: ${context} \n `);

    const prompt = createRagPrompt(personaName, context, query);

    console.log(`Created Prompt: ${prompt} \n`)

    const answer = await generateGoogleChatResponse(prompt);

    return NextResponse.json({ response: answer, persona: personaName });
  } catch (error) {
    console.error("RAG Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
