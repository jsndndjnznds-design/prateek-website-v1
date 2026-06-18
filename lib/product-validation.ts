export const MAX_PRODUCT_IMAGES = 8;
export const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export type ProductDraft = {
  name: string;
  description: string;
  category: string;
  price: string;
  discountPrice: string;
  stock: string;
  imageCount: number;
};

export type ProductFieldErrors = Partial<
  Record<"name" | "description" | "category" | "price" | "discountPrice" | "stock" | "images", string>
>;

export type ValidProductFields = {
  name: string;
  description: string;
  category: string;
  price: number;
  discount_price: number | null;
  stock: number;
};

export function validateProductDraft(
  draft: ProductDraft,
  options: { requireImages: boolean },
): { values: ValidProductFields | null; errors: ProductFieldErrors } {
  const errors: ProductFieldErrors = {};
  const name = draft.name.trim();
  const description = draft.description.trim();
  const category = draft.category.trim();
  const price = Number(draft.price);
  const discountPriceText = draft.discountPrice.trim();
  const discountPrice = discountPriceText ? Number(discountPriceText) : null;
  const stock = Number(draft.stock);

  if (!name) errors.name = "Name is required.";
  if (!description) errors.description = "Description is required.";
  if (!category) errors.category = "Category is required.";

  if (!Number.isFinite(price) || price <= 0) {
    errors.price = "Price must be greater than zero.";
  }

  if (discountPrice !== null) {
    if (!Number.isFinite(discountPrice) || discountPrice <= 0) {
      errors.discountPrice = "Discount price must be greater than zero.";
    } else if (Number.isFinite(price) && discountPrice >= price) {
      errors.discountPrice = "Discount price must be lower than price.";
    }
  }

  if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock quantity must be a whole number of zero or more.";
  }

  if (draft.imageCount > MAX_PRODUCT_IMAGES) {
    errors.images = `Use ${MAX_PRODUCT_IMAGES} images or fewer.`;
  } else if (options.requireImages && draft.imageCount < 1) {
    errors.images = "Add at least one product image.";
  }

  if (Object.keys(errors).length > 0) {
    return { values: null, errors };
  }

  return {
    values: {
      name,
      description,
      category,
      price,
      discount_price: discountPrice,
      stock,
    },
    errors,
  };
}

export function validateProductImageFile(file: { name: string; size: number; type: string }) {
  if (!PRODUCT_IMAGE_TYPES.includes(file.type as (typeof PRODUCT_IMAGE_TYPES)[number])) {
    return `${file.name} must be a JPG, PNG, WebP, or GIF image.`;
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    return `${file.name} must be 5 MB or smaller.`;
  }

  return "";
}
