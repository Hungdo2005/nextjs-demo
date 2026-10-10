import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { CategorySelect } from "@/components/CategorySelect";
import { Button } from "@/components/ui/button";

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

// Server Component: Driven by URL searchParams
export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;

  const queryText = (q || "").trim().toLowerCase();
  const selectedCategory = (category || "").trim().toLowerCase();

  // Extract unique categories for the select dropdown
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products based on searchParams
  let filteredProducts = [...products];

  if (queryText) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(queryText) ||
        p.description.toLowerCase().includes(queryText)
    );
  }

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === selectedCategory
    );
  }

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
            Discover NexusStore&apos;s premier collection of cutting-edge technology. Sign in to save items to your favorites and cart.
          </p>
        </div>

        {/* URL-driven Search & Category Filter Form */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
          <form
            method="get"
            action="/"
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                name="q"
                data-testid="search-input"
                defaultValue={q || ""}
                placeholder="Search products by name or description..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {/* Category Select Dropdown (Auto-submits on change) */}
            <div className="sm:w-52">
              <CategorySelect
                defaultValue={category || ""}
                categories={categories}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              data-testid="btn-search"
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold px-6 py-2.5 h-auto rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Search
            </Button>

            {/* Clear Filter Link if active */}
            {(q || category) && (
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-white underline text-center sm:text-left self-center"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Product Grid or No-Results Empty State */}
        {filteredProducts.length === 0 ? (
          <div
            data-testid="no-results"
            className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-sm space-y-4 my-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 text-2xl">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                We couldn&apos;t find any items matching &ldquo;{q || category}&rdquo;. Try another keyword or reset the filters.
              </p>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white mt-2"
              >
                Clear all filters
              </Button>
            </Link>
          </div>
        ) : (
          <div
            data-testid="product-list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
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