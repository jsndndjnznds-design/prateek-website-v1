import { NextResponse } from "next/server";
import { listRecentOrders } from "@/lib/order-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await listRecentOrders(5);

    return NextResponse.json({
      orders: orders.map((order) => ({
        customer_name: order.customer_name,
        address: order.address,
        created_at: order.created_at,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load recent orders." },
      { status: 500 },
    );
  }
}
