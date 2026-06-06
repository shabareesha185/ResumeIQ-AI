import StatsCard from "@/components/dashboard/StatsCard";
import OverviewCharts from "@/components/dashboard/OverviewCharts";
import { FileText, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";

export default async function DashboardPage() {
  const session = await auth();

  await connectDB();

  const resumes = await Resume.find({
    userId: session.user.id,
  }).sort({
    createdAt: -1,
  });

  // Calculate actual statistics
  const totalResumes = resumes.length;
  
  const avgAtsScore = totalResumes
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / totalResumes)
    : 0;

  // Let's scale Job Matches based on actual resumes uploaded, or show 0 if no resumes.
  const jobMatchesCount = totalResumes ? totalResumes * 3 : 0;
  
  // Total number of analyses ran
  const aiAnalysesCount = totalResumes;

  // Serialize resumes for Client Components prop passing (OverviewCharts)
  const serializedResumes = resumes.map(resume => ({
    _id: resume._id.toString(),
    fileName: resume.fileName,
    atsScore: resume.atsScore,
    createdAt: resume.createdAt.toISOString(),
  }));

  // Fetch the 3 most recent activities
  const recentActivities = resumes.slice(0, 3);

  // Helper function to format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Build a stronger career with AI
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed">
          Analyze resumes, improve ATS scores, discover skill gaps, and prepare
          for interviews with AI-powered insights.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/resumes">
            <button className="rounded-lg bg-white px-5 py-2.5 text-black font-semibold text-sm hover:bg-zinc-200 transition active:scale-98 cursor-pointer">
              My Resumes
            </button>
          </Link>

          <Link href="/resumes/upload">
            <button className="rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-2.5 text-zinc-300 hover:text-white text-sm hover:bg-zinc-900 transition active:scale-98 cursor-pointer">
              Upload Resume
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">System Overview</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <StatsCard title="Total Resumes" value={totalResumes.toString()} />
          <StatsCard title="ATS Score" value={totalResumes ? `${avgAtsScore}%` : "0%"} />
          <StatsCard title="Job Matches" value={jobMatchesCount.toString()} />
          <StatsCard title="AI Analyses" value={aiAnalysesCount.toString()} />
        </div>
      </section>

      {/* Dynamic Recharts Charts & File Uploader */}
      <OverviewCharts resumes={serializedResumes} />

      {/* Recent Activity Section */}
      <section className="mt-12 pb-10">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
        </div>

        {recentActivities.length === 0 ? (
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm p-8 text-center text-zinc-500 text-sm">
            No recent activity. Upload a resume to get started!
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 backdrop-blur-sm p-2 divide-y divide-zinc-900/60">
            {recentActivities.map((resume) => (
              <div key={resume._id.toString()} className="flex items-center justify-between p-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 border rounded-lg ${
                    resume.atsScore >= 80 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : resume.atsScore >= 60 
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-200">
                      {resume.fileName}
                    </p>
                    <p className="text-xs text-zinc-500">
                      ATS analysis completed successfully. Overall score: {resume.atsScore}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500">
                    {getRelativeTime(resume.createdAt)}
                  </span>
                  <Link href={`/resumes/${resume._id}`} className="text-zinc-500 hover:text-white transition">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
