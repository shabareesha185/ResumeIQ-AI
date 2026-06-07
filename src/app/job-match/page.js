"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  ArrowRight,
  FileText,
  Lightbulb,
} from "lucide-react";

export default function JobMatchPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fetchingResumes, setFetchingResumes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchData, setMatchData] = useState(null);

  // Fetch user resumes on mount
  useEffect(() => {
    async function fetchResumes() {
      try {
        const response = await fetch("/api/resumes");
        const data = await response.json();
        if (data.success) {
          setResumes(data.resumes || []);
          if (data.resumes && data.resumes.length > 0) {
            setSelectedResumeId(data.resumes[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingResumes(false);
      }
    }
    fetchResumes();
  }, []);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !jobDescription.trim()) return;

    try {
      setLoading(true);
      setError("");
      setMatchData(null);

      const response = await fetch("/api/resumes/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMatchData(data.match);
      } else {
        setError(data.error || "Failed to parse matches. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during comparison.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMatchData(null);
    setJobDescription("");
    setError("");
  };

  // SVG Progress Circle Calculations
  const score = matchData?.score || 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColorClass = "text-rose-500";
  let scoreStatus = "Low Match Rating";
  let scoreTextClass = "text-rose-450";

  if (score >= 80) {
    scoreColorClass = "text-emerald-500";
    scoreStatus = "Excellent Alignment";
    scoreTextClass = "text-emerald-450";
  } else if (score >= 60) {
    scoreColorClass = "text-amber-500";
    scoreStatus = "Moderate Alignment";
    scoreTextClass = "text-amber-450";
  }

  if (fetchingResumes) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <p className="text-sm text-muted-foreground">Loading your resumes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent leading-tight">
          AI Job Match Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Evaluate keyword density and discover skill alignment against targeted roles.
        </p>
      </div>

      {resumes.length === 0 ? (
        /* Empty State */
        <Card className="border-border bg-card/45 backdrop-blur-sm border-dashed border-2 py-16 text-center rounded-2xl max-w-4xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="p-4 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 mb-6">
              <Briefcase className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Resumes Available</h3>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              You must upload a resume before you can perform job matching. Add one to your account now to run matching comparisons.
            </p>
            <Link href="/resumes/upload" className="mt-8">
              <Button className="bg-white hover:bg-zinc-200 text-black font-semibold h-11 px-6 rounded-xl transition duration-200 flex items-center gap-2 group">
                Upload First Resume
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Core UI Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selector Form */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/60 pb-5">
                <CardTitle className="text-lg font-bold text-foreground">Configuration</CardTitle>
                <CardDescription className="text-muted-foreground">Select a resume and copy-paste the target job description.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <form onSubmit={handleCompare} className="space-y-5">
                  {/* Dropdown resume selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                      Choose Resume
                    </label>
                    <div className="relative">
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full h-11 border border-border bg-zinc-900/30 text-zinc-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                        disabled={loading}
                      >
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id} className="bg-zinc-950 text-zinc-100">
                            {r.fileName} (ATS: {r.atsScore}%)
                          </option>
                        ))}
                      </select>
                      <FileText className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Textarea job description */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                      Job Description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      required
                      placeholder="Paste the target role responsibilities, requirements, and keywords here..."
                      className="w-full min-h-[300px] border border-border bg-zinc-900/30 text-zinc-100 placeholder-zinc-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-y"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {matchData && (
                      <Button
                        type="button"
                        onClick={handleReset}
                        variant="outline"
                        className="w-1/3 border-border hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground h-11 rounded-xl"
                        disabled={loading}
                      >
                        Reset Form
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={loading || !jobDescription.trim()}
                      className={`h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition duration-200 active:scale-98 ${
                        matchData ? "w-2/3" : "w-full"
                      } bg-white hover:bg-zinc-200 text-black`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          Analyzing Match...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                          Compare Resume
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Comparison Results */}
          <div className="lg:col-span-6">
            {!matchData && !loading ? (
              /* Waiting state placeholder */
              <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl h-[530px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2">
                <div className="p-4 rounded-full bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-foreground">Waiting for Input</h3>
                <p className="text-xs text-muted-foreground max-w-xs mt-2 leading-relaxed">
                  Select your resume, paste the job posting requirements, and run the comparison scanner to evaluate keyword compatibility.
                </p>
              </Card>
            ) : loading ? (
              /* Loading screen state */
              <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl h-[530px] flex flex-col items-center justify-center text-center p-8">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Running Comparison Scanner</h3>
                <p className="text-xs text-muted-foreground max-w-xs mt-2 leading-relaxed">
                  Gemini is parsing critical job requirements and evaluating alignment ratios...
                </p>
              </Card>
            ) : (
              /* Success results presentation */
              <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden animate-fade-in">
                <CardHeader className="border-b border-border/60 pb-5">
                  <CardTitle className="text-lg font-bold text-foreground">Alignment Scorecard</CardTitle>
                  <CardDescription className="text-muted-foreground">Detailed evaluation of keywords and keyword gaps.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Circular progress with stats */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-center sm:justify-start pb-6 border-b border-border/60">
                    <div className="relative h-28 w-28 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          className="text-zinc-800"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r={radius}
                          cx="56"
                          cy="56"
                        />
                        <circle
                          className={`transition-all duration-1000 ease-out ${scoreColorClass}`}
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r={radius}
                          cx="56"
                          cy="56"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-black text-foreground">{score}%</span>
                        <span className="text-[9px] uppercase tracking-wide text-zinc-500 font-bold">Match</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Compatibility status</span>
                      <h4 className={`text-xl font-bold ${scoreTextClass}`}>{scoreStatus}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                        {score >= 80 
                          ? "Outstanding match! Your experience and skills closely align with the targeted job parameters." 
                          : score >= 60 
                          ? "Good foundational alignment. Resolving the identified keyword gaps will significantly improve chances." 
                          : "High mismatch risk. We strongly recommend updates to integrate critical keywords and close skill voids."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Keywords Comparison lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Matching keywords */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Matching Skills & Keywords
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {matchData.matchingKeywords && matchData.matchingKeywords.length > 0 ? (
                          matchData.matchingKeywords.map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No matching keywords parsed.</span>
                        )}
                      </div>
                    </div>

                    {/* Missing keywords */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Missing Skills & Keywords
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {matchData.missingKeywords && matchData.missingKeywords.length > 0 ? (
                          matchData.missingKeywords.map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No missing keywords identified.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Alignment Action plan */}
                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                      <Lightbulb className="h-3.5 w-3.5 animate-pulse" />
                      ATS Alignment Recommendations
                    </p>
                    <ul className="space-y-3.5">
                      {matchData.recommendations && matchData.recommendations.length > 0 ? (
                        matchData.recommendations.map((item, index) => (
                          <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                            <span className="h-4 w-4 shrink-0 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[9px]">
                              {index + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No specific updates recommended.</p>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
