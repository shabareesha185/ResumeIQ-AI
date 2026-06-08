import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db/mongodb";
import CoverLetter from "@/models/CoverLetter";
import CoverLetterHistory from "@/components/cover-letter/CoverLetterHistory";
import { Button } from "@/components/ui/button";
import { FileSignature, History, Plus } from "lucide-react";

export const metadata = {
  title: "Cover Letter History | ResumeIQ",
  description: "View and manage all your AI-generated cover letters on ResumeIQ.",
};

export default async function CoverLetterHistoryPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const coverLetters = await CoverLetter.find({ userId: session.user.id })
    .select("_id title company jobTitle createdAt")
    .sort({ createdAt: -1 });

  return (
    <div className="mx-auto max-w-6xl relative space-y-8">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent leading-tight flex items-center gap-2.5">
            <History className="h-9 w-9 text-indigo-400" />
            Cover Letter History
          </h1>
          <p className="mt-2 text-zinc-400">
            View, download, or delete previously generated cover letters.
          </p>
        </div>

        <Link href="/cover-letter">
          <Button className="bg-white hover:bg-zinc-200 text-black font-semibold h-10 px-4 rounded-lg transition gap-2">
            <Plus size={16} />
            Generate New
          </Button>
        </Link>
      </div>

      <CoverLetterHistory initialLetters={JSON.parse(JSON.stringify(coverLetters))} />
    </div>
  );
}
