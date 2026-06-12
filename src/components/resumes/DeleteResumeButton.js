"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteResumeButton({ resumeId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this resume? This action cannot be undone.");

    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast("Resume deleted successfully!", "success");
        router.refresh();
      } else {
        toast(data.error || "Failed to delete resume", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while deleting the resume", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDelete}
      disabled={loading}
      className="border-zinc-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 flex items-center gap-1.5 transition duration-200"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      <span>Delete</span>
    </Button>
  );
}
