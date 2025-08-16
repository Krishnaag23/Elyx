import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

// Singleton instance for the embeddings model
let embeddingsInstance: GoogleGenerativeAIEmbeddings | null = null;
const genAI = new GoogleGenAI({ apiKey });

// Default embeddings model from Google
const DEFAULT_GEMINI_EMBED_MODEL =
  process.env.GEMINI_EMBED_MODEL || "text-embedding-004";

export const getEmbeddings = (): GoogleGenerativeAIEmbeddings => {
  if (!embeddingsInstance) {
    console.log(
      "Initializing Google Generative AI Embeddings for the first time..."
    );
    embeddingsInstance = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: DEFAULT_GEMINI_EMBED_MODEL,
    });
  }
  return embeddingsInstance;
};

export const generateGoogleChatResponse = async (
  prompt: string
): Promise<string> => {
  try {
    const contents = [{ role: "user", parts: [{ text: prompt }] }];


    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const text = result.text;

    if (!text) {
      console.error("Google AI API returned an empty text response.", result);
      throw new Error("The model returned an empty response.");
    }

    return text;
  } catch (error) {
    console.error("Error calling Google Gen AI SDK:", error);
    throw new Error("Failed to generate a response from the AI model.");
  }
};
