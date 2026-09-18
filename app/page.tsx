import { ProductCatalogSection } from "@/components/home/ProductCatalogSection";
import { getProducts } from "@/lib/storefront-service";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[] = [];
  let catalogError = false;

  try {
    products = await getProducts();
  } catch {
    catalogError = true;
  }

  return (
    <>
      <ProductCatalogSection products={products} errorMessage={catalogError ? "Unable to load products." : undefined} />
    </>
  );
}
