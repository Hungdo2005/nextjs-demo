"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({
  productId,
  className = "",
  size = "md",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(productId);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    await toggleFavorite(productId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      type="button"
      data-testid="btn-favorite"
      aria-pressed={isFav ? "true" : "false"}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
        isFav
          ? "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 border border-rose-500/40 shadow-sm shadow-rose-500/20"
          : "bg-slate-900/80 text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-white/10"
      } ${isAnimating ? "scale-125" : "hover:scale-105 active:scale-95"} ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-colors duration-200 ${
          isFav ? "fill-rose-500 text-rose-500" : "fill-none"
        }`}
      />
    </button>
  );
}
