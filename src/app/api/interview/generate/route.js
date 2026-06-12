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

    const { resumeId, jobDescription, focusArea } = await request.json();

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    await connectDB();

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized access to resume" }, { status: 403 });
    }

    const parsedText = resume.parsedText;
    if (!parsedText) {
      return NextResponse.json({ error: "Resume text has not been parsed yet. Please run ATS analysis on this resume first." }, { status: 422 });
    }

    const prompt = `
      You are an expert technical and behavioral recruiter. Your task is to generate 5 tailored interview questions for this candidate based on their resume, the target job description (if provided), and the selected focus area.

      Focus Area: ${focusArea || "Mixed"} (Focus options: Behavioral, Technical, Resume-Specific, Mixed)

      Candidate Resume Text:
      ---
      ${parsedText}
      ---

      Target Job Description (Optional):
      ---
      ${jobDescription || "Not provided. Generate general questions matching the candidate's background."}
      ---

      Return ONLY a valid JSON object matching this schema:
      {
        "questions": [
          {
            "id": number,
            "question": "string",
            "type": "string", // e.g. "Behavioral", "Technical", "Resume-Specific"
            "rationale": "string", // Explanation of why this question is relevant to their specific background
            "suggestedAnswer": "string" // A model answer showcasing how they should frame their achievements from the resume
          }
        ]
      }

      Rules:
      - Limit to exactly 5 questions.
      - Ensure the questions probe specific projects, tools, databases, or work achievements mentioned in their resume text.
      - Suggested answers must be detailed and directly cite achievements/metrics from the candidate's resume where appropriate.
      - Do not include any markdown format (like \`\`\`json) or text explanations outside the JSON block.
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
    console.log("Generate Interview Questions response:", text);

    const parsed = parseGeminiJson(text);

    return NextResponse.json({
      success: true,
      questions: parsed.questions || [],
    });
  } catch (error) {
    console.error("Generate Interview Questions error:", error);
    let errorMessage = error.message || "Failed to generate interview questions";
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
