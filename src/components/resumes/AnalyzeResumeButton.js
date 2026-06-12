"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AnalyzeResumeButton({ resumeId }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  async function handleAnalyze() {
    try {
      setLoading(true);

      const response = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: "POST",
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      toast("ATS Analysis completed successfully!", "success");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast(error.message || "Analysis failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleAnalyze}
      disabled={loading}
      className="w-full border-zinc-800 hover:bg-zinc-900 hover:text-zinc-50 h-11 rounded-xl flex items-center justify-center gap-2 transition duration-200 text-zinc-300"
    >
      <Sparkles className="h-4 w-4 text-indigo-400" />

      {loading ? "Analyzing..." : "Run ATS Analysis"}
    </Button>
  );
}
