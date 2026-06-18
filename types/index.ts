export type ProductImage = {
  src: string;
  alt: string;
  title: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  price: number;
  compareAtPrice: number;
  currency: "INR";
  stock: number;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  features: string[];
  specifications: ProductSpec[];
  included: string[];
  shipping: string[];
};

export type ManagedProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount_price: number | null;
  stock: number;
  images: string[];
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice: number;
  quantity: number;
};

export type SupabaseOrder = {
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  amount: number;
  payment_method: string;
  created_at: string;
};
