import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="
        absolute inset-0
        bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]
        bg-[size:64px_64px]
        opacity-20
      "
      />

      <div className="relative mx-auto max-w-6xl px-6 py-32 text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          Improve Your Resume
          <br />
          With AI
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Analyze resumes, improve ATS scores, discover skill gaps, and prepare
          for interviews using AI.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
