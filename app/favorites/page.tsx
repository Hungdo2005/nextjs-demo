"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { products } from "@/data/products";
import { Header } from "@/components/Header";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { favorites } = useFavorites();

  // Route protection: redirect to /login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // While checking session loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3.5">
          <div className="w-9 h-9 border-3 border-indigo-500 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium tracking-wide">
            Loading your favorites...
          </p>
        </div>
      </div>
    );
  }

  // If visitor is logged out (while router.replace executes)
  if (!user) {
    return null;
  }

  // Get full product objects for all favorited IDs
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-rose-600/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div data-testid="favorites-page" className="space-y-8">
          {/* Header Banner */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                <span>
                  My <span className="bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">Favorites</span>
                </span>
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Your saved wishlist synced securely with Supabase Row Level Security.
              </p>
            </div>

            <Link href="/">
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                ← Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Favorites List or Empty State */}
          {favoriteProducts.length === 0 ? (
            <div
              data-testid="favorites-empty"
              className="flex flex-col items-center justify-center p-12 sm:p-16 text-center rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md space-y-5 my-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h2 className="text-xl font-bold text-white">Your favorites list is empty</h2>
                <p className="text-sm text-slate-400">
                  You haven&apos;t added any products to your favorites yet. Click the heart icon on any product to save it here.
                </p>
              </div>
              <Link href="/">
                <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold px-6 py-2.5 h-auto rounded-xl shadow-lg shadow-indigo-600/25">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  data-testid="favorite-item"
                  className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 flex flex-col justify-between hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group relative"
                >
                  <div className="flex gap-4 items-start">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${product.id}`}
                      data-testid="link-detail"
                      className="w-24 h-24 rounded-xl bg-slate-950/80 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center p-2"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                        {product.category}
                      </span>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="text-lg font-black text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Favorite Remove Button */}
                    <FavoriteButton productId={product.id} size="md" />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex gap-2">
                    <Link href={`/products/${product.id}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white text-xs h-9"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
