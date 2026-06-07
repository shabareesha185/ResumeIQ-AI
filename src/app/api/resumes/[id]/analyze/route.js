import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import { ai } from "@/lib/gemini";
import mammoth from "mammoth";

import Resume from "@/models/Resume";

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const resume = await Resume.findById(id);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume not found",
        },
        {
          status: 404,
        },
      );
    }

    if (resume.userId.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Download file from Cloudinary
    const fileResponse = await fetch(resume.fileUrl);

    if (!fileResponse.ok) {
      throw new Error("Failed to download resume");
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isPdf = resume.fileType.includes("pdf") || resume.fileName.toLowerCase().endsWith(".pdf");

    let geminiContents = [];
    if (isPdf) {
      const base64Pdf = buffer.toString("base64");
      geminiContents = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Pdf,
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
      let parsedText = resume.parsedText;
      if (!parsedText) {
        const result = await mammoth.extractRawText({ buffer });
        parsedText = result.value;
      }
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: geminiContents,
    });

    const text = response.text;

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Gemini Response:");
    console.log(cleanText);

    const parsed = JSON.parse(cleanText);

    resume.atsScore = parsed.score || 0;
    resume.strengths = parsed.strengths || [];
    resume.weaknesses = parsed.weaknesses || [];
    resume.suggestions = parsed.suggestions || [];
    resume.parsedText = parsed.parsedText || resume.parsedText;
    resume.analysisCompleted = true;

    await resume.save();

    return NextResponse.json({
      success: true,
      analysis: parsed,
    });
  } catch (error) {
    console.error("ATS Analysis Error:", error);

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
