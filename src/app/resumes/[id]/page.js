import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DeleteResumeButton from "@/components/resumes/DeleteResumeButton";
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default async function ResumeDetailsPage({ params }) {
  const { id } = await params;
  const session = await auth();

  await connectDB();

  const resume = await Resume.findById(id);

  if (!resume) {
    notFound();
  }

  if (resume.userId.toString() !== session.user.id) {
    notFound();
  }

  const isPdf = resume.fileType.includes("pdf");
  const score = resume.atsScore || 0;

  // Score categorization
  let scoreColorClass = "text-rose-400 border-rose-500/20 bg-rose-500/10";
  let scoreStatus = "Needs Optimization";
  let scoreDescription = "Your resume score is low. Consider running an AI analysis to find critical keyword gaps.";
  
  if (score >= 80) {
    scoreColorClass = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    scoreStatus = "Excellent ATS Match";
    scoreDescription = "Great job! Your resume is highly optimized for applicant tracking systems.";
  } else if (score >= 60) {
    scoreColorClass = "text-amber-400 border-amber-500/20 bg-amber-500/10";
    scoreStatus = "Good Match";
    scoreDescription = "Solid start. A few simple additions can push you to the high-ranking category.";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Navigation and Actions Row */}
      <div className="flex items-center justify-between">
        <Link 
          href="/resumes" 
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resumes
        </Link>
      </div>

      {/* Main Grid: Left PDF, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: PDF Viewer or Word Placeholder */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-[750px]">
          {isPdf ? (
            <Card className="flex-1 border-zinc-900 bg-zinc-950/40 backdrop-blur-sm overflow-hidden rounded-2xl p-2 h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-zinc-900/60 bg-zinc-950/80 rounded-t-xl">
                <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium truncate max-w-sm">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  <span className="truncate">{resume.fileName}</span>
                </div>
                <a 
                  href={resume.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
                  title="Open PDF in new tab"
                >
                  <ExternalLink className="h-3 w-3" />
                  Full Screen
                </a>
              </div>
              <iframe
                src={`${resume.fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full flex-1 rounded-b-xl bg-zinc-900 border-none h-full"
                title={`PDF preview of ${resume.fileName}`}
              />
            </Card>
          ) : (
            <Card className="flex-1 border-zinc-900 bg-zinc-950/40 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-10 text-center border-dashed border-2">
              <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                <FileText className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Word Preview Unavailable</h3>
              <p className="mt-3 text-zinc-400 text-sm max-w-md leading-relaxed">
                Word documents (.docx, .doc) cannot be previewed natively in the browser. 
                Download the file locally or upload a PDF version to enable direct visual inspection.
              </p>
              <a href={resume.fileUrl} download className="mt-8">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2 transition duration-200">
                  <Download className="h-4 w-4" />
                  Download Word File
                </Button>
              </a>
            </Card>
          )}
        </div>

        {/* Right Column: Metadata & Scoring */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Card: Resume Details */}
          <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                  isPdf ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  {isPdf ? "PDF Document" : "Word Document"}
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-3 truncate" title={resume.fileName}>
                  {resume.fileName}
                </h2>
                <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Uploaded on {new Date(resume.createdAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="border-t border-zinc-900 pt-6 space-y-4">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">ATS Score</h4>
                
                {/* Visual ATS Score display */}
                <div className="flex items-center gap-4">
                  {/* Large Score Indicator */}
                  <div className={`text-3xl font-extrabold flex items-center justify-center h-16 w-16 rounded-2xl border ${scoreColorClass} shadow-md`}>
                    {score}%
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{scoreStatus}</h5>
                    <p className="text-xs text-zinc-400 mt-0.5">{score < 60 ? "Action recommended" : "Score calculated"}</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900/60">
                  {scoreDescription}
                </p>
              </div>

              {/* Action Buttons list */}
              <div className="border-t border-zinc-900 pt-6 flex flex-col gap-3">
                <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-white hover:bg-zinc-200 text-black font-semibold h-11 rounded-xl flex items-center justify-center gap-2 transition duration-200">
                    <Download className="h-4 w-4" />
                    Download Document
                  </Button>
                </a>

                <Button variant="outline" className="w-full border-zinc-800 hover:bg-zinc-900 hover:text-white h-11 rounded-xl flex items-center justify-center gap-2 transition duration-200 text-zinc-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Run ATS Analysis
                </Button>

                <div className="pt-2 border-t border-zinc-900/60 flex justify-end">
                  <DeleteResumeButton resumeId={resume._id.toString()} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick instructions/Card */}
          <Card className="border-zinc-900 bg-zinc-950/20 backdrop-blur-sm rounded-xl p-5 border-dashed">
            <div className="flex gap-3 items-start">
              {score < 80 ? (
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-emerald-450 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                  Optimize your chances
                </h5>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Most recruiting organizations scan applications using AI parsers. Click &quot;Run ATS Analysis&quot; to identify formatting improvements, structural suggestions, and missing key phrases to align with job descriptions.
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
