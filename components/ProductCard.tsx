import React from "react";
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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      data-testid="product-card"
      className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1.5 border-white/10 bg-slate-900/60 backdrop-blur-xl group hover:border-indigo-500/40"
    >
      {/* Product Image Box */}
      <div className="relative w-full aspect-square bg-slate-950/80 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          data-testid="product-image"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60 pointer-events-none"></div>
      </div>

      {/* Header Info */}
      <CardHeader className="p-5 pb-2">
        <CardTitle
          data-testid="product-name"
          className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1"
        >
          {product.name}
        </CardTitle>
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
      <CardFooter className="p-5 pt-0">
        <Button className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-2.5 shadow-md shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all cursor-pointer">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
