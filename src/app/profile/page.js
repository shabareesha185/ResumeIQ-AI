import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db/mongodb";
import UserModel from "@/models/User";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, ShieldAlert, Calendar, ShieldCheck, Lock } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const dbUser = await UserModel.findById(session.user.id);
  const isCredentials = dbUser?.provider === "credentials";
  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "June 2026";

  return (
    <div className="mx-auto max-w-4xl relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          Profile
        </h1>
        <p className="mt-2 text-zinc-400">
          Manage your ResumeIQ account information.
        </p>
      </div>

      {/* User Card */}
      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl overflow-hidden">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative p-1.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Avatar className="h-20 w-20 border-2 border-zinc-950">
                <AvatarFallback className="text-2xl font-bold bg-zinc-900 text-zinc-50">
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                {session.user.name}
              </h2>
              <p className="text-zinc-400 text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                {session.user.email}
              </p>
            </div>
          </div>

          <Link href="/profile/edit">
            <Button className="bg-white hover:bg-zinc-200 text-black font-semibold px-5 h-10 rounded-lg transition active:scale-98">
              Edit Profile
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="mt-6 border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl">
        <CardHeader className="border-b border-zinc-900/60 pb-5">
          <CardTitle className="text-lg font-bold text-foreground tracking-tight">
            Account Information
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Personal account details and provider status.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-3 items-start p-3 bg-zinc-950/20 border border-zinc-900/60 rounded-xl">
              <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-850">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Full Name
                </p>
                <p className="mt-1 font-semibold text-sm text-zinc-200">
                  {session.user.name}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-zinc-950/20 border border-zinc-900/60 rounded-xl">
              <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-850">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Email Address
                </p>
                <p className="mt-1 font-semibold text-sm text-zinc-200">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-zinc-950/20 border border-zinc-900/60 rounded-xl">
              <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-850">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Provider
                </p>
                <p className="mt-1 font-semibold text-sm text-zinc-200 flex items-center gap-1.5">
                  {dbUser?.provider === "google" ? "Google Account" : "Credentials"}
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                    Verified
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-zinc-950/20 border border-zinc-900/60 rounded-xl">
              <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-850">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Member Since
                </p>
                <p className="mt-1 font-semibold text-sm text-zinc-200">
                  {memberSince}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="mt-6 border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <Lock className="h-4 w-4 text-zinc-400" />
            Security & Access
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Manage your password and security credentials.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          {isCredentials ? (
            <ChangePasswordModal />
          ) : (
            <p className="text-sm text-zinc-500">
              Social login accounts manage their security credentials via their identity provider (Google).
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
