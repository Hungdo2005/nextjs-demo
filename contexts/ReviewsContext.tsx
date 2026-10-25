"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Review } from "@/lib/reviews";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";

// Reducer Action Types
export type ReviewsAction =
  | { type: "SET"; payload: Review[] }
  | { type: "ADD"; payload: Review }
  | { type: "UPDATE"; payload: Review }
  | { type: "REMOVE"; payload: number };

// Reducer function managing reviews state
export function reviewsReducer(
  state: Review[],
  action: ReviewsAction
): Review[] {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      if (state.some((r) => r.id === action.payload.id)) {
        return state;
      }
      return [action.payload, ...state];
    case "UPDATE":
      return state.map((r) =>
        r.id === action.payload.id ? { ...r, ...action.payload } : r
      );
    case "REMOVE":
      return state.filter((r) => r.id !== action.payload);
    default:
      return state;
  }
}

export interface ReviewsContextType {
  reviews: Review[];
  myReview: Review | null;
  submitReview: (
    rating: number,
    comment: string
  ) => Promise<{ data?: Review; error?: string }>;
  updateReview: (
    rating: number,
    comment: string
  ) => Promise<{ data?: Review; error?: string }>;
  deleteReview: () => Promise<{ error?: string }>;
}

export const ReviewsContext = createContext<ReviewsContextType | undefined>(
  undefined
);

interface ReviewsProviderProps {
  productId: number;
  initialReviews: Review[];
  children: ReactNode;
}

export function ReviewsProvider({
  productId,
  initialReviews,
  children,
}: ReviewsProviderProps) {
  const [reviews, dispatch] = useReducer(reviewsReducer, initialReviews);
  const { user, session } = useAuth();
  const router = useRouter();

  // Sync state if server re-renders with new initialReviews props
  useEffect(() => {
    dispatch({ type: "SET", payload: initialReviews });
  }, [initialReviews]);

  // myReview: the logged-in user's review
  const myReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((r) => r.user_id === user.id) || null;
  }, [user, reviews]);

  // Submit new review through POST /api/reviews
  const submitReview = async (rating: number, comment: string) => {
    try {
      let token = session?.access_token;
      if (!token) {
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token;
      }

      if (!token) {
        return { error: "Please log in to submit a review." };
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        return { error: json.error || "Failed to submit review." };
      }

      dispatch({ type: "ADD", payload: json });
      router.refresh();
      return { data: json };
    } catch (err: any) {
      console.error("submitReview error:", err);
      return { error: err?.message || "Network error submitting review." };
    }
  };

  // Update existing review directly in Supabase (protected by RLS)
  const updateReview = async (rating: number, comment: string) => {
    if (!myReview) {
      return { error: "No review found to update." };
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .update({ rating, comment })
        .eq("id", myReview.id)
        .select("id, user_id, product_id, rating, comment, author, created_at")
        .single();

      if (error) {
        return { error: error.message };
      }

      dispatch({ type: "UPDATE", payload: data as Review });
      router.refresh();
      return { data: data as Review };
    } catch (err: any) {
      console.error("updateReview error:", err);
      return { error: err?.message || "Failed to update review." };
    }
  };

  // Delete review with optimistic update & rollback
  const deleteReview = async () => {
    if (!myReview) {
      return { error: "No review found to delete." };
    }

    const reviewToDelete = myReview;

    // 1. Optimistic dispatch
    dispatch({ type: "REMOVE", payload: reviewToDelete.id });

    // 2. Call Supabase backend
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewToDelete.id);

      if (error) {
        // Rollback on error
        console.error("Supabase delete review error:", error.message);
        dispatch({ type: "ADD", payload: reviewToDelete });
        return { error: error.message };
      }

      router.refresh();
      return {};
    } catch (err: any) {
      // Rollback on network failure
      console.error("deleteReview error:", err);
      dispatch({ type: "ADD", payload: reviewToDelete });
      return { error: err?.message || "Network error deleting review." };
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        myReview,
        submitReview,
        updateReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
