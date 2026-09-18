import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/order-service";
import { PublicOrderConfirmation } from "@/types";

export const dynamic = "force-dynamic";

type OrderRouteContext = {
  params: Promise<{ orderNumber: string }>;
};

export async function GET(_request: NextRequest, context: OrderRouteContext) {
  try {
    const { orderNumber } = await context.params;
    const order = await getOrderByNumber(decodeURIComponent(orderNumber));

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const publicOrder: PublicOrderConfirmation = {
      order_number: order.order_number,
      quantity: order.quantity,
      amount: order.amount,
      payment_method: order.payment_method,
      status: order.status,
      items: order.items,
      created_at: order.created_at,
    };

    return NextResponse.json({ order: publicOrder });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load order." },
      { status: 500 },
    );
  }
}
