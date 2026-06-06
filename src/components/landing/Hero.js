import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-black">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Grid Background */}
      <div
        className="
        absolute inset-0
        bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]
        bg-[size:64px_64px]
        opacity-25
        pointer-events-none
      "
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Improve Your Resume
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            With AI Power
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg text-zinc-400 leading-relaxed">
          Analyze resumes, improve ATS scores, discover skill gaps, and prepare
          for interviews using state-of-the-art AI. Get hired faster.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black px-8 h-12 rounded-xl transition-all shadow-xl active:scale-95 font-medium">
              Get Started Free
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-8 h-12 rounded-xl transition-all hover:bg-zinc-900 text-white">
              Watch Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
