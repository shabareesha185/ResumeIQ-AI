import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/50 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground hover:opacity-90 transition">
          <span className="h-2 w-2 rounded-full bg-blue-550 shadow-[0_0_8px_#3b82f6]" />
          ResumeIQ
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-foreground hover:bg-foreground/90 text-background font-medium transition-all shadow-md active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
