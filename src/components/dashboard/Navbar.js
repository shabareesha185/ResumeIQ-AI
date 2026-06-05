"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { Search, Bell, User, Settings, LogOut } from "lucide-react";

import MobileSidebar from "./MobileSidebar";

import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ session }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-4 flex-1">
          <MobileSidebar />

          {/* Search */}
          <div className="relative hidden md:block w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <Input
              placeholder="Search..."
              className="pl-10 bg-zinc-950 border-zinc-800"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition">
            <Bell size={18} />
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 hover:bg-zinc-900 transition">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium">{session?.user?.name}</p>

                  <p className="text-xs text-zinc-500">
                    {session?.user?.email}
                  </p>
                </div>

                <Avatar>
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-950 border-zinc-800"
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
