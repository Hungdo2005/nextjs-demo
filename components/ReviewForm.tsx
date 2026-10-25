"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Send } from "lucide-react";
import { reviewSchema, ReviewFormData } from "@/lib/reviewSchema";
import { useReviews } from "@/contexts/ReviewsContext";
import { Button } from "@/components/ui/button";

interface ReviewFormProps {
  productId: number;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { submitReview } = useReviews();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product_id: productId,
      rating: undefined,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await submitReview(data.rating, data.comment);

      if (res.error) {
        setServerError(res.error);
      } else {
        setSuccessMessage("Review submitted successfully!");
        reset();
      }
    } catch (err: any) {
      setServerError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <h3 className="text-lg font-bold text-white">Write a Review</h3>
      </div>

      {serverError && (
        <div
          data-testid="error-review"
          className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm font-medium flex items-center gap-2"
        >
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div
          data-testid="review-success"
          className="mb-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-medium flex items-center gap-2"
        >
          <span>{successMessage}</span>
        </div>
      )}

      <form
        noValidate
        data-testid="review-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <input type="hidden" {...register("product_id", { valueAsNumber: true })} value={productId} />

        {/* Rating Select */}
        <div className="space-y-1.5">
          <label htmlFor="input-rating" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Rating (1 - 5 Stars)
          </label>
          <select
            id="input-rating"
            data-testid="input-rating"
            {...register("rating", { valueAsNumber: true })}
            defaultValue=""
            className="w-full bg-slate-950/80 border border-white/15 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="" disabled>
              Select your rating...
            </option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
          {errors.rating && (
            <p data-testid="error-rating" className="text-xs font-medium text-red-400 mt-1">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label htmlFor="input-comment" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Your Comment
          </label>
          <textarea
            id="input-comment"
            data-testid="input-comment"
            rows={4}
            placeholder="Share your thoughts about this product (1 - 500 characters)..."
            {...register("comment")}
            className="w-full bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          ></textarea>
          {errors.comment && (
            <p data-testid="error-comment" className="text-xs font-medium text-red-400 mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          data-testid="btn-submit-review"
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold px-6 py-2.5 h-auto rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
        </Button>
      </form>
    </div>
  );
}
