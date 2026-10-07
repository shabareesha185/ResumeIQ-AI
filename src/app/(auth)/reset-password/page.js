"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2, CheckCircle2, XCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid or missing reset link parameters. Please request a new reset link.");
    }
  }, [token, email]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setStatus("idle");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.message || "Failed to reset password. Please request a new reset link.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "Password reset successfully!");
    } catch (err) {
      setStatus("error");
      setMessage("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Password Reset!</h2>
          <p className="text-sm text-zinc-300 mt-2">{message}</p>
        </div>
        <Link
          href="/login"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all shadow-md"
        >
          <span>Continue to Login</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="p-6 text-center space-y-5">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
          <XCircle className="w-9 h-9" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Invalid Link</h2>
          <p className="text-sm text-rose-300 mt-2">{message}</p>
        </div>
        <Link
          href="/forgot-password"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all shadow-md"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  return (
    <>
      <CardHeader className="space-y-1 text-center pt-8">
        <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-foreground mb-2 hover:opacity-90 transition">
          ResumeIQ
        </Link>
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-sm text-zinc-400">
          Choose a new secure password for your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 text-zinc-50 placeholder-zinc-500 rounded-xl transition"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="pl-10 h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 text-zinc-50 placeholder-zinc-500 rounded-xl transition"
                value={confirmPassword}
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {status === "error" && message && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl">
              <p className="text-xs text-red-300 break-words">{message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-all shadow-md active:scale-[0.99]"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>

        <Link
          href="/forgot-password"
          className="block text-center text-xs text-zinc-500 hover:text-zinc-300 transition pt-1"
        >
          Request a new reset link
        </Link>
      </CardContent>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:48px_48px] opacity-25 pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl shadow-2xl p-2 rounded-2xl">
        <Suspense
          fallback={
            <div className="p-8 text-center text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-400" />
              <p className="mt-2 text-sm">Loading...</p>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </Card>
    </div>
  );
}
