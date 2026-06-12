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
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  features: string[];
  specifications: ProductSpec[];
  included: string[];
  shipping: string[];
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

export type Review = {
  id: string;
  customerName: string;
  role: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  useCase: string;
  helpful: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  location: string;
  totalSpent: number;
  joinedAt: string;
  status: "VIP" | "Returning" | "New";
};

export type OrderStatus = "Paid" | "Processing" | "Packed" | "Shipped" | "Delivered";

export type Order = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
  channel: "Online Store" | "Sales Call" | "Partner";
};

export type AnalyticsPoint = {
  label: string;
  orders: number;
  revenue: number;
  visitors: number;
  conversion: number;
};

export type RecentPurchase = {
  name: string;
  city: string;
  minutesAgo: number;
};
