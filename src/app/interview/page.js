import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";
import InterviewPrep from "@/components/interview/InterviewPrep";

export const metadata = {
  title: "Interview Prep - ResumeIQ AI",
  description: "Generate mock interview questions and practice responses using AI evaluation.",
};

export default async function InterviewPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const resumes = await Resume.find({
    userId: session.user.id,
  }).sort({
    createdAt: -1,
  });

  // Serialize Mongoose documents to plain JSON objects
  const serializedResumes = resumes.map((resume) => ({
    _id: resume._id.toString(),
    fileName: resume.fileName,
    atsScore: resume.atsScore || 0,
    parsedText: resume.parsedText || "",
    analysisCompleted: resume.analysisCompleted || false,
    createdAt: resume.createdAt ? resume.createdAt.toISOString() : null,
  }));

  return <InterviewPrep initialResumes={serializedResumes} />;
}
