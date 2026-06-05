import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "ATS Analysis",
    description: "Get detailed ATS compatibility scores.",
  },
  {
    title: "Resume Review",
    description: "Identify weaknesses and improvements.",
  },
  {
    title: "Job Matching",
    description: "Match resumes with job descriptions.",
  },
  {
    title: "Interview Prep",
    description: "Generate interview questions instantly.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center text-4xl font-bold">Features</h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="border-zinc-800 bg-zinc-950">
            <CardContent className="p-6">
              <h3 className="font-semibold">{feature.title}</h3>

              <p className="mt-3 text-sm text-zinc-400">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
