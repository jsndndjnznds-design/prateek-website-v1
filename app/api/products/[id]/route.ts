import { NextRequest, NextResponse } from "next/server";
import {
  deleteProduct,
  getProductAdminContext,
  getProductById,
  parseProductFormData,
  updateProduct,
} from "@/lib/product-service";

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: ProductRouteContext) {
  const adminContext = await getProductAdminContext();

  if (adminContext.response) return adminContext.response;

  const { id } = await context.params;

  try {
    const product = await getProductById(adminContext.supabase, id);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load product." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: ProductRouteContext) {
  const adminContext = await getProductAdminContext();

  if (adminContext.response) return adminContext.response;

  const { id } = await context.params;

  try {
    const formData = await request.formData();
    const { payload, errors } = parseProductFormData(formData);

    if (!payload) {
      return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 400 });
    }

    const product = await updateProduct(adminContext.supabase, id, payload);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: ProductRouteContext) {
  const adminContext = await getProductAdminContext();

  if (adminContext.response) return adminContext.response;

  const { id } = await context.params;

  try {
    const product = await deleteProduct(adminContext.supabase, id);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete product." },
      { status: 500 },
    );
  }
}
