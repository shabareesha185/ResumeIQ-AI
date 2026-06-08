"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, Printer, FileText, Briefcase, Building, Loader2, ArrowLeft } from "lucide-react";

export default function CoverLetterForm({ initialResumes }) {
  const [resumeId, setResumeId] = useState(initialResumes[0]?._id || "");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobTitle, company, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (coverLetter) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between no-print">
          <Button
            onClick={() => setCoverLetter(null)}
            variant="outline"
            className="border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-10 px-4 rounded-lg transition gap-2"
          >
            <ArrowLeft size={16} />
            Generate Another
          </Button>

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
                  Copy Text
                </>
              )}
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="border-zinc-800 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-50 h-10 px-4 rounded-lg transition gap-2"
            >
              <Printer size={16} />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Paper Sheet Preview */}
        <Card className="border-zinc-900 bg-zinc-950/60 shadow-2xl rounded-xl overflow-hidden max-w-3xl mx-auto printable-card">
          <CardContent className="p-8 md:p-12 text-zinc-300 whitespace-pre-wrap font-serif text-base leading-relaxed select-text tracking-wide bg-zinc-950 printable-content">
            {coverLetter.content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-zinc-900 bg-zinc-950/45 backdrop-blur-sm hover:border-zinc-800 transition duration-300 rounded-xl max-w-3xl mx-auto">
      <CardHeader className="border-b border-zinc-900/60 pb-5">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          Job details
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Select a resume and fill in target job parameters to generate a highly customized cover letter.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg border text-sm bg-rose-500/10 border-rose-500/20 text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Select Base Resume
            </label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition"
            >
              {initialResumes.map((resume) => (
                <option key={resume._id} value={resume._id} className="bg-zinc-950 text-foreground">
                  {resume.fileName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                Job Title
              </label>
              <Input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                required
                className="bg-zinc-950/60 border-zinc-900 focus:border-indigo-500/50 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" />
                Company Name
              </label>
              <Input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                required
                className="bg-zinc-950/60 border-zinc-900 focus:border-indigo-500/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job requirements or job description here to help the AI align your resume points to the position..."
              rows={6}
              className="flex min-h-[120px] w-full rounded-md border border-zinc-900 bg-zinc-950/60 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-zinc-200 text-black font-semibold h-10 px-6 rounded-lg transition active:scale-98 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2 text-indigo-500 animate-pulse" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
