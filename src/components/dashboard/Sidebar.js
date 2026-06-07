"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  Brain,
  Briefcase,
  FileSignature,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resumes",
    href: "/resumes",
    icon: FileText,
  },
  {
    title: "ATS Analysis",
    href: "/analysis",
    icon: Brain,
  },
  {
    title: "Job Match",
    href: "/job-match",
    icon: Briefcase,
  },
  {
    title: "Cover Letter",
    href: "/cover-letter",
    icon: FileSignature,
  },
  {
    title: "Interview Prep",
    href: "/interview",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 min-h-screen border-r border-border bg-sidebar text-sidebar-foreground flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent">ResumeIQ</h1>

        <p className="mt-1 text-sm text-muted-foreground">AI Career Assistant</p>
        <div className="mt-4 rounded-xl border border-border bg-card/60 p-4">
          <p className="text-xs text-muted-foreground">Version</p>

          <p className="mt-1 font-medium text-foreground">v1.0 Beta</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 transition duration-200
                  
                  ${
                    isActive
                      ? "bg-zinc-900 text-zinc-50 dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground dark:hover:text-white"
                  }
                `}
              >
                <Icon size={18} />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
