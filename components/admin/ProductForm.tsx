"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, Save, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_PRODUCT_IMAGES,
  PRODUCT_IMAGE_TYPES,
  ProductFieldErrors,
  validateProductDraft,
  validateProductImageFile,
} from "@/lib/product-validation";
import { cn, formatCurrency } from "@/lib/utils";
import { ManagedProduct } from "@/types";

type ProductFormMode = "create" | "edit";

type ProductFormProps = {
  mode: ProductFormMode;
  productId?: string;
};

type ProductResponse = {
  product?: ManagedProduct;
  error?: string;
  errors?: ProductFieldErrors;
};

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type FormValues = {
  name: string;
  description: string;
  category: string;
  price: string;
  discountPrice: string;
  stock: string;
};

const emptyValues: FormValues = {
  name: "",
  description: "",
  category: "",
  price: "",
  discountPrice: "",
  stock: "",
};

async function readProductResponse(response: Response) {
  const data = (await response.json().catch(() => null)) as ProductResponse | null;

  if (!response.ok) {
    const error = new Error(data?.error ?? "Unable to save product.") as Error & { fieldErrors?: ProductFieldErrors };
    error.fieldErrors = data?.errors;
    throw error;
  }

  return data ?? {};
}

function getImageId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-300">{message}</p>;
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const selectedImagesRef = useRef<SelectedImage[]>([]);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({});
  const [loadingProduct, setLoadingProduct] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const imageCount = existingImages.length + selectedImages.length;
  const submitLabel = mode === "create" ? "Save Product" : "Save Changes";
  const previewPrice = useMemo(() => {
    const price = Number(values.discountPrice || values.price);

    return Number.isFinite(price) && price > 0 ? formatCurrency(price) : "";
  }, [values.discountPrice, values.price]);

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !productId) return;

    let mounted = true;

    async function loadProduct() {
      setLoadingProduct(true);
      setError("");

      try {
        const data = await readProductResponse(await fetch(`/api/products/${productId}`, { cache: "no-store" }));
        const product = data.product;

        if (!mounted || !product) return;

        setValues({
          name: product.name,
          description: product.description,
          category: product.category,
          price: String(product.price),
          discountPrice: product.discount_price ? String(product.discount_price) : "",
          stock: String(product.stock),
        });
        setExistingImages(product.images);
      } catch (loadError) {
        if (mounted) setError(loadError instanceof Error ? loadError.message : "Unable to load product.");
      } finally {
        if (mounted) setLoadingProduct(false);
      }
    }

    void loadProduct();

    return () => {
      mounted = false;
    };
  }, [mode, productId]);

  function updateValue(key: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key === "discountPrice" ? "discountPrice" : key]: undefined }));
    setError("");
    setSuccess("");
  }

  function removeSelectedImage(id: string) {
    setSelectedImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) URL.revokeObjectURL(image.previewUrl);

      return current.filter((item) => item.id !== id);
    });
  }

  function clearSelectedImages() {
    selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    selectedImagesRef.current = [];
    setSelectedImages([]);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setSuccess("");
    setError("");

    if (files.length === 0) return;

    if (imageCount + files.length > MAX_PRODUCT_IMAGES) {
      setFieldErrors((current) => ({ ...current, images: `Use ${MAX_PRODUCT_IMAGES} images or fewer.` }));
      return;
    }

    const fileError = files.map((file) => validateProductImageFile(file)).find(Boolean);

    if (fileError) {
      setFieldErrors((current) => ({ ...current, images: fileError }));
      return;
    }

    setFieldErrors((current) => ({ ...current, images: undefined }));
    setSelectedImages((current) => [
      ...current,
      ...files.map((file) => ({
        id: getImageId(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeExistingImage(image: string) {
    setExistingImages((current) => current.filter((item) => item !== image));
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validation = validateProductDraft(
      {
        ...values,
        imageCount,
      },
      { requireImages: true },
    );
    const fileError = selectedImages.map((image) => validateProductImageFile(image.file)).find(Boolean);

    if (fileError) {
      validation.errors.images = fileError;
    }

    if (!validation.values || Object.keys(validation.errors).length > 0) {
      setFieldErrors(validation.errors);
      return;
    }

    const formData = new FormData();
    formData.set("name", validation.values.name);
    formData.set("description", validation.values.description);
    formData.set("category", validation.values.category);
    formData.set("price", String(validation.values.price));
    formData.set("discount_price", validation.values.discount_price === null ? "" : String(validation.values.discount_price));
    formData.set("stock", String(validation.values.stock));
    existingImages.forEach((image) => formData.append("existingImages", image));
    selectedImages.forEach((image) => formData.append("images", image.file));

    setSaving(true);

    try {
      const url = mode === "create" ? "/api/products" : `/api/products/${productId}`;
      const method = mode === "create" ? "POST" : "PUT";
      const data = await readProductResponse(await fetch(url, { method, body: formData }));

      if (!data.product) {
        throw new Error("Product response was empty.");
      }

      setFieldErrors({});
      setValues({
        name: data.product.name,
        description: data.product.description,
        category: data.product.category,
        price: String(data.product.price),
        discountPrice: data.product.discount_price ? String(data.product.discount_price) : "",
        stock: String(data.product.stock),
      });
      setExistingImages(data.product.images);
      clearSelectedImages();
      setSuccess(mode === "create" ? "Product saved. Opening edit view..." : "Product updated successfully.");

      if (mode === "create") {
        window.setTimeout(() => router.replace(`/admin/products/${data.product?.id}`), 700);
      } else {
        router.refresh();
      }
    } catch (saveError) {
      if (saveError instanceof Error) {
        setError(saveError.message);
        setFieldErrors((saveError as Error & { fieldErrors?: ProductFieldErrors }).fieldErrors ?? {});
      } else {
        setError("Unable to save product.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            {mode === "create" ? "Add product" : "Edit product"}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">
            {mode === "create" ? "New product" : values.name || "Product details"}
          </h1>
        </div>
        {previewPrice ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Display price
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">{previewPrice}</p>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          {success}
        </div>
      ) : null}

      {loadingProduct ? (
        <div className="grid gap-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-3xl bg-white dark:bg-white/10" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Product details</h2>
            <div className="mt-6 grid gap-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</span>
                <input
                  value={values.name}
                  onChange={(event) => updateValue("name", event.target.value)}
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                  placeholder="Premium display kit"
                />
                <FieldError message={fieldErrors.name} />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</span>
                <textarea
                  value={values.description}
                  onChange={(event) => updateValue("description", event.target.value)}
                  required
                  rows={6}
                  className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                  placeholder="Describe the product, use cases, and key selling points."
                />
                <FieldError message={fieldErrors.description} />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
                  <input
                    value={values.category}
                    onChange={(event) => updateValue("category", event.target.value)}
                    required
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                    placeholder="Display systems"
                  />
                  <FieldError message={fieldErrors.category} />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Stock quantity</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={values.stock}
                    onChange={(event) => updateValue("stock", event.target.value)}
                    required
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                    placeholder="17"
                  />
                  <FieldError message={fieldErrors.stock} />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={values.price}
                    onChange={(event) => updateValue("price", event.target.value)}
                    required
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                    placeholder="64999"
                  />
                  <FieldError message={fieldErrors.price} />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Discount price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={values.discountPrice}
                    onChange={(event) => updateValue("discountPrice", event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                    placeholder="59999"
                  />
                  <FieldError message={fieldErrors.discountPrice} />
                </label>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Images</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {imageCount} of {MAX_PRODUCT_IMAGES} selected
                </p>
              </div>
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10">
                <ImagePlus className="h-4 w-4" />
                Upload
                <input
                  type="file"
                  multiple
                  accept={PRODUCT_IMAGE_TYPES.join(",")}
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
            <FieldError message={fieldErrors.images} />

            <div className="mt-5 grid grid-cols-2 gap-3">
              {existingImages.map((image) => (
                <div key={image} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Existing product" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image)}
                    aria-label="Remove image"
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-slate-950/80 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {selectedImages.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-2xl border border-cyan-200 bg-cyan-50 dark:border-cyan-400/30 dark:bg-cyan-400/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.previewUrl} alt={image.file.name} className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeSelectedImage(image.id)}
                    aria-label="Remove selected image"
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-slate-950/80 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {imageCount === 0 ? (
                <div className="col-span-2 grid min-h-48 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-white/15 dark:bg-white/5">
                  <div>
                    <ImagePlus className="mx-auto h-6 w-6 text-slate-400" />
                    <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Upload images</p>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={saving}
              className={cn(
                "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950",
                saving && "cursor-not-allowed opacity-70 hover:translate-y-0",
              )}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : submitLabel}
            </button>
          </aside>
        </form>
      )}
    </main>
  );
}
