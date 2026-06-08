"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, Printer, Trash2, Loader2, Calendar, Building, Briefcase } from "lucide-react";

export default function CoverLetterDetails({ coverLetter }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${coverLetter.title}</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif, Arial, sans-serif;
              line-height: 1.6;
              color: #000000;
              margin: 40px;
              font-size: 12pt;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>${coverLetter.content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this cover letter permanently?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/cover-letter/${coverLetter._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete cover letter");
      }

      router.push("/cover-letter/history");
      router.refresh();
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/cover-letter/history"
            className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-muted-foreground hover:text-foreground hover:bg-zinc-900 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground line-clamp-1">
              {coverLetter.company}
            </h1>
            <p className="text-sm text-zinc-400 flex items-center gap-1.5">
              <Briefcase className="h-3 w-3 text-zinc-500" />
              {coverLetter.jobTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-10 px-4 rounded-lg transition gap-2"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-10 px-4 rounded-lg transition gap-2"
          >
            <Printer size={16} />
            Print
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="destructive"
            className="border border-rose-500/20 bg-rose-500/5 hover:bg-rose-650 text-rose-500 hover:text-white h-10 px-4 rounded-lg transition gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Meta Card */}
      <Card className="border-zinc-900 bg-zinc-950/20 backdrop-blur-sm rounded-xl p-5">
        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-450">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-zinc-500" />
            <span className="font-semibold text-zinc-350">Company:</span>
            <span className="text-foreground">{coverLetter.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-zinc-500" />
            <span className="font-semibold text-zinc-350">Role:</span>
            <span className="text-foreground">{coverLetter.jobTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <span className="font-semibold text-zinc-350">Created on:</span>
            <span className="text-foreground">
              {new Date(coverLetter.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </Card>

      {/* Letter paper preview */}
      <Card className="border-zinc-900 bg-zinc-950/60 shadow-2xl rounded-xl overflow-hidden">
        <CardContent className="p-8 md:p-12 text-zinc-300 whitespace-pre-wrap font-serif text-base leading-relaxed select-text tracking-wide bg-zinc-950">
          {coverLetter.content}
        </CardContent>
      </Card>
    </div>
  );
}
