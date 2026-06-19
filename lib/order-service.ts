import "server-only";

import { getShippingEstimate, getTax } from "@/lib/utils";
import { getSupabaseAdminClient, getSupabaseAdminConfigError } from "@/lib/supabase-admin";
import { CartItem, OrderItem, SupabaseOrder } from "@/types";

const orderSelect =
  "id, order_number, customer_name, email, phone, address, quantity, amount, payment_method, status, items, created_at";

const productSelect = "id, name, price, discount_price, stock, images";

const fallbackImage = "/images/hologram-fan-hero.svg";

type ProductOrderRow = {
  id: string;
  name: string;
  price: number | string;
  discount_price: number | string | null;
  stock: number;
  images: string[] | null;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  quantity: number | null;
  amount: number | string;
  payment_method: string;
  status?: string | null;
  items?: unknown;
  created_at: string;
};

export type CheckoutCustomer = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  addressLine: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  installationNote?: string;
  paymentMethod: string;
};

export type CustomerSummary = {
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
};

export type MonthlyOrderPoint = {
  key: string;
  label: string;
  orders: number;
  revenue: number;
  units: number;
};

export type TopProductSummary = {
  productId: string;
  name: string;
  units: number;
  revenue: number;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizeOrderItem(value: unknown): OrderItem | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Partial<Record<keyof OrderItem, unknown>>;
  const productId = typeof item.product_id === "string" ? item.product_id : "";
  const slug = typeof item.slug === "string" ? item.slug : productId;
  const name = typeof item.name === "string" ? item.name : "";
  const image = typeof item.image === "string" ? item.image : fallbackImage;
  const unitPrice = Number(item.unit_price);
  const compareAtPrice = Number(item.compare_at_price);
  const quantity = Number(item.quantity);
  const lineTotal = Number(item.line_total);

  if (!productId || !name || !Number.isFinite(unitPrice) || !Number.isFinite(quantity)) return null;

  return {
    product_id: productId,
    slug,
    name,
    image,
    unit_price: unitPrice,
    compare_at_price: Number.isFinite(compareAtPrice) ? compareAtPrice : unitPrice,
    quantity,
    line_total: Number.isFinite(lineTotal) ? lineTotal : unitPrice * quantity,
  };
}

function normalizeOrderItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) return [];

  return value.map(normalizeOrderItem).filter((item): item is OrderItem => Boolean(item));
}

export function normalizeOrder(row: OrderRow): SupabaseOrder {
  return {
    id: row.id,
    order_number: row.order_number,
    customer_name: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    quantity: Number(row.quantity ?? 0),
    amount: Number(row.amount),
    payment_method: row.payment_method,
    status: row.status || "Confirmed",
    items: normalizeOrderItems(row.items),
    created_at: row.created_at,
  };
}

function createOrderNumber(createdAt: string) {
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

  return `HVX-${createdAt.replace(/\D/g, "").slice(0, 14)}-${randomPart}`;
}

function getAddress(customer: CheckoutCustomer) {
  return [
    customer.addressLine.trim(),
    customer.apartment?.trim() ?? "",
    `${customer.city.trim()}, ${customer.state.trim()} ${customer.pinCode.trim()}`,
    customer.company?.trim() ? `Company: ${customer.company.trim()}` : "",
    customer.installationNote?.trim() ? `Installation note: ${customer.installationNote.trim()}` : "",
  ]
    .filter(Boolean)
    .join(", ");
}

function getProductPrice(product: ProductOrderRow) {
  const compareAtPrice = Number(product.price);
  const price = product.discount_price === null ? compareAtPrice : Number(product.discount_price);

  return { price, compareAtPrice };
}

function getProductImage(product: ProductOrderRow) {
  return Array.isArray(product.images) && product.images[0] ? product.images[0] : fallbackImage;
}

export async function listOrders(limit = 500) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) throw new Error(`Order data is not configured. ${getSupabaseAdminConfigError()}`);

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return ((data ?? []) as OrderRow[]).map(normalizeOrder);
}

export async function getOrderByNumber(orderNumber: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) throw new Error(`Order data is not configured. ${getSupabaseAdminConfigError()}`);

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data ? normalizeOrder(data as OrderRow) : null;
}

export async function listRecentOrders(limit = 5) {
  return listOrders(limit);
}

