import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products } from "@/data/products";
import { Header } from "@/components/Header";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all products at build time
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

// Per-page metadata: <product name> | NexusStore
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const product = products.find((p) => p.id === numericId);

  if (!product) {
    return {
      title: "Product Not Found | NexusStore",
    };
  }

  return {
    title: `${product.name} | NexusStore`,
    description: product.description,
  };
}

// Server Component (No "use client")
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  const product = products.find((p) => p.id === numericId);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Link Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            data-testid="link-back"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Product Detail Container */}
        <div
          data-testid="product-detail"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10 rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl"
        >
          {/* Image Gallery Column */}
          <div className="relative aspect-square rounded-xl bg-slate-950/80 border border-white/5 overflow-hidden flex items-center justify-center p-6 group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            {/* Ambient Image Glow */}
            <div className="absolute inset-0 bg-radial from-indigo-500/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Product Details Info Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Favorite Header */}
              <div className="flex items-center justify-between">
                <span
                  data-testid="detail-category"
                  className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {product.category}
                </span>

                <FavoriteButton
                  productId={product.id}
                  size="lg"
                  className="p-2.5 shadow-md"
                />
              </div>

              {/* Product Title */}
              <h1
                data-testid="detail-name"
                className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug"
              >
                {product.name}
              </h1>

              {/* Product Price */}
              <div
                data-testid="detail-price"
                className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"
              >
                ${product.price.toFixed(2)}
              </div>

              {/* Product Description */}
              <div className="pt-2 border-t border-white/5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Overview
                </h2>
                <p
                  data-testid="detail-description"
                  className="text-sm sm:text-base text-slate-300 leading-relaxed"
                >
                  {product.description}
                </p>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Button className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3 h-auto shadow-lg shadow-indigo-600/30 transition-all cursor-pointer">
                Add to Cart
              </Button>
              <p className="text-xs text-center text-slate-500">
                Free standard shipping & 30-day money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
