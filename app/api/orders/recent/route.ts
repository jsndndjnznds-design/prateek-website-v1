import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-server";
import { listRecentOrders } from "@/lib/order-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 });
  }

  try {
    const orders = await listRecentOrders(5);

    return NextResponse.json({
      orders: orders.map((order) => ({
        order_number: order.order_number,
        amount: order.amount,
        status: order.status,
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
