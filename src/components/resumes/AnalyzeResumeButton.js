"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AnalyzeResumeButton({ resumeId }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleAnalyze() {
    try {
      setLoading(true);

      const response = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.error);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
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
