import React from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-48 left-10 w-72 h-72 bg-purple-600/10 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-48 right-10 w-72 h-72 bg-cyan-600/10 blur-3xl pointer-events-none -z-10"></div>

      {/* Header with Auth Awareness & Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner Section */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Featured{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
              Products
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Discover NexusStore&apos;s premier collection of cutting-edge technology. Sign in to save items to your cart.
          </p>
        </div>

        {/* Product Grid - Responsive: 1 col on mobile, 2 on tablet, 3 on desktop, 3 on xl */}
        <div
          data-testid="product-list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950/80 border-t border-white/10 py-8 text-center text-sm text-slate-500 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} NexusStore. Built with Next.js, ShadCN UI & Supabase Authentication.</p>
        </div>
      </footer>
    </div>
  );
}