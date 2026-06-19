import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/order-service";

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

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load order." },
      { status: 500 },
    );
  }
}
