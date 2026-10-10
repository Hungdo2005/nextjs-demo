import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const product = products.find((p) => p.id === numericId);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product, { status: 200 });
}
