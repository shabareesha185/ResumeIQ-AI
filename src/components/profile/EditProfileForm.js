"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditProfileForm({ initialUser }) {
  const router = useRouter();
  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-muted-foreground hover:text-foreground hover:bg-zinc-900 transition"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Edit Profile
          </h1>
          <p className="text-sm text-zinc-400">Update your account information.</p>
        </div>
      </div>

      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl overflow-hidden max-w-2xl">
        <CardHeader className="border-b border-zinc-900/60 pb-5">
          <CardTitle className="text-lg font-bold text-foreground">
            Profile Details
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Keep your profile details up-to-date.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div
                className={`p-3 rounded-lg border text-sm ${
                  message.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="bg-zinc-950/60 border-zinc-900 focus:border-indigo-500/50 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-zinc-950/60 border-zinc-900 focus:border-indigo-500/50 text-foreground"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-white hover:bg-zinc-200 text-black font-semibold h-10 px-5 rounded-lg transition active:scale-98"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Link href="/profile">
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-10 px-5 rounded-lg transition"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
