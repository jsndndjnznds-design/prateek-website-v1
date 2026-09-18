import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { getProducts } from "@/lib/storefront-service";

export const metadata = {
  title: "Wishlist | ClamCart",
  description: "Products saved for later from the ClamCart catalog.",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const products = await getProducts().catch(() => []);

  return <WishlistPageClient products={products} />;
}
