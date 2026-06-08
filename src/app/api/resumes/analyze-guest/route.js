import { NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import mammoth from "mammoth";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Run Gemini ATS Analysis
    let geminiContents = [];
    if (file.type === "application/pdf") {
      geminiContents = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: buffer.toString("base64"),
          },
        },
        {
          text: `
            Analyze this resume for ATS compatibility.

            Return ONLY valid JSON.

            {
              "score": number,
              "strengths": ["..."],
              "weaknesses": ["..."],
              "suggestions": ["..."],
              "parsedText": "full accurate text content extracted from this resume, preserving logical flow, sections, and formatting details"
            }

            Rules:
            - Score between 0 and 100
            - 3 to 5 strengths
            - 3 to 5 weaknesses
            - 3 to 5 suggestions
            - parsedText: must contain the full parsed textual content of the resume.
            - No markdown
            - No explanation outside JSON
            `,
        },
      ];
    } else {
      let mammothText = "";
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer: buffer });
        mammothText = result.value;
      }

      geminiContents = [
        {
          text: `
            Analyze this resume text for ATS compatibility:

            ---
            ${mammothText}
            ---

            Return ONLY valid JSON.

            {
              "score": number,
              "strengths": ["..."],
              "weaknesses": ["..."],
              "suggestions": ["..."],
              "parsedText": "full clean text content of the resume"
            }

            Rules:
            - Score between 0 and 100
            - 3 to 5 strengths
            - 3 to 5 weaknesses
            - 3 to 5 suggestions
            - parsedText: return the cleaned up resume text.
            - No markdown
            - No explanation outside JSON
            `,
        },
      ];
    }

    const geminiResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: geminiContents,
    });

    const text = geminiResponse.text;
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Guest analyze route Gemini Response:", cleanText);
    const parsedAnalysis = JSON.parse(cleanText);

    return NextResponse.json({
      success: true,
      analysis: parsedAnalysis,
    });
  } catch (error) {
    console.error("Guest Analysis Error:", error);
    let errorMessage = error.message || "Failed to analyze resume";
    if (
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.toLowerCase().includes("429") ||
      error.status === "RESOURCE_EXHAUSTED"
    ) {
      errorMessage = "AI rate limit reached. Please wait a few seconds and try again.";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      {
        status: 500,
      },
    );
  }
}
