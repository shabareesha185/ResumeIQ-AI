"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Mail, Briefcase, Moon, Trash2, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="mx-auto max-w-4xl relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
          Settings
        </h1>
        <p className="mt-2 text-zinc-400">Manage your ResumeIQ preferences.</p>
      </div>

      {/* Notifications */}
      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl">
        <CardHeader className="border-b border-zinc-900/60 pb-5">
          <CardTitle className="text-lg font-bold text-white tracking-tight">
            Notifications
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Control notifications and email alerts.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/20 border border-zinc-900/40">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-850">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-200">Email Notifications</p>
                <p className="text-xs text-zinc-500">Receive weekly product updates and scans summary.</p>
              </div>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/20 border border-zinc-900/40">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-850">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-200">Job Match Alerts</p>
                <p className="text-xs text-zinc-500">
                  Notify when new jobs match your parsed profile.
                </p>
              </div>
            </div>
            <Switch checked={jobAlerts} onCheckedChange={setJobAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="mt-6 border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl">
        <CardHeader className="border-b border-zinc-900/60 pb-5">
          <CardTitle className="text-lg font-bold text-white tracking-tight">
            Appearance
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Customize your application theme experience.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/20 border border-zinc-900/40">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-850">
                <Moon className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-200">Dark Mode</p>
                <p className="text-xs text-zinc-500">Force application dark theme (enabled by default).</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="mt-6 border-red-950/80 bg-zinc-950/20 backdrop-blur-sm hover:border-red-900/60 transition duration-300 rounded-xl">
        <CardHeader className="border-b border-red-950/40 pb-5">
          <CardTitle className="text-lg font-bold text-red-400 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Permanent, irreversible account actions.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-red-950/5 rounded-b-xl">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-sm text-zinc-200">Delete Account</p>
            <p className="text-xs text-zinc-500 max-w-md mt-0.5">
              This will permanently delete your user profile, uploads, cover letters, and history. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white font-semibold transition shrink-0 h-10 px-5 rounded-lg active:scale-98">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
