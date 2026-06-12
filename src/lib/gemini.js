import { GoogleGenAI } from "@google/genai";

const originalGenAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const originalGenerateContent = originalGenAI.models.generateContent.bind(
  originalGenAI.models,
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fallback chain of capable Gemini models to route requests to when overloaded
const MODEL_FALLBACK_CHAIN = [
  "gemini-3.1-pro-preview",
  "gemini-3.1-pro",
  "gemini-2.5-pro",
  "gemini-1.5-pro",
  "gemini-3.5-flash",
  "gemini-1.5-flash",
];

const generateContentWithRetry = async (options) => {
  const requestedModel = options.model || GEMINI_MODEL;
  let startIndex = MODEL_FALLBACK_CHAIN.indexOf(requestedModel);
  if (startIndex === -1) {
    MODEL_FALLBACK_CHAIN.unshift(requestedModel);
    startIndex = 0;
  }

  let initialError = null;

  for (let i = startIndex; i < MODEL_FALLBACK_CHAIN.length; i++) {
    const currentModel = MODEL_FALLBACK_CHAIN[i];
    const currentOptions = { ...options, model: currentModel };

    let attempts = 0;
    const maxAttempts = 2; // Try twice per model tier
    let delay = 1000;

    while (attempts < maxAttempts) {
      try {
        if (i > startIndex) {
          console.warn(
            `[Gemini API] Primary model failed or overloaded. Falling back to: ${currentModel}`,
          );
        }
        return await originalGenerateContent(currentOptions);
      } catch (error) {
        attempts++;
        if (!initialError) {
          initialError = error;
        }

        const status = error.status || error.statusCode;

        const isQuotaOrUnavailable =
          status === 429 ||
          status === 503 ||
          status === 504 ||
          error.message?.toLowerCase().includes("quota") ||
          error.message?.toLowerCase().includes("rate limit") ||
          error.message?.toLowerCase().includes("demand") ||
          error.message?.toLowerCase().includes("unavailable") ||
          error.message?.toLowerCase().includes("503") ||
          error.message?.toLowerCase().includes("429");

        const isModelNotFound =
          status === 404 ||
          status === 400 ||
          error.message?.toLowerCase().includes("not found") ||
          error.message?.toLowerCase().includes("invalid model") ||
          error.message?.toLowerCase().includes("unsupported model");

        if (isQuotaOrUnavailable) {
          if (attempts < maxAttempts) {
            console.warn(
              `[Gemini API] Model ${currentModel} overloaded (attempt ${attempts}/${maxAttempts}). Retrying in ${delay}ms...`,
            );
            await sleep(delay);
            delay *= 2;
          } else {
            if (i < MODEL_FALLBACK_CHAIN.length - 1) {
              console.warn(
                `[Gemini API] Model ${currentModel} exhausted. Switching to next fallback model...`,
              );
              break; // breaks out of the inner while loop to move to the next model
            } else {
              throw error;
            }
          }
        } else if (isModelNotFound) {
          // If the model is not found/supported in this environment, skip immediately without waiting
          if (i < MODEL_FALLBACK_CHAIN.length - 1) {
            console.warn(
              `[Gemini API] Model ${currentModel} unsupported (400/404). Skipping to next fallback...`,
            );
            break;
          } else {
            throw error;
          }
        } else {
          // Critical parameter/key errors should fail fast
          throw error;
        }
      }
    }
  }
};

originalGenAI.models.generateContent = generateContentWithRetry;

export const ai = originalGenAI;

export const GEMINI_MODEL = "gemini-3.1-pro-preview";

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

    // Find the first '{'
    const start = text.indexOf("{");
    if (start === -1) {
      throw error;
    }

    // Try finding all closing braces '}' from the end backwards to isolate the outer JSON block
    let end = text.lastIndexOf("}");
    while (end > start) {
      const jsonCandidate = text.substring(start, end + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (nestedError) {
        // Look for the next closing brace further to the left
        end = text.lastIndexOf("}", end - 1);
      }
    }
    throw error;
  }
}
