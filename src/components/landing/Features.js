import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileText, Briefcase, MessageSquare } from "lucide-react";

const features = [
  {
    title: "ATS Analysis",
    description: "Get detailed ATS compatibility scores, keyword matching, and format checking.",
    icon: Brain,
    color: "group-hover:text-blue-400 border-blue-500/30",
    glowColor: "bg-blue-500/10",
  },
  {
    title: "Resume Review",
    description: "Identify weaknesses, missing skills, and get personalized improvement suggestions.",
    icon: FileText,
    color: "group-hover:text-indigo-400 border-indigo-500/30",
    glowColor: "bg-indigo-500/10",
  },
  {
    title: "Job Matching",
    description: "Compare your resume against any job description and optimize keyword alignment.",
    icon: Briefcase,
    color: "group-hover:text-purple-400 border-purple-500/30",
    glowColor: "bg-purple-500/10",
  },
  {
    title: "Interview Prep",
    description: "Generate tailored interview questions based on your resume and practice answers.",
    icon: MessageSquare,
    color: "group-hover:text-emerald-400 border-emerald-500/30",
    glowColor: "bg-emerald-500/10",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28 bg-black">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Powerful AI Features
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
          Everything you need to optimize your career path, bypass automated screeners, and land your dream job.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden border-zinc-900 bg-zinc-950/40 backdrop-blur-sm transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/30 hover:-translate-y-1 rounded-2xl"
            >
              <CardContent className="p-8 flex flex-col items-start space-y-4">
                {/* Glow behind icon */}
                <div className={`p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 transition-colors duration-300 ${feature.color}`}>
                  <Icon className="h-6 w-6 transition-all duration-300" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-white group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle bottom glow indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${feature.glowColor}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
