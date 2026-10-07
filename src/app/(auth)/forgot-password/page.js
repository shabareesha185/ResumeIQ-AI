"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, CheckCircle2, ArrowLeft, ExternalLink, Terminal } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [devLink, setDevLink] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      if (data.devLink) {
        setDevLink(data.devLink);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:48px_48px] opacity-25 pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl shadow-2xl p-2 rounded-2xl">
        {!submitted ? (
          <>
            <CardHeader className="space-y-1 text-center pt-8">
              <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-foreground mb-2 hover:opacity-90 transition">
                ResumeIQ
              </Link>
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-sm text-zinc-400">
                Enter your email and we&apos;ll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="pl-10 h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 text-zinc-50 placeholder-zinc-500 rounded-xl transition"
                      value={email}
                      disabled={loading}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-all shadow-md active:scale-[0.99]"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
              </form>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition pt-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </CardContent>
          </>
        ) : (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto text-violet-400">
              <Mail className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Check Your Email</h2>
              <p className="text-sm text-zinc-400 mt-2">
                If an account exists for <strong className="text-zinc-200">{email}</strong>, a password reset link has been sent.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl text-left text-xs text-zinc-300 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Check your inbox for the reset link.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>The link will expire in 1 hour.</span>
              </div>
            </div>

            {devLink && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Dev Testing Mode (SMTP Unconfigured)</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  SMTP credentials are not configured. Click below to reset password instantly for testing:
                </p>
                <a
                  href={devLink}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-medium transition"
                >
                  <span>Reset Password Instantly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
