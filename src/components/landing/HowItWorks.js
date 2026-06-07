import { UploadCloud, Cpu, Award } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Resume",
    description: "Upload your PDF or DOCX resume in seconds. Our system automatically parses the content.",
    icon: UploadCloud,
    color: "from-blue-500/20 to-transparent",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "ResumeIQ analyzes your skills, experience, and structure against top-tier ATS criteria.",
    icon: Cpu,
    color: "from-indigo-500/20 to-transparent",
  },
  {
    number: "03",
    title: "Improve & Apply",
    description: "Get targeted recommendations, fix skill gaps, and generate tailored prep materials.",
    icon: Award,
    color: "from-purple-500/20 to-transparent",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28 bg-background relative transition-colors duration-300">
      <div className="text-center space-y-4 mb-20">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Simple 3-Step Process
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          Start optimizing your resume in minutes and land more interviews.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 relative z-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-zinc-350 dark:hover:border-zinc-800 transition duration-300 hover:shadow-md">
              {/* Step indicator */}
              <div className="absolute top-4 right-6 text-5xl md:text-6xl font-extrabold text-foreground/10 select-none">
                {step.number}
              </div>

              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-border text-foreground mb-6">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Decorative connector for large screens */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-[2px] bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent z-0" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
