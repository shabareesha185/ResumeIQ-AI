"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, ArrowLeft, Loader2, Camera } from "lucide-react";
import Link from "next/link";

export default function EditProfileForm({ initialUser }) {
  const router = useRouter();
  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [image, setImage] = useState(initialUser.image || "");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload-photo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload photo");
      }

      setImage(data.imageUrl);
      setMessage({ type: "success", text: "Profile photo updated successfully!" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUploadingPhoto(false);
    }
  };

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

      setMessage({ type: "success", text: "Profile details updated successfully!" });
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
            Keep your profile details and photo up-to-date.
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

            {/* Profile Photo Upload / Preview Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
              <div className="relative p-1.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] shrink-0">
                <Avatar className="h-24 w-24 border-2 border-zinc-950">
                  {image && (
                    <AvatarImage src={image} alt="Profile Photo" />
                  )}
                  <AvatarFallback className="text-3xl font-bold bg-zinc-900 text-zinc-50">
                    {name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <h3 className="font-bold text-sm text-foreground">Profile Photo</h3>
                {initialUser.provider === "google" ? (
                  <div className="space-y-1">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20 gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      Google Sync
                    </span>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                      Your profile photo is synchronized automatically from your Google account.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500">
                      Upload a square JPG, PNG, or GIF file (max 5MB).
                    </p>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-50 h-9 px-4 text-xs font-semibold transition active:scale-98 gap-1.5 disabled:opacity-50">
                        {uploadingPhoto ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera size={14} />
                            Upload Photo
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                disabled={loading || uploadingPhoto}
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
