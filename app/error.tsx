"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error for observability
    console.error("Application error captured by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans">
      <div
        data-testid="error-boundary"
        className="max-w-md w-full p-8 rounded-2xl bg-slate-900/80 border border-red-500/20 shadow-2xl backdrop-blur-xl text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Something went wrong!
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {error?.message || "An unexpected error occurred while rendering this page."}
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            data-testid="btn-retry"
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold py-2.5 h-auto shadow-lg shadow-red-600/25 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
