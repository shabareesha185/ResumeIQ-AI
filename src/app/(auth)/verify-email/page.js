"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Missing token or email parameter.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify email.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred during email verification.");
      }
    }

    verify();
  }, [token, email]);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setResendStatus(null);

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResendStatus({
          type: "success",
          msg: data.message || "A new verification link has been sent to your email.",
        });
      } else {
        setResendStatus({
          type: "error",
          msg: data.message || "Failed to resend verification email.",
        });
      }
    } catch (err) {
      setResendStatus({
        type: "error",
        msg: "Failed to connect to the server.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl text-center relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>ResumeIQ AI Security</span>
      </div>

      {status === "verifying" && (
        <div className="space-y-4 py-6">
          <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center mx-auto text-sky-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Verifying Email...</h2>
          <p className="text-sm text-slate-400">
            Please wait while we validate your verification token.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-5 py-4">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Email Verified!</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
          <div className="pt-4">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium shadow-lg shadow-sky-500/20 transition-all duration-200"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-5 py-4">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <XCircle className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Verification Failed</h2>
          <p className="text-sm text-rose-300/90 bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl break-words">
            {message}
          </p>

          {email && (
            <div className="pt-2 space-y-3">
              <p className="text-xs text-slate-400">
                Need a new verification link sent to <strong className="text-slate-200">{email}</strong>?
              </p>
              <button
                onClick={handleResend}
                disabled={isResending}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm transition-all duration-200 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Sending New Link...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-sky-400" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>

              {resendStatus && (
                <div
                  className={`text-xs p-3 rounded-xl border text-left ${
                    resendStatus.type === "success"
                      ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-300"
                      : "bg-rose-950/40 border-rose-800/40 text-rose-300"
                  }`}
                >
                  {resendStatus.msg}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-800/60">
            <Link
              href="/login"
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium inline-flex items-center gap-1"
            >
              Back to Login Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-400" />
            <p className="mt-2 text-sm">Loading verification system...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
