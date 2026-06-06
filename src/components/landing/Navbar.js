import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-black/50 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition">
          <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          ResumeIQ
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-white hover:bg-zinc-200 text-black font-medium transition-all shadow-md active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
