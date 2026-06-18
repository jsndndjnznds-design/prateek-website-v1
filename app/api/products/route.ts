import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  getProductAdminContext,
  listProducts,
  parseProductFormData,
} from "@/lib/product-service";

export async function GET() {
  const context = await getProductAdminContext();

  if (context.response) return context.response;

  try {
    const products = await listProducts(context.supabase);

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load products." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const context = await getProductAdminContext();

  if (context.response) return context.response;

  try {
    const formData = await request.formData();
    const { payload, errors } = parseProductFormData(formData);

    if (!payload) {
      return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 400 });
    }

    const product = await createProduct(context.supabase, payload);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create product." },
      { status: 500 },
    );
  }
}
