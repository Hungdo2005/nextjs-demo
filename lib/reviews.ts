import { supabase } from "./supabaseClient";

export interface Review {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  comment: string;
  author: string;
  created_at: string;
}

export interface ProductReviewsData {
  average: number;
  count: number;
  reviews: Review[];
}

export async function getProductReviews(productId: number): Promise<ProductReviewsData> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, user_id, product_id, rating, comment, author, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching reviews for product", productId, error?.message);
      return { average: 0, count: 0, reviews: [] };
    }

    const reviews = data as Review[];
    const count = reviews.length;

    if (count === 0) {
      return { average: 0, count: 0, reviews: [] };
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = Math.round((total / count) * 10) / 10;

    return {
      average,
      count,
      reviews,
    };
  } catch (err) {
    console.error("Unexpected error in getProductReviews:", err);
    return { average: 0, count: 0, reviews: [] };
  }
}
