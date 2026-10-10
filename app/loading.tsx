import React from "react";

export default function Loading() {
  return (
    <div
      data-testid="loading"
      className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 font-sans"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-3 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-3 border-cyan-400/20 border-b-cyan-400 animate-spin animate-reverse"></div>
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">
        Loading NexusStore content...
      </p>
    </div>
  );
}
