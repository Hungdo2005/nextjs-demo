import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      data-testid="product-card"
      className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1.5 border-white/10 bg-slate-900/60 backdrop-blur-xl group hover:border-indigo-500/40 relative"
    >
      {/* Top Favorite Button overlay */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton productId={product.id} size="md" className="p-2 shadow-lg backdrop-blur-md" />
      </div>

      {/* Category Pill overlay */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-slate-950/80 border border-white/10 text-cyan-300 backdrop-blur-md">
          {product.category}
        </span>
      </div>

      {/* Product Image Box linking to detail */}
      <Link
        href={`/products/${product.id}`}
        data-testid="link-detail"
        className="block relative w-full aspect-square bg-slate-950/80 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          data-testid="product-image"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60 pointer-events-none"></div>
      </Link>

      {/* Header Info */}
      <CardHeader className="p-5 pb-2">
        <Link href={`/products/${product.id}`}>
          <CardTitle
            data-testid="product-name"
            className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription
          data-testid="product-description"
          className="text-sm text-slate-400 line-clamp-2 mt-1 min-h-[2.5rem]"
        >
          {product.description}
        </CardDescription>
      </CardHeader>

      {/* Price */}
      <CardContent className="p-5 pt-0 mt-auto">
        <div
          data-testid="product-price"
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"
        >
          ${product.price.toFixed(2)}
        </div>
      </CardContent>

      {/* Action Button */}
      <CardFooter className="p-5 pt-0 flex gap-2">
        <Link href={`/products/${product.id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-2.5 shadow-md shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all cursor-pointer">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
