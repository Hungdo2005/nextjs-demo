import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { products } from "@/data/products";
import { reviewSchema } from "@/lib/reviewSchema";

export async function POST(request: NextRequest) {
  // 1. Check Authentication Header
  const authHeader =
    request.headers.get("authorization") || request.headers.get("Authorization");

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate token with Supabase auth
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse & Validate Body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid input", issues: [{ message: "Malformed JSON" }] },
      { status: 400 }
    );
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { product_id, rating, comment } = parsed.data;

  // 3. Product Existence Check
  const product = products.find((p) => p.id === product_id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 4. Insert into reviews using scoped user Supabase client (RLS enforced, user_id and author defaults)
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://kuwgpgrspbcbaetldepn.supabase.co"
  ).trim();
  const supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: newRow, error: insertError } = await userSupabase
    .from("reviews")
    .insert({
      product_id,
      rating,
      comment,
    })
    .select("id, user_id, product_id, rating, comment, author, created_at")
    .single();

  if (insertError) {
    // Map Postgres unique constraint code 23505
    if (
      insertError.code === "23505" ||
      insertError.message?.toLowerCase().includes("unique") ||
      insertError.message?.toLowerCase().includes("duplicate")
    ) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }

    console.error("Error inserting review:", insertError);
    return NextResponse.json(
      { error: insertError.message || "Failed to insert review" },
      { status: 500 }
    );
  }

  // 5. Revalidate product detail page
  revalidatePath("/products/" + product_id);

  return NextResponse.json(newRow, { status: 201 });
}
