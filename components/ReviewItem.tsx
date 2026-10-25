"use client";

import React, { useState } from "react";
import { Star, Edit3, Trash2, Check, X } from "lucide-react";
import { Review } from "@/lib/reviews";
import { useReviews } from "@/contexts/ReviewsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const { user } = useAuth();
  const { updateReview, deleteReview } = useReviews();

  const isOwnReview = !!(user && review.user_id === user.id);

  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState<number>(review.rating);
  const [editComment, setEditComment] = useState<string>(review.comment);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveEdit = async () => {
    if (!editComment.trim()) {
      setEditError("Comment cannot be empty");
      return;
    }
    if (editComment.trim().length > 500) {
      setEditError("Comment cannot exceed 500 characters");
      return;
    }
    if (editRating < 1 || editRating > 5) {
      setEditError("Rating must be between 1 and 5");
      return;
    }

    setEditError(null);
    setIsSaving(true);
    const res = await updateReview(editRating, editComment.trim());
    setIsSaving(false);

    if (res.error) {
      setEditError(res.error);
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      setIsDeleting(true);
      await deleteReview();
      setIsDeleting(false);
    }
  };

  return (
    <div
      data-testid="review-item"
      className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-white/20 space-y-3"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Author info & rating */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
              {review.author ? review.author[0] : "U"}
            </div>
            <div>
              <span
                data-testid="review-author"
                className="font-bold text-white text-sm block"
              >
                {review.author}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2 pt-1">
              {/* Star icons indicator */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
              {/* Numerical review rating */}
              <span
                data-testid="review-rating"
                className="text-xs font-bold text-amber-300 font-mono"
              >
                {review.rating}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Only visible on own review */}
        {isOwnReview && !isEditing && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="btn-edit-review"
              onClick={() => setIsEditing(true)}
              className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 text-xs px-2.5 h-8 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="btn-delete-review"
              disabled={isDeleting}
              onClick={handleDelete}
              className="border-white/10 bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-xs px-2.5 h-8 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {isDeleting ? "..." : "Delete"}
            </Button>
          </div>
        )}
      </div>

      {/* Editing Mode */}
      {isEditing ? (
        <div className="space-y-3 pt-2">
          {editError && (
            <p className="text-xs text-red-400 font-medium">{editError}</p>
          )}

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-300 uppercase">
              Rating:
            </label>
            <select
              value={editRating}
              onChange={(e) => setEditRating(Number(e.target.value))}
              className="bg-slate-950 border border-white/20 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-white/20 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
          />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={isSaving}
              onClick={handleSaveEdit}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 h-8 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isSaving}
              onClick={() => {
                setIsEditing(false);
                setEditRating(review.rating);
                setEditComment(review.comment);
                setEditError(null);
              }}
              className="border-white/10 bg-white/5 text-slate-300 text-xs px-3 h-8 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        /* Comment Text */
        <p
          data-testid="review-comment"
          className="text-sm text-slate-300 leading-relaxed pt-1"
        >
          {review.comment}
        </p>
      )}
    </div>
  );
}
