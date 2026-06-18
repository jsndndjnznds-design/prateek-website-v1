"use client";

import Link from "next/link";
import { Edit3, ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { ManagedProduct } from "@/types";

type ProductsResponse = {
  products?: ManagedProduct[];
  error?: string;
};

async function readProductsResponse(response: Response) {
  const data = (await response.json().catch(() => null)) as ProductsResponse | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Unable to load products.");
  }

  return data ?? {};
}

function ProductThumbnail({ product }: { product: ManagedProduct }) {
  const image = product.images[0];

  if (!image) {
    return (
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/10">
        <ImageIcon className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={product.name} className="h-full w-full object-cover" />
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const lowStock = stock <= 5;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold",
        lowStock
          ? "bg-amber-400/15 text-amber-700 dark:text-amber-300"
          : "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300",
      )}
    >
      {stock} units
    </span>
  );
}

export function AdminProductsClient() {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [productToDelete, setProductToDelete] = useState<ManagedProduct | null>(null);
  const [deletingId, setDeletingId] = useState("");
  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.stock, 0), [products]);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await readProductsResponse(await fetch("/api/products", { cache: "no-store" }));

        if (mounted) setProducts(data.products ?? []);
      } catch (loadError) {
        if (mounted) setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  async function confirmDelete() {
    if (!productToDelete) return;

    setDeletingId(productToDelete.id);
    setError("");
    setNotice("");

    try {
      await readProductsResponse(await fetch(`/api/products/${productToDelete.id}`, { method: "DELETE" }));

      setProducts((current) => current.filter((product) => product.id !== productToDelete.id));
      setNotice(`${productToDelete.name} deleted.`);
      setProductToDelete(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Products
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">Product management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {loading ? "Loading Supabase products" : `${products.length} products, ${totalStock} units in stock`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {notice ? (
        <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 dark:border-white/10 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-950 dark:text-white">Catalog</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Images, prices, and inventory from Supabase.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 p-5">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/10" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">No products yet</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Add the first product to start managing the catalog.
              </p>
              <Link
                href="/admin/products/new"
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-3 p-4 lg:hidden">
              {products.map((product) => (
                <article key={product.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="flex gap-3">
                    <ProductThumbnail product={product} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-slate-950 dark:text-white">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
                      <p className="mt-2 font-semibold text-slate-950 dark:text-white">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <StockBadge stock={product.stock} />
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        aria-label={`Edit ${product.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setProductToDelete(product)}
                        aria-label={`Delete ${product.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {products.map((product) => (
                    <tr key={product.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <ProductThumbnail product={product} />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-950 dark:text-white">{product.name}</p>
                            <p className="mt-1 max-w-md truncate text-xs text-slate-500 dark:text-slate-400">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{product.category}</td>
                      <td className="px-5 py-4">
                        {product.discount_price ? (
                          <>
                            <span className="font-semibold text-slate-950 dark:text-white">
                              {formatCurrency(product.discount_price)}
                            </span>
                            <span className="ml-2 text-xs text-slate-400 line-through">{formatCurrency(product.price)}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-slate-950 dark:text-white">{formatCurrency(product.price)}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {productToDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900"
          >
            <h2 id="delete-product-title" className="text-xl font-semibold text-slate-950 dark:text-white">
              Delete product?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              This will remove {productToDelete.name} and its uploaded images from Supabase Storage.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={Boolean(deletingId)}
                className="h-11 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
