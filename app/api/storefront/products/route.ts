import { NextResponse } from "next/server";
import { listStorefrontProducts } from "@/lib/storefront-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await listStorefrontProducts();

    return NextResponse.json({
      products: products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
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
