import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";
import AnalyzeResumeButton from "@/components/resumes/AnalyzeResumeButton";

export default async function ATSAnalysisPage() {
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

  const latestResume = resumes[0];

  // 1. Empty State (No Resumes)
  if (!latestResume) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto relative">
        <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent">
            ATS Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyze your resume and improve your ATS score.
          </p>
        </div>

        <Card className="border-border bg-card/45 backdrop-blur-sm border-dashed border-2 py-16 text-center rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="p-4 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 mb-6">
              <FileText className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Resumes Found</h3>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Upload your resume first to view deep applicant tracking systems (ATS) analysis, keyword optimizations, and score breakdown.
            </p>
            <Link href="/resumes/upload" className="mt-8">
              <Button className="bg-white hover:bg-zinc-200 text-black font-semibold h-11 px-6 rounded-xl transition duration-200 flex items-center gap-2 group">
                Upload Resume
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Pending Analysis State
  if (!latestResume.analysisCompleted) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto relative">
        <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent">
            ATS Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Your latest resume is uploaded. Run the AI parser to analyze.
          </p>
        </div>

        <Card className="border-border bg-card/45 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-zinc-800 transition duration-300 rounded-2xl p-6">
          <CardContent className="flex flex-col items-center py-10 text-center max-w-lg mx-auto space-y-6">
            <div className="p-4 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
              <Sparkles className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Analysis Needed</h3>
              <p className="text-sm font-semibold text-indigo-400 flex items-center justify-center gap-1.5 mt-1">
                <FileText className="h-4 w-4" />
                {latestResume.fileName}
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                This resume has been securely stored but its contents haven&apos;t been evaluated by our AI scanner. Run analysis to calculate keyword relevancy and formatting score.
              </p>
            </div>

            <div className="w-full max-w-xs pt-4">
              <AnalyzeResumeButton resumeId={latestResume._id.toString()} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Analyzed Report State
  const score = latestResume.atsScore || 0;
  
  let scoreBadgeClass = "text-rose-500 border-rose-500/20 bg-rose-500/10";
  let scoreStatus = "Needs Optimization";
  let scoreRecommendation = "AI has detected several formatting gaps or missing keyword indicators. Follow recommendations below to improve.";

  if (score >= 80) {
    scoreBadgeClass = "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    scoreStatus = "Excellent Match";
    scoreRecommendation = "Outstanding alignment with standard corporate ATS scanner requirements. You are in a great position to apply.";
  } else if (score >= 60) {
    scoreBadgeClass = "text-amber-500 border-amber-500/20 bg-amber-500/10";
    scoreStatus = "Fair Match";
    scoreRecommendation = "Good foundation, but adding a few key structural suggestions and phrases will significantly increase interview chances.";
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative animate-fade-in-up">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent">
            ATS Analysis Report
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered scanning analysis and key phrase optimization checklist.
          </p>
        </div>

        <Link href={`/resumes/${latestResume._id}`}>
          <Button variant="outline" className="border-border hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground flex items-center gap-1.5 transition rounded-xl h-11 px-5">
            View Resume Document
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Highlights Section (Score & Metadata) */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Score Ring Display */}
        <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden hover-glow-card">
          <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-8 justify-center sm:justify-start">
            <div className={`h-28 w-28 shrink-0 rounded-2xl border-2 flex flex-col items-center justify-center text-4xl font-extrabold shadow-lg ${scoreBadgeClass}`}>
              <span>{score}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Score</span>
            </div>
            
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ATS Benchmark Status</span>
              <h2 className="text-2xl font-bold text-foreground">{scoreStatus}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                {scoreRecommendation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Document Summary */}
        <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col justify-between hover-glow-card">
          <CardHeader className="pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Analyzed Document</span>
            <CardTitle className="text-lg font-bold text-foreground mt-1 truncate" title={latestResume.fileName}>
              {latestResume.fileName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6 pt-2 space-y-3">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              Uploaded: {new Date(latestResume.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 shrink-0" />
              Format: {latestResume.fileType.includes("pdf") ? "PDF Document" : "Word Document"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Grid (Strengths, Weaknesses, Suggestions) */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Strengths Card */}
        <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden hover-glow-card">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {latestResume.strengths && latestResume.strengths.length > 0 ? (
                latestResume.strengths.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No specific strengths parsed.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses Card */}
        <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden hover-glow-card">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertTriangle className="h-4 w-4" />
              </div>
              Identified Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {latestResume.weaknesses && latestResume.weaknesses.length > 0 ? (
                latestResume.weaknesses.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-rose-500 shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No specific weaknesses identified.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Suggestions Card */}
        <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden hover-glow-card">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Lightbulb className="h-4 w-4" />
              </div>
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {latestResume.suggestions && latestResume.suggestions.length > 0 ? (
                latestResume.suggestions.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Lightbulb className="h-4 w-4 mt-0.5 text-indigo-400 shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No specific suggestions generated.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Summary Stats */}
      <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle className="text-lg font-bold text-foreground">Analysis Summary Metrics</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4 text-center">
            <div className="space-y-1 bg-zinc-500/5 dark:bg-zinc-950/20 border border-border/50 p-4 rounded-xl">
              <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">ATS score</p>
              <p className="text-3xl font-extrabold text-foreground">{score}%</p>
            </div>

            <div className="space-y-1 bg-zinc-500/5 dark:bg-zinc-950/20 border border-border/50 p-4 rounded-xl">
              <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Strengths Count</p>
              <p className="text-3xl font-extrabold text-foreground">
                {latestResume.strengths ? latestResume.strengths.length : 0}
              </p>
            </div>

            <div className="space-y-1 bg-zinc-500/5 dark:bg-zinc-950/20 border border-border/50 p-4 rounded-xl">
              <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Gaps Count</p>
              <p className="text-3xl font-extrabold text-foreground">
                {latestResume.weaknesses ? latestResume.weaknesses.length : 0}
              </p>
            </div>

            <div className="space-y-1 bg-zinc-500/5 dark:bg-zinc-950/20 border border-border/50 p-4 rounded-xl">
              <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Suggestions Count</p>
              <p className="text-3xl font-extrabold text-foreground">
                {latestResume.suggestions ? latestResume.suggestions.length : 0}
              </p>
            </div>
          </div>

          {/* Re-analyze block */}
          <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-foreground">Need to update your stats?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Re-run the analysis model if you have updated details on your Cloudinary file.</p>
            </div>
            <div className="w-full sm:w-auto shrink-0 max-w-xs">
              <AnalyzeResumeButton resumeId={latestResume._id.toString()} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
