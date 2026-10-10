import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const category = searchParams.get("category")?.trim().toLowerCase();

  let filtered = [...products];

  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category
    );
  }

  return NextResponse.json(filtered, { status: 200 });
}
