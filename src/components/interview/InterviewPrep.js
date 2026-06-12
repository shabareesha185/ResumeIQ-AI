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
  ArrowLeft,
  FileText,
  Lightbulb,
  MessageSquare,
  Award,
  BookOpen,
  ChevronRight,
  Eye,
  Star,
  RefreshCw,
  ThumbsUp,
  X
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function InterviewPrep({ initialResumes = [] }) {
  const { toast } = useToast();
  const [resumes] = useState(initialResumes);
  
  // Setup state
  const [selectedResumeId, setSelectedResumeId] = useState(
    initialResumes.length > 0 ? initialResumes[0]._id : ""
  );
  const [jobDescription, setJobDescription] = useState("");
  const [focusArea, setFocusArea] = useState("Mixed");

  // Interaction State
  const [step, setStep] = useState("setup"); // 'setup' | 'practice'
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [index]: "string" }
  const [evaluations, setEvaluations] = useState({}); // { [index]: evaluationObject }
  const [revealedSuggestions, setRevealedSuggestions] = useState({}); // { [index]: boolean }

  // Loaders
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast("Please select a resume first.", "error");
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobDescription,
          focusArea,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setQuestions(data.questions || []);
        setActiveQuestionIndex(0);
        setAnswers({});
        setEvaluations({});
        setRevealedSuggestions({});
        setStep("practice");
        toast("Mock interview session generated! Good luck.", "success");
      } else {
        toast(data.error || "Failed to generate questions. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An unexpected error occurred while generating questions.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleEvaluate = async () => {
    const activeQuestion = questions[activeQuestionIndex];
    const currentAnswer = answers[activeQuestionIndex] || "";

    try {
      setEvaluating(true);
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          question: activeQuestion.question,
          userAnswer: currentAnswer,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEvaluations((prev) => ({
          ...prev,
          [activeQuestionIndex]: data.evaluation,
        }));
        toast("Answer evaluated successfully!", "success");
      } else {
        toast(data.error || "Failed to evaluate answer. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An unexpected error occurred during evaluation.", "error");
    } finally {
      setEvaluating(false);
    }
  };

  const toggleRevealSuggestion = () => {
    setRevealedSuggestions((prev) => ({
      ...prev,
      [activeQuestionIndex]: !prev[activeQuestionIndex],
    }));
  };

  const handleReset = () => {
    setStep("setup");
    setQuestions([]);
    setActiveQuestionIndex(0);
    setAnswers({});
    setEvaluations({});
    setRevealedSuggestions({});
  };

  const focusAreas = [
    { name: "Mixed", description: "A balanced mix of technical, behavioral, and resume-specific questions." },
    { name: "Behavioral", description: "Focused on soft skills, leadership, conflict resolution, and teamwork using STAR structure." },
    { name: "Technical", description: "Focused on core programming principles, system design, databases, and problem solving." },
    { name: "Resume-Specific", description: "Probing questions directly referencing your stated projects, roles, and accomplishments." },
  ];

  if (resumes.length === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto relative">
        <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent">
            Mock Interview Prep
          </h1>
          <p className="text-muted-foreground mt-2">
            Practice customized interview questions tailored to your experience and target job.
          </p>
        </div>

        <Card className="border-border bg-card/45 backdrop-blur-sm border-dashed border-2 py-16 text-center rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="p-4 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 mb-6">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Resumes Found</h3>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              You must upload a resume before starting an interview prep session. AI analyzes your resume text to tailor specific, relevant questions.
            </p>
            <Link href="/resumes/upload" className="mt-8">
              <Button className="bg-white hover:bg-zinc-200 text-black font-semibold h-11 px-6 rounded-xl transition duration-200 flex items-center gap-2 group">
                Upload Resume
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Decorative Glow */}
      <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {step === "setup" ? (
        /* SETUP WORKSPACE */
        <div className="space-y-8 max-w-4xl mx-auto">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent leading-tight">
              Mock Interview Practice
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate tailored interview questions based on your resume and target job requirements.
            </p>
          </div>

          <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="border-b border-border/60 pb-5">
              <CardTitle className="text-xl font-bold text-foreground">Prep Session Configurator</CardTitle>
              <CardDescription className="text-muted-foreground">Select configuration options to construct your custom mock panel.</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                
                {/* Resume Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                    Select Resume Source
                  </label>
                  <div className="relative">
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full h-11 border border-border bg-zinc-900/30 text-zinc-150 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                      disabled={generating}
                    >
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id} className="bg-zinc-950 text-zinc-150">
                          {r.fileName} ({r.analysisCompleted ? `ATS: ${r.atsScore}%` : "Not analyzed"})
                        </option>
                      ))}
                    </select>
                    <FileText className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Target Job Description (Recommended)
                    </label>
                    <span className="text-[10px] text-zinc-500 font-medium bg-zinc-800/40 px-2 py-0.5 rounded-full border border-border/40">Optional</span>
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job requirements, key stack, or overall responsibilities here to generate highly targeted questions..."
                    className="w-full min-h-[150px] border border-border bg-zinc-900/30 text-zinc-150 placeholder-zinc-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-y"
                    disabled={generating}
                  />
                </div>

                {/* Focus Area Selectors */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
                    Question Focus Area
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {focusAreas.map((area) => (
                      <button
                        key={area.name}
                        type="button"
                        onClick={() => setFocusArea(area.name)}
                        className={`text-left p-4 rounded-xl border transition duration-200 cursor-pointer active:scale-[0.99] ${
                          focusArea === area.name
                            ? "bg-zinc-900 border-zinc-350 shadow-md text-zinc-50 dark:bg-zinc-100/10 dark:border-zinc-500"
                            : "bg-zinc-950/20 border-border text-zinc-400 hover:border-zinc-800 hover:bg-zinc-950/40"
                        }`}
                        disabled={generating}
                      >
                        <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          {area.name === "Mixed" && <RefreshCw className="h-4 w-4 text-sky-400" />}
                          {area.name === "Behavioral" && <ThumbsUp className="h-4 w-4 text-emerald-400" />}
                          {area.name === "Technical" && <Sparkles className="h-4 w-4 text-indigo-400" />}
                          {area.name === "Resume-Specific" && <FileText className="h-4 w-4 text-purple-400" />}
                          {area.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {area.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-border/60">
                  <Button
                    type="submit"
                    disabled={generating}
                    className="w-full h-12 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 flex items-center justify-center gap-2 transition duration-200 active:scale-98"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing Resume and Formulating Questions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        Generate 5 Customized Questions
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* INTERACTIVE PRACTICE STATE */
        <div className="space-y-6">
          
          {/* Top Panel Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Session Focus: {focusArea}</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">Mock Interview Workshop</h1>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground flex items-center gap-2 rounded-xl h-10 px-4 shrink-0 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Configure New Session
            </Button>
          </div>

          {/* Main Workspace Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Sidebar Question Navigator (col span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md">
                <CardHeader className="border-b border-border/60 py-4 px-5">
                  <CardTitle className="text-md font-bold text-foreground">Practice Checklist</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Complete and submit responses to trigger evaluation.</CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {questions.map((q, index) => {
                      const isActive = index === activeQuestionIndex;
                      const hasEvaluation = evaluations[index] !== undefined;
                      const score = evaluations[index]?.score;
                      
                      return (
                        <button
                          key={q.id || index}
                          onClick={() => setActiveQuestionIndex(index)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                            isActive
                              ? "bg-zinc-900 border-zinc-350 text-zinc-50 dark:bg-zinc-100/10 dark:border-zinc-500 font-semibold"
                              : "bg-transparent border-transparent text-muted-foreground hover:bg-zinc-500/5 hover:text-foreground"
                          }`}
                        >
                          <span className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                            hasEvaluation
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : isActive 
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : "bg-zinc-800/40 text-zinc-500 border border-border"
                          }`}>
                            {index + 1}
                          </span>

                          <div className="flex-1 space-y-1 overflow-hidden">
                            <p className="text-xs truncate font-medium">{q.question}</p>
                            <div className="flex items-center justify-between text-[9px] text-zinc-500 font-medium">
                              <span>{q.type}</span>
                              {hasEvaluation && (
                                <span className={`font-bold px-1.5 py-0.5 rounded-full ${
                                  score >= 80 
                                    ? "bg-emerald-500/10 text-emerald-400" 
                                    : score >= 60 
                                    ? "bg-amber-500/10 text-amber-400" 
                                    : "bg-rose-500/10 text-rose-400"
                                }`}>
                                  Score: {score}%
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight className={`h-4 w-4 shrink-0 self-center text-zinc-500 transition-transform ${
                            isActive ? "translate-x-0.5 opacity-100" : "opacity-0"
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary Metrics Card */}
              <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Session Stats</h4>
                    <p className="text-xs text-muted-foreground">
                      Evaluated: {Object.keys(evaluations).length} / 5 questions
                    </p>
                  </div>
                </div>

                {Object.keys(evaluations).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">Average Score:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {Math.round(
                        Object.values(evaluations).reduce((sum, e) => sum + e.score, 0) / Object.keys(evaluations).length
                      )}%
                    </span>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column: Q&A workspace panel (col span 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active Question detail */}
              <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Question {activeQuestionIndex + 1} &bull; {questions[activeQuestionIndex]?.type}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground mt-3 leading-relaxed">
                    {questions[activeQuestionIndex]?.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5 pt-1">
                  <div className="rounded-xl bg-zinc-950/20 border border-border/50 p-4 flex gap-3">
                    <Lightbulb className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Recruiter Rationale</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {questions[activeQuestionIndex]?.rationale}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Input and actions */}
              <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
                <CardContent className="pt-6 space-y-5">
                  
                  {/* Practice Answer Area */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pl-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Your Practice Response
                      </label>
                      <span className="text-[10px] text-zinc-500 font-medium">Use STAR Structure</span>
                    </div>
                    <textarea
                      value={answers[activeQuestionIndex] || ""}
                      onChange={(e) => setAnswers((prev) => ({
                        ...prev,
                        [activeQuestionIndex]: e.target.value,
                      }))}
                      placeholder="Draft your verbal answer here... Highlight your specific contribution and metrics from your resume."
                      className="w-full min-h-[180px] border border-border bg-zinc-900/30 text-zinc-150 placeholder-zinc-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-y leading-relaxed"
                      disabled={evaluating}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={toggleRevealSuggestion}
                      variant="outline"
                      className="flex-1 min-w-[150px] border-border hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground h-11 rounded-xl flex items-center justify-center gap-2 transition"
                      disabled={evaluating}
                    >
                      <BookOpen className="h-4.5 w-4.5 text-zinc-400" />
                      {revealedSuggestions[activeQuestionIndex] ? "Hide Guide Model" : "Reveal Suggested Answer"}
                    </Button>

                    <Button
                      onClick={handleEvaluate}
                      disabled={evaluating || !(answers[activeQuestionIndex] || "").trim()}
                      className="flex-2 min-w-[200px] bg-white hover:bg-zinc-200 text-black font-semibold h-11 rounded-xl flex items-center justify-center gap-2 transition duration-200 active:scale-98"
                    >
                      {evaluating ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          Evaluating response...
                        </>
                      ) : (
                        <>
                          <Award className="h-4.5 w-4.5 text-indigo-500" />
                          Submit Response for AI Score
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Suggested Answer Guideline */}
                  {revealedSuggestions[activeQuestionIndex] && (
                    <div className="mt-4 border border-border/80 rounded-xl bg-zinc-950/20 overflow-hidden animate-fade-in">
                      <div className="border-b border-border/60 bg-zinc-950/40 p-3.5 flex justify-between items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4" />
                          Ideal Model Response (Resume Aligned)
                        </p>
                        <button
                          onClick={toggleRevealSuggestion}
                          className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-zinc-300 leading-relaxed italic">
                          &ldquo;{questions[activeQuestionIndex]?.suggestedAnswer}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* Evaluation Panel */}
              {evaluations[activeQuestionIndex] && (
                <Card className="border-border bg-card/45 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl animate-fade-in-up border-t-2 border-t-emerald-500">
                  <CardHeader className="border-b border-border/60 pb-4">
                    <CardTitle className="text-md font-bold text-foreground">AI Critique & Score</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Constructive analysis of your practice response metrics.</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    {/* Score section */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 justify-center sm:justify-start pb-5 border-b border-border/60">
                      
                      <div className={`h-20 w-20 shrink-0 rounded-xl border flex flex-col items-center justify-center text-2xl font-black shadow-md ${
                        evaluations[activeQuestionIndex].score >= 80
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : evaluations[activeQuestionIndex].score >= 60
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          : "text-rose-450 bg-rose-500/10 border-rose-500/20"
                      }`}>
                        <span>{evaluations[activeQuestionIndex].score}%</span>
                        <span className="text-[8px] uppercase tracking-wider mt-0.5 font-bold">Grade</span>
                      </div>

                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-bold text-sm text-foreground">Constructive Critique</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                          {evaluations[activeQuestionIndex].feedback}
                        </p>
                      </div>

                    </div>

                    {/* Strengths & Gaps lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Strengths */}
                      <div className="space-y-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Response Strengths
                        </p>
                        <ul className="space-y-2">
                          {evaluations[activeQuestionIndex].strengths?.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                              <span className="text-emerald-400 shrink-0 mt-0.5">&bull;</span>
                              <span>{str}</span>
                            </li>
                          ))}
                          {(!evaluations[activeQuestionIndex].strengths || evaluations[activeQuestionIndex].strengths.length === 0) && (
                            <span className="text-xs text-zinc-500 italic">No specific strengths parsed.</span>
                          )}
                        </ul>
                      </div>

                      {/* Gaps */}
                      <div className="space-y-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Constructive Skill Gaps
                        </p>
                        <ul className="space-y-2">
                          {evaluations[activeQuestionIndex].gaps?.map((gap, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                              <span className="text-rose-400 shrink-0 mt-0.5">&bull;</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                          {(!evaluations[activeQuestionIndex].gaps || evaluations[activeQuestionIndex].gaps.length === 0) && (
                            <span className="text-xs text-zinc-500 italic">No critical gaps identified.</span>
                          )}
                        </ul>
                      </div>

                    </div>

                    {/* Improved STAR Version */}
                    <div className="pt-4 border-t border-border/60 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        AI Re-drafted Answer (STAR-structured)
                      </p>
                      <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4">
                        <p className="text-xs text-zinc-200 leading-relaxed italic">
                          &ldquo;{evaluations[activeQuestionIndex].improvedAnswer}&rdquo;
                        </p>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* Navigator Bottom Buttons */}
              <div className="flex justify-between items-center pt-2">
                <Button
                  onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeQuestionIndex === 0}
                  variant="outline"
                  className="border-border hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground h-9 px-3 rounded-lg flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>

                <span className="text-xs text-zinc-400 font-semibold">
                  {activeQuestionIndex + 1} of 5 Questions
                </span>

                <Button
                  onClick={() => setActiveQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={activeQuestionIndex === questions.length - 1}
                  variant="outline"
                  className="border-border hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground h-9 px-3 rounded-lg flex items-center gap-1"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
