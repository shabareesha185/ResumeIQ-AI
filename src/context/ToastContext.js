"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Global Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((t) => {
          let typeClasses = "bg-zinc-950/90 border-zinc-800 text-zinc-200";
          let Icon = Info;
          let iconColor = "text-indigo-400";

          if (t.type === "success") {
            typeClasses = "bg-emerald-950/80 border-emerald-800/40 text-emerald-100 dark:bg-emerald-950/90";
            Icon = CheckCircle2;
            iconColor = "text-emerald-400";
          } else if (t.type === "error") {
            typeClasses = "bg-rose-950/80 border-rose-800/40 text-rose-100 dark:bg-rose-950/90";
            Icon = AlertTriangle;
            iconColor = "text-rose-450";
          }

          return (
            <div
              key={t.id}
              className={`
                pointer-events-auto border rounded-xl p-4 shadow-2xl backdrop-blur-md
                flex items-start gap-3 transition-all duration-300 animate-slide-in-right
                ${typeClasses}
              `}
              style={{
                animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {t.message}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
