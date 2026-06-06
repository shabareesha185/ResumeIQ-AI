import { auth } from "@/auth";
import Link from "next/link";
import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DeleteResumeButton from "@/components/resumes/DeleteResumeButton";
import {
  FileText,
  Upload,
  Plus,
  Eye,
  Calendar,
  Award,
  BarChart2,
  FileCode,
  ArrowRight
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ResumesPage() {
  const session = await auth();

  await connectDB();

  const resumes = await Resume.find({
    userId: session.user.id,
  }).sort({
    createdAt: -1,
  });

  // Calculate quick stats
  const totalResumes = resumes.length;
  const avgAtsScore = totalResumes
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / totalResumes)
    : 0;
  const maxAtsScore = totalResumes
    ? Math.max(...resumes.map(r => r.atsScore || 0))
    : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            My Resumes
          </h1>
          <p className="mt-2 text-zinc-400">
            Upload, manage, and analyze your resumes for ATS optimization.
          </p>
        </div>

        <Link href="/resumes/upload">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/20 transition duration-300 flex items-center gap-2 group h-11 px-5 rounded-xl">
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            Upload Resume
          </Button>
        </Link>
      </div>

      {totalResumes > 0 && (
        /* Stats Overview */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Resumes</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{totalResumes}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BarChart2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Average ATS Score</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{avgAtsScore}%</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Highest ATS Score</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{maxAtsScore}%</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {resumes.length === 0 ? (
        /* Empty State */
        <Card className="border-zinc-900 bg-zinc-950/30 backdrop-blur-sm py-16 hover:border-zinc-800/80 transition duration-300 rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="p-4 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 mb-6 animate-pulse">
              <Upload className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">No Resumes Uploaded Yet</h2>
            <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
              Upload your resume in PDF or Word format to receive real-time ATS analysis and optimization suggestions.
            </p>
            <Link href="/resumes/upload" className="mt-8">
              <Button className="bg-white hover:bg-zinc-200 text-black font-semibold h-11 px-6 rounded-xl transition duration-300 flex items-center gap-2 group">
                Upload First Resume
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Resumes List */
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-950/80 border-b border-zinc-900">
                <TableRow className="hover:bg-transparent border-zinc-900">
                  <TableHead className="py-4 text-zinc-400 font-semibold pl-6">Resume Name</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-semibold">Format</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-semibold">ATS Score</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-semibold">Uploaded Date</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-semibold text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes.map((resume) => {
                  const isPdf = resume.fileType.includes("pdf");
                  const score = resume.atsScore || 0;
                  
                  // Score-based badge styling
                  let scoreBadgeClass = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                  if (score >= 80) {
                    scoreBadgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                  } else if (score >= 60) {
                    scoreBadgeClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                  }

                  return (
                    <TableRow 
                      key={resume._id}
                      className="border-zinc-900 hover:bg-zinc-900/20 transition duration-200 group"
                    >
                      <TableCell className="font-semibold py-4 pl-6 text-zinc-100">
                        <Link 
                          href={`/resumes/${resume._id}`} 
                          className="flex items-center gap-3 hover:text-indigo-400 transition"
                        >
                          <div className={`p-2 rounded-lg ${isPdf ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            <FileText className="h-4.5 w-4.5" />
                          </div>
                          <span className="truncate max-w-[280px] sm:max-w-[360px]">
                            {resume.fileName}
                          </span>
                        </Link>
                      </TableCell>
                      
                      <TableCell className="py-4 text-zinc-300">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${
                          isPdf 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {isPdf ? "PDF" : "Word"}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadgeClass}`}>
                          {score}/100
                        </span>
                      </TableCell>

                      <TableCell className="py-4 text-zinc-400 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                          {new Date(resume.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/resumes/${resume._id}`}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                          </Link>

                          <DeleteResumeButton resumeId={resume._id.toString()} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
