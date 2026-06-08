"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSignature, Search, Calendar, Eye, Trash2, Loader2, FileText } from "lucide-react";

export default function CoverLetterHistory({ initialLetters }) {
  const [letters, setLetters] = useState(initialLetters);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/cover-letter/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete cover letter");
      }

      setLetters(letters.filter((letter) => letter._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLetters = letters.filter(
    (letter) =>
      letter.company.toLowerCase().includes(search.toLowerCase()) ||
      letter.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      letter.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-zinc-950/60 border-zinc-900 focus:border-indigo-500/50 text-foreground h-10"
        />
      </div>

      {filteredLetters.length === 0 ? (
        <div className="border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm rounded-xl p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800">
            <FileText size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">No Cover Letters Found</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              {search ? "No cover letters match your search query." : "You haven't generated any cover letters yet."}
            </p>
          </div>
          {!search && (
            <div className="pt-2">
              <Link href="/cover-letter">
                <Button className="bg-white hover:bg-zinc-200 text-black font-semibold h-10 px-5 rounded-lg transition gap-2">
                  <FileSignature size={16} />
                  Generate New
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLetters.map((letter) => (
            <Card
              key={letter._id}
              className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 hover:bg-zinc-950/60 transition duration-300 rounded-xl flex flex-col justify-between group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground leading-snug line-clamp-1">
                      {letter.jobTitle}
                    </CardTitle>
                    <CardDescription className="text-zinc-400 font-semibold text-sm mt-0.5 line-clamp-1">
                      {letter.company}
                    </CardDescription>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900/60 text-indigo-400 border border-zinc-850 shrink-0">
                    <FileSignature className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2 pb-5 space-y-4 flex-grow flex flex-col justify-between">
                <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(letter.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-zinc-900/60 mt-auto">
                  <Link href={`/cover-letter/${letter._id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-9 px-3 rounded-lg transition text-xs gap-1.5"
                    >
                      <Eye size={14} />
                      View Details
                    </Button>
                  </Link>

                  <Button
                    onClick={() => handleDelete(letter._id)}
                    disabled={deletingId === letter._id}
                    variant="destructive"
                    className="border border-rose-500/20 bg-rose-500/5 hover:bg-rose-600 text-rose-500 hover:text-white h-9 w-9 p-0 rounded-lg transition shrink-0"
                  >
                    {deletingId === letter._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
