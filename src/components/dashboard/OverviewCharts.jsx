"use client";

import { useState, useRef } from "react";
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
import { UploadCloud, FileText, CheckCircle2, Trash2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock history of resume scans
const scanData = [
  { name: "Scan 1", score: 45 },
  { name: "Scan 2", score: 58 },
  { name: "Scan 3", score: 72 },
  { name: "Scan 4", score: 85 },
];

// Radial chart data for current ATS score
const radialData = [
  {
    name: "Score",
    value: 85,
    fill: "#6366f1",
  },
];

export default function OverviewCharts() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
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
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile);
        setSuccess(false);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
    }
  };

  const handleUploadSubmit = () => {
    if (!file) return;
    setUploading(true);
    
    // Simulate upload progress
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 mt-10">
      {/* File Upload Widget */}
      <Card className="lg:col-span-1 bg-zinc-950/40 border-zinc-900 rounded-xl relative overflow-hidden flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Upload Resume</CardTitle>
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

                {success && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Upload succeeded! Analyzing in background.</span>
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
                        Analyzing...
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
          <CardTitle className="text-lg font-semibold text-white">Target ATS Score</CardTitle>
          <CardDescription className="text-zinc-500">
            Current peak match rating.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center relative pb-6">
          <div className="relative h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
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
              <span className="text-4xl font-extrabold text-white">85%</span>
              <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-0.5">
                Excellent
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 text-center mt-4 max-w-xs px-2">
            Your score matches 85% of standard ATS scanner guidelines. Fix formatting gaps to reach 95%.
          </p>
        </CardContent>
      </Card>

      {/* Score Area Chart */}
      <Card className="lg:col-span-1 bg-zinc-950/40 border-zinc-900 rounded-xl relative overflow-hidden flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Progress History</CardTitle>
          <CardDescription className="text-zinc-500">
            ATS Score improvement over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-44 pb-6">
          <ResponsiveContainer width="100%" height="100%">
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
                  backgroundColor: "#09090b",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                  color: "#fff",
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
