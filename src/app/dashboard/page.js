import StatsCard from "@/components/dashboard/StatsCard";
import OverviewCharts from "@/components/dashboard/OverviewCharts";
import { FileText, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
          <Link href="/analysis">
            <button className="rounded-lg bg-white px-5 py-2.5 text-black font-semibold text-sm hover:bg-zinc-200 transition active:scale-98 cursor-pointer">
              ATS Analysis
            </button>
          </Link>

          <Link href="/job-match">
            <button className="rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-2.5 text-zinc-300 hover:text-white text-sm hover:bg-zinc-900 transition active:scale-98 cursor-pointer">
              Job Match
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
          <StatsCard title="Total Resumes" value="4" />
          <StatsCard title="ATS Score" value="85%" />
          <StatsCard title="Job Matches" value="12" />
          <StatsCard title="AI Analyses" value="18" />
        </div>
      </section>

      {/* Dynamic Recharts Charts & File Uploader */}
      <OverviewCharts />

      {/* Recent Activity Section */}
      <section className="mt-12 pb-10">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 backdrop-blur-sm p-2 divide-y divide-zinc-900/60">
          <div className="flex items-center justify-between p-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-200">
                  Resume_Senior_Frontend_Developer.pdf
                </p>
                <p className="text-xs text-zinc-500">
                  ATS analysis completed successfully. Overall score: 85%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-500">2 hours ago</span>
              <Link href="/analysis" className="text-zinc-500 hover:text-white transition">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-200">
                  Job Match: Senior UI Engineer at Netflix
                </p>
                <p className="text-xs text-zinc-500">
                  Compatibility rating calculated: 79% (Good Match)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-500">1 day ago</span>
              <Link href="/job-match" className="text-zinc-500 hover:text-white transition">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
