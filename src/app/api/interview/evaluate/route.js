import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { ai, GEMINI_MODEL, parseGeminiJson } from "@/lib/gemini";
import Resume from "@/models/Resume";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, question, userAnswer, jobDescription } = await request.json();

    if (!resumeId || !question || userAnswer === undefined) {
      return NextResponse.json({ error: "Resume ID, question, and user answer are required" }, { status: 400 });
    }

    await connectDB();

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized access to resume" }, { status: 403 });
    }

    const parsedText = resume.parsedText || "";

    const prompt = `
      You are an expert executive coach and mock interviewer. Critically evaluate the candidate's practice answer to the specified interview question. Compare their response against their resume achievements and the target job description (if provided).

      Interview Question:
      "${question}"

      Candidate's Practice Answer:
      "${userAnswer.trim() || "[No answer provided. Candidate requested a suggested response.]"}"

      Candidate's Resume achievements for reference:
      ---
      ${parsedText}
      ---

      Target Job Description (for context):
      ---
      ${jobDescription || "Not provided."}
      ---

      Return ONLY a valid JSON object matching this schema:
      {
        "score": number, // integer out of 100 representing answer quality
        "feedback": "string", // detailed constructive feedback on how to improve
        "strengths": ["string"], // 1 to 3 positive points in their response
        "gaps": ["string"], // 1 to 3 key areas of weakness or missing details (e.g. missing metrics, STAR structure)
        "improvedAnswer": "string" // A revised, stellar version of their response that integrates STAR methodology and leverages the candidate's resume achievements
      }

      Rules:
      - If the userAnswer is blank or extremely short (e.g., less than 3 words), give a score of 0, list "No answer provided" as a gap, and provide a full improved answer that they could use based on their resume.
      - Ensure the feedback is constructive, specific, and helps the candidate speak with confidence.
      - Do not include markdown code block syntax (\`\`\`json) or outer text.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    console.log("Evaluate Answer response:", text);

    const parsed = parseGeminiJson(text);

    return NextResponse.json({
      success: true,
      evaluation: parsed,
    });
  } catch (error) {
    console.error("Evaluate Answer error:", error);
    let errorMessage = error.message || "Failed to evaluate answer";
    if (
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.toLowerCase().includes("429") ||
      error.status === "RESOURCE_EXHAUSTED"
    ) {
      errorMessage = "AI rate limit reached. Please wait a few seconds and try again.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
