import { NextResponse } from "next/server";
import { getProducts } from "@/lib/storefront-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json({
      products: products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.eyebrow,
        shortDescription: product.shortDescription,
        price: product.price,
        stock: product.stock,
        image: product.images[0]?.src ?? "",
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load products." },
      { status: 500 },
    );
  }
}
