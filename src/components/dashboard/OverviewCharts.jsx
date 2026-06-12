"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { UploadCloud, FileText, CheckCircle2, Trash2, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function OverviewCharts({ resumes = [] }) {
  const router = useRouter();
  const [statusText, setStatusText] = useState("");
  // Dynamic peak score
  const maxAtsScore = resumes.length
    ? Math.max(...resumes.map(r => r.atsScore || 0))
    : 0;

  const radialData = [
    {
      name: "Score",
      value: maxAtsScore,
      fill: "#6366f1",
    },
  ];

  // Dynamic progress history (sorted by date ascending)
  const sortedResumes = [...resumes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const scanData = sortedResumes.length > 0
    ? sortedResumes.map((r, index) => ({
        name: r.fileName.length > 10 ? r.fileName.substring(0, 8) + ".." : r.fileName,
        score: r.atsScore || 0,
      }))
    : [
        { name: "No Data", score: 0 }
      ];

  // Score status categorization
  let scoreStatus = "N/A";
  if (maxAtsScore >= 80) scoreStatus = "Excellent";
  else if (maxAtsScore >= 60) scoreStatus = "Good";
  else if (maxAtsScore > 0) scoreStatus = "Improving";

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
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
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        droppedFile.name.endsWith(".doc") ||
        droppedFile.name.endsWith(".docx") ||
        droppedFile.name.endsWith(".pdf")
      ) {
        setFile(droppedFile);
        setSuccess(false);
        setError("");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
      setError("");
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setError("");
      setSuccess(false);
      setStatusText("Uploading and analyzing resume with AI...");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setStatusText("Analysis completed successfully!");
        router.refresh();
      } else {
        setError(data.error || "Failed to upload and analyze resume.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Failed to complete file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setSuccess(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 mt-10">
      {/* File Upload Widget */}
      <Card className="lg:col-span-1 bg-zinc-950/40 border-zinc-900 rounded-xl relative overflow-hidden flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Upload Resume</CardTitle>
            <CardDescription className="text-zinc-500">
              PDF or DOCX formats only. Max size 5MB.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
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
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-zinc-300">
                  Drag and drop your file here
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  or click to browse from folder
                </p>
              </div>
            ) : (
              <div className="border border-zinc-800 bg-zinc-900/20 rounded-xl p-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
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
                  {!uploading && !success && (
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900/60 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-xs text-rose-450 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span className="truncate">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{statusText || "Analysis completed successfully!"}</span>
                  </div>
                )}

                {!success && (
                  <Button
                    onClick={handleUploadSubmit}
                    disabled={uploading}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-semibold h-10 rounded-lg transition active:scale-98"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {statusText || "Analyzing..."}
                      </>
                    ) : (
                      <>
                        Analyze Resume
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}

                {success && (
                  <Button
                    onClick={handleRemoveFile}
                    variant="outline"
                    className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 h-10 rounded-lg"
                  >
                    Upload Another
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Score Radial Chart */}
      <Card className="lg:col-span-1 bg-zinc-950/40 border-zinc-900 rounded-xl relative overflow-hidden flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Target ATS Score</CardTitle>
          <CardDescription className="text-zinc-500">
            Current peak match rating.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center relative pb-6">
          <div className="relative h-44 w-44">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                barSize={10}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: "#18181b" }}
                  dataKey="value"
                  cornerRadius={5}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-foreground">{maxAtsScore}%</span>
              <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-0.5">
                {scoreStatus}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 text-center mt-4 max-w-xs px-2">
            {maxAtsScore > 0
              ? `Your peak score is ${maxAtsScore}%. Optimize formatting gaps to reach 95%.`
              : "Upload a resume to calculate your peak match rating."}
          </p>
        </CardContent>
      </Card>

      {/* Score Area Chart */}
      <Card className="lg:col-span-1 bg-zinc-950/40 border-zinc-900 rounded-xl relative overflow-hidden flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Progress History</CardTitle>
          <CardDescription className="text-zinc-500">
            ATS Score improvement over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-44 pb-6 relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
              data={scanData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                domain={[0, 100]}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  color: "var(--popover-foreground)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#scoreColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
