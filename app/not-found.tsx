import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          data-testid="not-found"
          className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-3xl font-black">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Page or Product Not Found
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              The product or page you are looking for does not exist or has been removed.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-2.5 shadow-lg shadow-indigo-600/25 transition-all">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
