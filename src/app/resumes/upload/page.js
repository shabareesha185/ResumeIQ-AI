"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UploadCloud, 
  FileText, 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from "lucide-react";

export default function UploadResumePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (loading) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (loading) return;

    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    // Reset status
    setStatus({ type: null, message: "" });

    // Validate type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const isDoc = fileExtension === "doc" || fileExtension === "docx";
    const isPdf = fileExtension === "pdf";

    if (!validTypes.includes(selectedFile.type) && !isDoc && !isPdf) {
      setStatus({
        type: "error",
        message: "Unsupported file type. Please upload a PDF or Word document (.doc, .docx).",
      });
      return;
    }

    // Validate size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setStatus({
        type: "error",
        message: "File is too large. Maximum file size is 10MB.",
      });
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setStatus({ type: "info", message: "Uploading and running AI ATS analysis..." });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: "Resume uploaded and analyzed successfully! Redirecting...",
        });
        
        setTimeout(() => {
          router.push("/resumes");
          router.refresh();
        }, 1500);
      } else {
        setStatus({
          type: "error",
          message: data.error || "An error occurred during upload or analysis.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Server error. Failed to upload and analyze resume.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">
      {/* Decorative background glow */}
      <div className="absolute top-[-20%] left-[-10%] h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Back button */}
      <div>
        <Link 
          href="/resumes" 
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-50 transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resumes
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-zinc-450 bg-clip-text text-transparent">
          Upload Resume
        </h1>
        <p className="mt-2 text-zinc-400">
          Add a new resume to your portfolio to extract keywords and run ATS compliance scoring.
        </p>
      </div>

      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-sm rounded-2xl overflow-hidden mt-6">
        <CardContent className="p-8 space-y-6">
          {/* Status Message Banners */}
          {status.type && (
            <div className={`p-4 rounded-xl flex items-start gap-3 border text-sm leading-relaxed ${
              status.type === "success" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : status.type === "error" 
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                : "bg-indigo-500/10 text-indigo-450 border-indigo-500/20"
            }`}>
              {status.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              ) : status.type === "error" ? (
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              ) : (
                <Loader2 className="h-5 w-5 shrink-0 mt-0.5 animate-spin" />
              )}
              <div>
                {status.message}
              </div>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onClick={() => !loading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 text-center transition duration-300 cursor-pointer
              ${loading ? "opacity-50 cursor-not-allowed border-zinc-800" : ""}
              ${
                isDragging 
                  ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/30 hover:bg-zinc-900/10"
              }
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />

            {!file ? (
              /* Upload Prompt */
              <div className="space-y-4">
                <div className="mx-auto p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 w-fit transition-transform group-hover:scale-105">
                  <UploadCloud className="h-10 w-10 text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-foreground">
                    Drag and drop file here
                  </p>
                  <p className="text-zinc-400 text-sm">
                    or click to browse your local storage
                  </p>
                </div>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Supports PDF or Word documents (.doc, .docx) up to 10MB
                </p>
              </div>
            ) : (
              /* Selected File Details */
              <div className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-850 bg-zinc-900/40 backdrop-blur-sm max-w-lg mx-auto">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="truncate max-w-[200px] sm:max-w-[280px]">
                    <p className="text-sm font-bold text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {!loading && (
                  <button
                    onClick={removeFile}
                    className="p-1.5 rounded-lg border border-zinc-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/20 transition duration-300 h-11 px-8 rounded-xl disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Resume...
                </>
              ) : (
                "Upload and Analyze"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
