import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { ai } from "@/lib/gemini";
import Resume from "@/models/Resume";
import mammoth from "mammoth";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { resumeId, jobDescription } = await request.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { error: "Resume ID and Job Description are required." },
        { status: 400 }
      );
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure we have parsed text. If not, parse it dynamically
    let parsedText = resume.parsedText;
    if (!parsedText) {
      const fileResponse = await fetch(resume.fileUrl);
      if (fileResponse.ok) {
        const arrayBuffer = await fileResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const isPdf = resume.fileType.includes("pdf") || resume.fileName.toLowerCase().endsWith(".pdf");
        if (isPdf) {
          const base64Pdf = buffer.toString("base64");
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64Pdf,
                },
              },
              {
                text: "Extract and return only the full, clean, and accurate text content of this resume. Maintain layout ordering and logical reading flow. Do not output anything other than the text content.",
              },
            ],
          });
          parsedText = response.text || "";
        } else {
          const result = await mammoth.extractRawText({ buffer });
          parsedText = result.value;
        }
        resume.parsedText = parsedText;
        await resume.save();
      }
    }

    if (!parsedText) {
      return NextResponse.json(
        { error: "Could not parse text from this resume for comparison." },
        { status: 422 }
      );
    }

    // Call Gemini for comparison
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `
            Compare this resume text against the job description to calculate job alignment.

            Resume text:
            ---
            ${parsedText}
            ---

            Job Description:
            ---
            ${jobDescription}
            ---

            Return ONLY valid JSON matching this schema:
            {
              "score": number,
              "missingKeywords": ["..."],
              "matchingKeywords": ["..."],
              "recommendations": ["..."]
            }

            Rules:
            - score must be an integer between 0 and 100 representing match rate.
            - missingKeywords: 3 to 6 critical skills or terms in the job description missing from the resume.
            - matchingKeywords: 3 to 6 positive matches found in both.
            - recommendations: 3 to 5 clear action items for updating the resume to match the description.
            - No markdown, no surrounding text, return raw JSON string.
          `,
        },
      ],
    });

    const text = response.text;
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Job Match Gemini Response:", cleanText);
    const parsedMatch = JSON.parse(cleanText);

    return NextResponse.json({
      success: true,
      match: parsedMatch,
    });
  } catch (error) {
    console.error("Job Match Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
