"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Star, MessageSquare, LogIn } from "lucide-react";
import { Review } from "@/lib/reviews";
import { ReviewsProvider, useReviews } from "@/contexts/ReviewsContext";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewForm } from "./ReviewForm";
import { ReviewItem } from "./ReviewItem";
import { Button } from "@/components/ui/button";

interface ReviewsSectionProps {
  productId: number;
  initialReviews: Review[];
}

function ReviewsContent({ productId }: { productId: number }) {
  const { user } = useAuth();
  const { reviews, myReview } = useReviews();

  const count = reviews.length;
  const average = useMemo(() => {
    if (count === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / count) * 10) / 10;
  }, [reviews, count]);

  return (
    <div className="space-y-8 mt-12 pt-10 border-t border-white/10">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              <span>Customer Reviews</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Real feedback and ratings submitted by verified customers.
          </p>
        </div>

        {/* Rating Average & Count Box */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              {/* Plain number without stars inside so automated test scripts can parse it */}
              <span
                data-testid="rating-average"
                className="text-3xl font-black text-white"
              >
                {average}
              </span>
              <span className="text-xs text-slate-400">/ 5</span>
            </div>
            <div className="text-xs text-slate-400">
              <span data-testid="review-count" className="font-bold text-white">
                {count}
              </span>{" "}
              {count === 1 ? "review" : "reviews"}
            </div>
          </div>

          <div className="flex flex-col items-center border-l border-white/10 pl-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(average)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Overall Rating
            </span>
          </div>
        </div>
      </div>

      {/* Write Review Form or Logged-out Banner */}
      <div>
        {!user ? (
          /* Logged out: link-login-to-review to /login */
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Want to share your experience?</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Sign in with your account to rate this product and post your personal review.
              </p>
            </div>
            <Link
              href="/login"
              data-testid="link-login-to-review"
              className="inline-block mt-2"
            >
              <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold px-5 py-2 h-auto text-xs rounded-xl shadow-lg shadow-indigo-600/25">
                Log in to review
              </Button>
            </Link>
          </div>
        ) : !myReview ? (
          /* Logged in and no review yet: show new review form */
          <ReviewForm productId={productId} />
        ) : (
          /* Logged in and already reviewed: notice that review is already posted */
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between">
            <span>You have already submitted a review for this product. You can edit or delete it below.</span>
          </div>
        )}
      </div>

      {/* Review List or Empty State */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">
          All Reviews ({count})
        </h3>

        {reviews.length === 0 ? (
          /* Empty state: with no reviews show reviews-empty and no review-item */
          <div
            data-testid="reviews-empty"
            className="p-10 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md text-center space-y-2 text-slate-400"
          >
            <p className="text-base font-semibold text-white">No reviews yet</p>
            <p className="text-xs text-slate-400">
              Be the first to share what you think about this product!
            </p>
          </div>
        ) : (
          /* Reviews List */
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ReviewsSection({
  productId,
  initialReviews,
}: ReviewsSectionProps) {
  return (
    <ReviewsProvider productId={productId} initialReviews={initialReviews}>
      <ReviewsContent productId={productId} />
    </ReviewsProvider>
  );
}

export default ReviewsSection;