export async function createOrderFromCart(customer: CheckoutCustomer, cartItems: Pick<CartItem, "productId" | "quantity">[]) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) throw new Error(`Checkout is not configured. ${getSupabaseAdminConfigError()}`);

  const quantityByProductId = new Map<string, number>();

  cartItems.forEach((item) => {
    const productId = item.productId.trim();
    const quantity = Math.max(1, Math.min(Number(item.quantity), 9));

    if (productId && isUuid(productId) && Number.isFinite(quantity)) {
      quantityByProductId.set(productId, (quantityByProductId.get(productId) ?? 0) + quantity);
    }
  });

  const productIds = [...quantityByProductId.keys()];

  if (productIds.length === 0) {
    throw new Error("Add at least one product before checkout.");
  }

  const { data: products, error: productError } = await supabase.from("products").select(productSelect).in("id", productIds);

  if (productError) throw new Error(productError.message);

  const productRows = ((products ?? []) as ProductOrderRow[]).map((product) => [product.id, product] as const);
  const productById = new Map(productRows);

  if (productById.size !== productIds.length) {
    throw new Error("One or more cart products are no longer available.");
  }

  const items: OrderItem[] = productIds.map((productId) => {
    const product = productById.get(productId);
    const quantity = quantityByProductId.get(productId) ?? 1;

    if (!product) throw new Error("A cart product could not be found.");
    if (product.stock < quantity) {
      throw new Error(`${product.name} only has ${product.stock} units available.`);
    }

    const { price, compareAtPrice } = getProductPrice(product);

    return {
      product_id: product.id,
      slug: product.id,
      name: product.name,
      image: getProductImage(product),
      unit_price: price,
      compare_at_price: compareAtPrice,
      quantity,
      line_total: price * quantity,
    };
  });

  const subtotal = items.reduce((total, item) => total + item.line_total, 0);
  const shipping = getShippingEstimate(subtotal);
  const tax = getTax(subtotal);
  const amount = subtotal + shipping + tax;
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const createdAt = new Date().toISOString();
  const orderNumber = createOrderNumber(createdAt);

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: customer.fullName.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      address: getAddress(customer),
      quantity,
      amount,
      payment_method: customer.paymentMethod.trim(),
      status: "Confirmed",
      items,
      created_at: createdAt,
    })
    .select(orderSelect)
    .single();

  if (error) throw new Error(error.message);

  return normalizeOrder(data as OrderRow);
}

export function buildCustomerSummaries(orders: SupabaseOrder[]) {
  const customers = new Map<string, CustomerSummary>();

  orders.forEach((order) => {
    const key = order.email.toLowerCase();
    const existing =
      customers.get(key) ??
      ({
        name: order.customer_name,
        email: order.email,
        totalOrders: 0,
        totalSpent: 0,
      } satisfies CustomerSummary);

    customers.set(key, {
      ...existing,
      totalOrders: existing.totalOrders + 1,
      totalSpent: existing.totalSpent + order.amount,
    });
  });

  return [...customers.values()].sort((first, second) => second.totalSpent - first.totalSpent);
}

export function buildMonthlyOrderData(orders: SupabaseOrder[]) {
  const buckets = new Map<string, MonthlyOrderPoint>();

  orders.forEach((order) => {
    const date = new Date(order.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const existing =
      buckets.get(key) ??
      ({
        key,
        label: date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        orders: 0,
        revenue: 0,
        units: 0,
      } satisfies MonthlyOrderPoint);

    buckets.set(key, {
      ...existing,
      orders: existing.orders + 1,
      revenue: existing.revenue + order.amount,
      units: existing.units + order.quantity,
    });
  });

  return [...buckets.values()].sort((first, second) => first.key.localeCompare(second.key)).slice(-12);
}

export function buildTopProducts(orders: SupabaseOrder[]) {
  const products = new Map<string, TopProductSummary>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing =
        products.get(item.product_id) ??
        ({
          productId: item.product_id,
          name: item.name,
          units: 0,
          revenue: 0,
        } satisfies TopProductSummary);

      products.set(item.product_id, {
        ...existing,
        units: existing.units + item.quantity,
        revenue: existing.revenue + item.line_total,
      });
    });
  });

  return [...products.values()].sort((first, second) => second.revenue - first.revenue);
}

export function getOrderItemsLabel(order: SupabaseOrder) {
  if (order.items.length === 0) {
    return `${order.quantity} item${order.quantity === 1 ? "" : "s"}`;
  }

  return order.items.map((item) => `${item.quantity} x ${item.name}`).join(", ");
}
