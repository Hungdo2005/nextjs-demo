"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";

// Reducer Action Types
export type FavoritesAction =
  | { type: "SET"; payload: number[] }
  | { type: "ADD"; payload: number }
  | { type: "REMOVE"; payload: number };

// Reducer function managing list of favorite product IDs
export function favoritesReducer(
  state: number[],
  action: FavoritesAction
): number[] {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return state.includes(action.payload)
        ? state
        : [...state, action.payload];
    case "REMOVE":
      return state.filter((id) => id !== action.payload);
    default:
      return state;
  }
}

export interface FavoritesContextType {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
}

export const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);
  const { user } = useAuth();
  const router = useRouter();

  // Automatically sync with Supabase favorites table when user changes
  useEffect(() => {
    let isMounted = true;

    if (user) {
      // User is logged in: load their rows from Supabase
      const loadFavorites = async () => {
        try {
          const { data, error } = await supabase
            .from("favorites")
            .select("product_id");

          if (!error && data && isMounted) {
            const ids = data.map((item: { product_id: number }) => item.product_id);
            dispatch({ type: "SET", payload: ids });
          }
        } catch (err) {
          console.error("Error fetching favorites:", err);
        }
      };

      loadFavorites();
    } else {
      // User is logged out: clear favorites list
      dispatch({ type: "SET", payload: [] });
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isFavorite = (id: number): boolean => {
    return favorites.includes(id);
  };

  const toggleFavorite = async (productId: number): Promise<void> => {
    // If visitor is not logged in: redirect to /login
    if (!user) {
      router.push("/login");
      return;
    }

    const currentlyFavorite = favorites.includes(productId);

    // 1. Optimistic Update (dispatch first for immediate UI response)
    if (currentlyFavorite) {
      dispatch({ type: "REMOVE", payload: productId });
    } else {
      dispatch({ type: "ADD", payload: productId });
    }

    // 2. Call Supabase backend
    try {
      if (currentlyFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("product_id", productId);

        if (error) {
          console.error("Supabase delete favorite error:", error.message);
          // Rollback: re-add to favorites
          dispatch({ type: "ADD", payload: productId });
        }
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ product_id: productId });

        if (error) {
          console.error("Supabase insert favorite error:", error.message);
          // Rollback: re-remove from favorites
          dispatch({ type: "REMOVE", payload: productId });
        }
      }
    } catch (err) {
      console.error("Unexpected error toggling favorite:", err);
      // Rollback on network failure
      if (currentlyFavorite) {
        dispatch({ type: "ADD", payload: productId });
      } else {
        dispatch({ type: "REMOVE", payload: productId });
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
