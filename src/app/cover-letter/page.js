import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import { Button } from "@/components/ui/button";
import { FileText, FileSignature, History, Plus } from "lucide-react";

export const metadata = {
  title: "Cover Letter Generator | ResumeIQ",
  description: "Generate tailored, ATS-friendly cover letters using your resume and job description.",
};

export default async function CoverLetterPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const resumes = await Resume.find({ userId: session.user.id })
    .select("_id fileName createdAt")
    .sort({ createdAt: -1 });

  return (
    <div className="mx-auto max-w-5xl relative space-y-8">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent leading-tight flex items-center gap-2.5">
            <FileSignature className="h-9 w-9 text-violet-500" />
            Cover Letter Generator
          </h1>
          <p className="mt-2 text-zinc-400">
            Write highly-tailored cover letters optimized for ATS scanners and employers.
          </p>
        </div>

        <Link href="/cover-letter/history">
          <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-10 px-4 rounded-lg transition gap-2">
            <History size={16} />
            View History
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="border border-dashed border-zinc-900 bg-zinc-950/20 backdrop-blur-sm rounded-xl p-12 text-center max-w-2xl mx-auto mt-8 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800">
            <FileText size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">No Resumes Found</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              You need to upload at least one resume to generate a customized, tailored cover letter.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/resumes">
              <Button className="bg-white hover:bg-zinc-200 text-black font-semibold h-10 px-5 rounded-lg transition gap-2">
                <Plus size={16} />
                Upload Resume
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <CoverLetterForm initialResumes={JSON.parse(JSON.stringify(resumes))} />
      )}
    </div>
  );
}
