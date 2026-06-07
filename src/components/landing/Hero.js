"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function Hero() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError("");
    setAnalysis(null);

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const isDoc = fileExtension === "doc" || fileExtension === "docx";
    const isPdf = fileExtension === "pdf";

    if (!validTypes.includes(selectedFile.type) && !isDoc && !isPdf) {
      setError("Please upload a PDF or Word document (.doc, .docx).");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resumes/analyze-guest", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Gemini is currently experiencing high demand. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Failed to run ATS analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // SVG Progress Circle Calculations
  const score = analysis?.score || 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-background transition-colors duration-300">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Grid Background */}
      <div
        className="
        absolute inset-0
        bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)]
        bg-[size:48px_48px]
        opacity-40
        pointer-events-none
      "
      />

      <div className="relative mx-auto max-w-6xl px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Details */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Improve Your Resume
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                With AI Power
              </span>
            </h1>

            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Analyze resumes, improve ATS scores, discover skill gaps, and prepare
              for interviews using state-of-the-art AI. Get hired faster.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="h-3.5 w-3.5" />
                Instant Guest Scan
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Gemini-Powered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                98.5% Accuracy
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background px-8 h-12 rounded-xl transition-all shadow-xl active:scale-95 font-semibold">
                  Get Started Free
                </Button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-border bg-card px-8 h-12 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Live ATS Widget */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <Card className="border-border bg-card/40 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden relative p-6 border-zinc-900">
              <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                Try Live ATS Scanner
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Upload your resume PDF or Word file to run an instant analysis.
              </p>

              {!analysis && !loading && (
                /* 1. Drag & Drop Upload prompt */
                <div className="space-y-4">
                  {!file ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                        ${
                          dragActive
                            ? "border-blue-500 bg-blue-500/5"
                            : "border-zinc-800 bg-zinc-950/20 hover:border-zinc-700/80 hover:bg-zinc-900/10"
                        }
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 mb-3">
                        <UploadCloud className="h-6 w-6 text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-300">
                        Drag and drop file here
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        or click to browse local folders
                      </p>
                    </div>
                  ) : (
                    /* File Selected State */
                    <div className="border border-zinc-800 bg-zinc-900/20 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900/60 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="truncate">{error}</span>
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={!file}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-semibold h-11 rounded-xl transition active:scale-98 disabled:opacity-50"
                  >
                    Run Live Scanner
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              )}

              {loading && (
                /* 2. Loading State */
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-zinc-200">Analyzing Resume...</p>
                    <p className="text-xs text-zinc-500">Gemini is parsing formatting and keywords</p>
                  </div>
                </div>
              )}

              {analysis && !loading && (
                /* 3. Analysis Success State */
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center gap-5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900/80">
                    {/* Circle SVG */}
                    <div className="relative h-20 w-20 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          className="text-zinc-800"
                          strokeWidth="6"
                          stroke="currentColor"
                          fill="transparent"
                          r={radius}
                          cx="40"
                          cy="40"
                        />
                        <circle
                          className={`transition-all duration-1000 ease-out ${
                            score >= 80 
                              ? "text-emerald-500" 
                              : score >= 60 
                              ? "text-amber-500" 
                              : "text-rose-500"
                          }`}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r={radius}
                          cx="40"
                          cy="40"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-lg font-black text-foreground leading-none">{score}%</span>
                        <span className="text-[8px] uppercase tracking-wide text-zinc-500">ATS</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-foreground">
                        {score >= 80 ? "Strong Compatibility" : score >= 60 ? "Moderate Compatibility" : "Optimization Required"}
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Gemini has evaluated your compatibility score. Create an account to access the complete list of structural gaps and suggestions.
                      </p>
                    </div>
                  </div>

                  {/* Sample Gaps and Strengths */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[11px] leading-relaxed">
                      <p className="font-bold text-emerald-400 flex items-center gap-1 mb-1.5 uppercase tracking-wide text-[9px]">
                        <CheckCircle2 className="h-3 w-3" />
                        Sample Strength
                      </p>
                      <span className="text-zinc-300 font-medium line-clamp-2">
                        {analysis.strengths?.[0] || "Found valid contact info"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 text-[11px] leading-relaxed">
                      <p className="font-bold text-rose-400 flex items-center gap-1 mb-1.5 uppercase tracking-wide text-[9px]">
                        <AlertTriangle className="h-3 w-3" />
                        Sample Gap
                      </p>
                      <span className="text-zinc-300 font-medium line-clamp-2">
                        {analysis.weaknesses?.[0] || "Format needs refinement"}
                      </span>
                    </div>
                  </div>

                  {/* Signup conversion CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
                    <Button
                      onClick={handleRemoveFile}
                      variant="outline"
                      className="w-full sm:w-1/3 border-zinc-800 text-zinc-300 hover:bg-zinc-900 h-11 text-xs rounded-xl"
                    >
                      Reset
                    </Button>
                    <Link href={`/register?atsScore=${score}`} className="w-full sm:w-2/3">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/25">
                        Save Report & Sign Up
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
