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
    <aside className="hidden md:flex w-72 min-h-screen border-r border-zinc-800 bg-black flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold">ResumeIQ</h1>

        <p className="mt-1 text-sm text-zinc-500">AI Career Assistant</p>
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">Version</p>

          <p className="mt-1 font-medium">v1.0 Beta</p>
        </div>

        {/* <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">Current Plan</p>

          <p className="mt-1 font-medium">Free</p>
        </div> */}
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
                  flex items-center gap-3 rounded-xl px-4 py-3 transition
                  
                  ${
                    isActive
                      ? "bg-white text-black font-medium"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
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
