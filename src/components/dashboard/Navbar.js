"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { Bell, User, Settings, LogOut } from "lucide-react";

import MobileSidebar from "./MobileSidebar";
import ThemeToggle from "@/components/ThemeToggle";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ session }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-4 flex-1">
          <MobileSidebar />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Notifications */}
          <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground transition duration-200">
            <Bell size={18} />
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground transition duration-200">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium">{session?.user?.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>

                <Avatar>
                  {session?.user?.image && (
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                  )}
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900 text-foreground">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-card border-border text-foreground"
            >
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  signOut({
                    callbackUrl: "/login",
                  })
                }
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
