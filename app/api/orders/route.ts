import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-server";
import { createOrderFromCart, listOrders } from "@/lib/order-service";

export const dynamic = "force-dynamic";

type CheckoutPayload = {
  customer?: {
    fullName?: unknown;
    email?: unknown;
    phone?: unknown;
    company?: unknown;
    addressLine?: unknown;
    apartment?: unknown;
    city?: unknown;
    state?: unknown;
    pinCode?: unknown;
    installationNote?: unknown;
    paymentMethod?: unknown;
  };
  items?: unknown;
};

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();

  if (!admin) {
    return jsonError("Unauthorized admin request.", 401);
  }

  try {
    const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 500);
    const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 500)) : 500;
    const orders = await listOrders(limit);

    return NextResponse.json({ orders });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load orders.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    const rawCustomer = payload.customer ?? {};
    const customer = {
      fullName: getString(rawCustomer.fullName),
      email: getString(rawCustomer.email),
      phone: getString(rawCustomer.phone),
      company: getString(rawCustomer.company),
      addressLine: getString(rawCustomer.addressLine),
      apartment: getString(rawCustomer.apartment),
      city: getString(rawCustomer.city),
      state: getString(rawCustomer.state),
      pinCode: getString(rawCustomer.pinCode),
      installationNote: getString(rawCustomer.installationNote),
      paymentMethod: getString(rawCustomer.paymentMethod),
    };

    const requiredValues = [
      customer.fullName,
      customer.email,
      customer.phone,
      customer.addressLine,
      customer.city,
      customer.state,
      customer.pinCode,
      customer.paymentMethod,
    ];

    if (requiredValues.some((value) => value.trim().length === 0)) {
      return jsonError("Please complete all required checkout fields.", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      return jsonError("Please enter a valid email address.", 400);
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return jsonError("Add at least one product before checkout.", 400);
    }

    const items = payload.items.map((item) => {
      const cartItem =
        item && typeof item === "object" ? (item as { productId?: unknown; quantity?: unknown }) : {};

      return {
        productId: getString(cartItem.productId),
        quantity: Number(cartItem.quantity),
      };
    });

    const order = await createOrderFromCart(customer, items);

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to place order.", 500);
  }
}
