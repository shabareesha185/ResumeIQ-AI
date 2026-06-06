"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 overflow-hidden">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      
      {/* Grid Overlay */}
      <div
        className="
        absolute inset-0
        bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]
        bg-[size:48px_48px]
        opacity-25
        pointer-events-none
      "
      />

      <Card className="relative z-10 w-full max-w-md border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl shadow-2xl p-2 rounded-2xl">
        <CardHeader className="space-y-1 text-center pt-8">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white mb-2 hover:opacity-90 transition">
            ResumeIQ
          </Link>
          <CardTitle className="text-xl font-semibold tracking-tight text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="pl-10 h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 text-white placeholder-zinc-500 rounded-xl transition"
                  value={name}
                  disabled={loading}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  className="pl-10 h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 text-white placeholder-zinc-500 rounded-xl transition"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-10 h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 text-white placeholder-zinc-500 rounded-xl transition"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500/90 text-center pl-1 animate-fade-in">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-all shadow-md active:scale-[0.99] mt-2"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
