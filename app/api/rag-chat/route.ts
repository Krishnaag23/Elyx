import { NextResponse } from "next/server";
import { searchVectorStore } from "@/lib/rag/vectorStore";
import { generateGoogleChatResponse } from "@/lib/llm/google";
import { Document } from "@langchain/core/documents";

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

    const results: Document[] = await searchVectorStore(query, 5);

    let citationCounter = 1;
    const sourcesForResponse: { citation: number; eventId: string }[] = [];
    
    const contextWithCitations = results
      .map((doc) => {
        if (doc.metadata.source === "journey_log.json" && doc.metadata.eventId) {
          sourcesForResponse.push({
            citation: citationCounter,
            eventId: doc.metadata.eventId,
          });
          return `[Source ${citationCounter++}]: ${doc.pageContent}`;
        }
        return doc.pageContent;
      })
      .join("\n\n---\n\n");

    let personaName = "Neel";
    if (results.length > 0 && results[0].metadata.sender) {
      const topSender = results[0].metadata.sender as string;
      personaName = SENDER_TO_PERSONA_MAP[topSender] || "Neel";
    }
    console.log(`Citation Contexts: ${contextWithCitations}`)
    const prompt = `You are ${personaName}, an expert on Rohan's health journey. Your task is to answer the user's question based *only* on the provided context.
    
    **CRITICAL INSTRUCTION:** When you use information from a piece of context that starts with a [Source X] marker, you MUST cite it by placing the marker at the end of the sentence where the information was used. For example: "The member's ApoB dropped by 15% [Source 3]." Do NOT make up information. If the context does not provide an answer, say so. Important: DO THIS ONLY IF using context that starts with [Source X] marker where X is number. Do not do this with other tags!

    CONTEXT:
    ---
    ${contextWithCitations}
    ---
    
    USER QUESTION:
    ${query}
    
    ANSWER:`;

    const rawAnswer = await generateGoogleChatResponse(prompt);

    console.log(`Answer Generated from AI: ${rawAnswer}`);

    let finalAnswer = rawAnswer;
    const finalSources: { citation: number; eventId: string }[] = [];

    const citationRegex = /\[Source (\d+)\]/g;
    const usedCitations = new Map<number, number>();
    let newCitationCounter = 1;

    finalAnswer = rawAnswer.replace(citationRegex, (match, sourceNumStr) => {
      const sourceNum = parseInt(sourceNumStr, 10);
      const source = sourcesForResponse.find(s => s.citation === sourceNum);
      
      if (source) {
        let finalCitationNum;
        if (usedCitations.has(sourceNum)) {
          finalCitationNum = usedCitations.get(sourceNum)!;
        } else {
          finalCitationNum = newCitationCounter++;
          usedCitations.set(sourceNum, finalCitationNum);
          finalSources.push({ citation: finalCitationNum, eventId: source.eventId });
        }
        return `[${finalCitationNum}]`;
      }
      return ""; 
    });
    
    return NextResponse.json({
      response: finalAnswer,
      persona: personaName,
      sources: finalSources,
    });

  } catch (error) {
    console.error("RAG Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}