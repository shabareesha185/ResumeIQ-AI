import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ai, GEMINI_MODEL, parseGeminiJson } from "@/lib/gemini";
import mammoth from "mammoth";

import Resume from "@/models/Resume";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Run Gemini ATS Analysis first (including OCR text parsing)
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
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
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
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = geminiResponse.text;
    const parsedAnalysis = parseGeminiJson(text);
    const parsedText = parsedAnalysis.parsedText || "";

    // 2. Upload file to Cloudinary only after analysis succeeds
    const base64File = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64File}`;
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      access_mode: "public",
      folder: "resumeiq/resumes",
      public_id: Date.now() + "-" + fileNameWithoutExtension,
    });

    // 3. Create the database entry with analysis results
    const resume = await Resume.create({
      userId: session.user.id,
      fileName: file.name,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: file.type,
      resourceType: uploadResult.resource_type || "auto",
      parsedText,
      atsScore: parsedAnalysis.score || 0,
      strengths: parsedAnalysis.strengths || [],
      weaknesses: parsedAnalysis.weaknesses || [],
      suggestions: parsedAnalysis.suggestions || [],
      analysisCompleted: true,
    });

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(error);
    let errorMessage = error.message || "Failed to upload and analyze resume";
    if (
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.toLowerCase().includes("429") ||
      error.status === "RESOURCE_EXHAUSTED"
    ) {
      errorMessage =
        "AI rate limit reached. Please wait a few seconds and try again.";
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
