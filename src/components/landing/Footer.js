import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-550 shadow-[0_0_4px_#3b82f6]" />
          <span className="font-semibold text-foreground">ResumeIQ</span>
          <span>© 2026. All rights reserved.</span>
        </div>

        <div className="flex gap-6">
          <Link href="#" className="hover:text-foreground text-muted-foreground transition">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground text-muted-foreground transition">Terms of Service</Link>
          <Link href="#" className="hover:text-foreground text-muted-foreground transition">Support</Link>
        </div>
      </div>
    </footer>
  );
}
