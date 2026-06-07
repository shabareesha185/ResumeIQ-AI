import { NextResponse } from "next/server";
import { parsePdf } from "@/lib/parsePdf";
import { ai } from "@/lib/gemini";
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

    let parsedText = "";
    if (file.type === "application/pdf") {
      parsedText = await parsePdf(buffer);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: buffer });
      parsedText = result.value;
    }

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
              "suggestions": ["..."]
            }

            Rules:
            - Score between 0 and 100
            - 3 to 5 strengths
            - 3 to 5 weaknesses
            - 3 to 5 suggestions
            - No markdown
            - No explanation outside JSON
            `,
        },
      ];
    } else {
      geminiContents = [
        {
          text: `
            Analyze this resume text for ATS compatibility:

            ---
            ${parsedText}
            ---

            Return ONLY valid JSON.

            {
              "score": number,
              "strengths": ["..."],
              "weaknesses": ["..."],
              "suggestions": ["..."]
            }

            Rules:
            - Score between 0 and 100
            - 3 to 5 strengths
            - 3 to 5 weaknesses
            - 3 to 5 suggestions
            - No markdown
            - No explanation outside JSON
            `,
        },
      ];
    }

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
