import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const GEMINI_MODEL = "gemini-3.5-flash";

export function parseGeminiJson(text) {
  if (!text) {
    throw new Error("Empty response from AI model.");
  }
  
  // Clean markdown formatting if present
  const clean = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
    
  try {
    return JSON.parse(clean);
  } catch (error) {
    console.error("Standard JSON.parse failed. Attempting cleanup...", error);
    
    // Find the first '{' and the last '}'
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    
    if (start !== -1 && end !== -1 && end > start) {
      const jsonCandidate = text.substring(start, end + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (nestedError) {
        console.error("Failed to parse extracted JSON block:", nestedError);
        throw nestedError;
      }
    }
    throw error;
  }
}
