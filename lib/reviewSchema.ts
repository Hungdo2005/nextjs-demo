import { z } from "zod";

export const reviewSchema = z.object({
  product_id: z
    .number({
      message: "Product ID is required",
    })
    .int("Product ID must be an integer")
    .positive("Product ID must be positive"),
  rating: z
    .number({
      message: "Rating is required",
    })
    .refine((val) => !isNaN(val), { message: "Rating is required" })
    .refine((val) => Number.isInteger(val), { message: "Rating must be an integer" })
    .refine((val) => val >= 1 && val <= 5, { message: "Rating must be between 1 and 5" }),
  comment: z
    .string({
      message: "Comment is required",
    })
    .trim()
    .min(1, "Comment is required")
    .max(500, "Comment cannot exceed 500 characters"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
