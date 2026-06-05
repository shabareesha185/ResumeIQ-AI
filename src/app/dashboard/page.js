import StatsCard from "@/components/dashboard/StatsCard";

export default function DashboardPage() {
  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Hero Section */}
      <section className="relative z-10">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Build a stronger career with AI
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Analyze resumes, improve ATS scores, discover skill gaps, and prepare
          for interviews with AI-powered insights.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="rounded-lg bg-white px-5 py-3 text-black font-medium hover:bg-zinc-200 transition">
            Upload Resume
          </button>

          <button className="rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-3 text-white hover:bg-zinc-900 transition">
            ATS Analysis
          </button>

          <button className="rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-3 text-white hover:bg-zinc-900 transition">
            Job Match
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-white">Overview</h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-10">
          <StatsCard title="Total Resumes" value="0" />

          <StatsCard title="ATS Score" value="0" />

          <StatsCard title="Job Matches" value="0" />

          <StatsCard title="AI Analyses" value="0" />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between border-b border-zinc-800 py-4">
            <div>
              <p className="font-medium">No resume uploaded yet</p>

              <p className="text-sm text-zinc-500">
                Upload your first resume to begin analysis.
              </p>
            </div>

            <span className="text-sm text-zinc-500">Just now</span>
          </div>

          <div className="py-4">
            <p className="text-zinc-500">
              Activity will appear here after users start uploading resumes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
