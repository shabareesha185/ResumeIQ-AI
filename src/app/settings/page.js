"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Mail, Briefcase, Moon, Sun, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Initialize theme from document element on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(isDark);
  }, []);

  const handleThemeChange = (checked) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="mx-auto max-w-4xl relative space-y-6">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent leading-tight">
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your ResumeIQ preferences.</p>
      </div>

      {/* Notifications */}
      <Card className="border-border bg-card/45 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-zinc-800 transition duration-300 rounded-xl">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle className="text-lg font-bold text-foreground tracking-tight">
            Notifications
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Control notifications and email alerts.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-muted-foreground border border-border">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive weekly product updates and scans summary.</p>
              </div>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-muted-foreground border border-border">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Job Match Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Notify when new jobs match your parsed profile.
                </p>
              </div>
            </div>
            <Switch checked={jobAlerts} onCheckedChange={setJobAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border bg-card/45 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-zinc-800 transition duration-300 rounded-xl">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle className="text-lg font-bold text-foreground tracking-tight">
            Appearance
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Customize your application theme experience.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-muted-foreground border border-border">
                {darkMode ? (
                  <Moon className="h-4 w-4 text-indigo-400" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Force application dark theme (enabled by default).</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleThemeChange} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-500/20 bg-rose-500/5 backdrop-blur-sm hover:border-rose-500/30 transition duration-300 rounded-xl">
        <CardHeader className="border-b border-rose-500/20 pb-5">
          <CardTitle className="text-lg font-bold text-rose-500 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-rose-500/70">
            Permanent, irreversible account actions.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-b-xl">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-sm text-foreground">Delete Account</p>
            <p className="text-xs text-rose-500/70 max-w-md mt-0.5">
              This will permanently delete your user profile, uploads, cover letters, and history. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-550 hover:text-white font-semibold transition shrink-0 h-10 px-5 rounded-lg active:scale-98">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
