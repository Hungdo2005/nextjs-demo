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
      className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-slate-200 bg-white"
    >
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          data-testid="product-image"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      <CardHeader className="p-5 pb-2">
        <CardTitle
          data-testid="product-name"
          className="text-lg font-bold text-slate-900 line-clamp-1"
        >
          {product.name}
        </CardTitle>
        <CardDescription
          data-testid="product-description"
          className="text-sm text-slate-500 line-clamp-2 mt-1 min-h-[2.5rem]"
        >
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0 mt-auto">
        <div
          data-testid="product-price"
          className="text-xl font-extrabold text-indigo-600"
        >
          ${product.price.toFixed(2)}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
