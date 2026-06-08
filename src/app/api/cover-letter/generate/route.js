import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";
import CoverLetter from "@/models/CoverLetter";
import { ai, GEMINI_MODEL } from "@/lib/gemini";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, jobTitle, company, jobDescription } = await request.json();

    if (!resumeId || !jobTitle || !company) {
      return NextResponse.json(
        { error: "Resume, Job Title, and Company are required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify resume exists and belongs to user
    const resume = await Resume.findOne({ _id: resumeId, userId: session.user.id });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const resumeText = resume.parsedText || "";

    // Generate Cover Letter using Gemini
    const prompt = `
      Write a professional, compelling, and tailored cover letter for a candidate applying for the role of ${jobTitle} at ${company}.

      Candidate's Resume Information:
      ---
      ${resumeText}
      ---

      Target Job Details:
      Job Title: ${jobTitle}
      Company: ${company}
      Job Description: ${jobDescription || "Not provided"}

      Formatting & Tone Rules:
      - Write in a professional, authentic, and persuasive tone.
      - Align the candidate's achievements and skills with the job requirements.
      - Return ONLY the raw cover letter text.
      - Use standard business letter format (Candidate Info placeholder, Date placeholder, Employer Info placeholder, Salutation, Body, Sign-off).
      - Do NOT include any markdown formatting (like **, #, or bullet formatting syntax in text). Just plain text with standard double newlines separating paragraphs.
      - Do NOT include comments or instructions to the user.
    `;

    const geminiResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ text: prompt }],
    });

    const letterContent = geminiResponse.text.trim();

    if (!letterContent) {
      throw new Error("Failed to generate content from AI model.");
    }

    // Save generated cover letter in database
    const coverLetter = await CoverLetter.create({
      userId: session.user.id,
      resumeId: resume._id,
      title: `${company} - ${jobTitle} Cover Letter`,
      content: letterContent,
      jobTitle,
      company,
      jobDescription,
    });

    return NextResponse.json({
      success: true,
      coverLetter,
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    let errorMessage = error.message || "Failed to generate cover letter";
    if (
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.toLowerCase().includes("429") ||
      error.status === "RESOURCE_EXHAUSTED"
    ) {
      errorMessage = "AI rate limit reached. Please wait a few seconds and try again.";
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
