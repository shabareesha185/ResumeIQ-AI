import { Card, CardContent } from "@/components/ui/card";
import { FileText, Brain, Briefcase, Sparkles } from "lucide-react";

const iconMap = {
  "Total Resumes": { icon: FileText, color: "text-blue-400 border-blue-500/20 bg-blue-500/10" },
  "ATS Score": { icon: Brain, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10" },
  "Job Matches": { icon: Briefcase, color: "text-purple-400 border-purple-500/20 bg-purple-500/10" },
  "AI Analyses": { icon: Sparkles, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
};

export default function StatsCard({ title, value }) {
  const meta = iconMap[title] || { icon: Sparkles, color: "text-zinc-400 border-zinc-800 bg-zinc-900" };
  const Icon = meta.icon;

  return (
    <Card className="relative overflow-hidden bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 transition duration-300 rounded-xl group">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 tracking-wide uppercase">
            {title}
          </p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {value}
          </h2>
        </div>

        <div className={`p-3 rounded-xl border transition duration-300 ${meta.color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
