import React from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header with Navigation */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              NexusStore
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/login" data-testid="btn-login">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                Login
              </Button>
            </Link>

            <Link href="/register" data-testid="btn-register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
                Register
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Banner Section */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Featured Products
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Explore our handpicked collection of high-performance tech gadgets and accessories.
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
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} NexusStore. Built with Next.js & ShadCN UI.</p>
        </div>
      </footer>
    </div>
  );
}