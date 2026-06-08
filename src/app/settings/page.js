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
import { Input } from "@/components/ui/input";
import { Mail, Briefcase, Moon, Sun, ShieldAlert, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetch("/api/profile/delete", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      await signOut({ callbackUrl: "/" });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

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

        <CardContent className="pt-6 p-6 rounded-b-xl space-y-4">
          {error && (
            <div className="p-3 rounded-lg border text-sm bg-rose-500/10 border-rose-500/20 text-rose-400">
              {error}
            </div>
          )}

          {!showConfirm ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-sm text-foreground">Delete Account</p>
                <p className="text-xs text-rose-500/70 max-w-md mt-0.5">
                  This will permanently delete your user profile, uploads, cover letters, and history. This action cannot be undone.
                </p>
              </div>
              <Button
                onClick={() => setShowConfirm(true)}
                variant="destructive"
                className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white font-semibold transition shrink-0 h-10 px-5 rounded-lg active:scale-98"
              >
                Delete Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md">
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                Are you absolutely sure? This action is irreversible. All of your resumes, cover letters, and profile details will be permanently wiped.
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Type <span className="text-rose-400 font-bold">DELETE</span> to confirm
                </label>
                <Input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  required
                  className="bg-zinc-950/60 border-zinc-900 focus:border-rose-500/50 text-foreground"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== "DELETE" || deleting}
                  variant="destructive"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold h-10 px-4 rounded-lg transition active:scale-98"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Permanently Delete"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmText("");
                    setError("");
                  }}
                  variant="outline"
                  disabled={deleting}
                  className="border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-10 px-4 rounded-lg transition"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
