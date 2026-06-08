import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import CoverLetter from "@/models/CoverLetter";
import CoverLetterDetails from "@/components/cover-letter/CoverLetterDetails";

export const metadata = {
  title: "Cover Letter Details | ResumeIQ",
  description: "View details of your generated cover letter on ResumeIQ.",
};

export default async function CoverLetterDetailPage({ params }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  await connectDB();
  const coverLetter = await CoverLetter.findById(id);

  if (!coverLetter) {
    notFound();
  }

  // Authorize check
  if (coverLetter.userId.toString() !== session.user.id) {
    redirect("/cover-letter/history");
  }

  return (
    <div className="relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <CoverLetterDetails coverLetter={JSON.parse(JSON.stringify(coverLetter))} />
    </div>
  );
}
