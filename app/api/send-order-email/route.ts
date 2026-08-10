import { NextResponse } from "next/server";
import { getToken } from "@vercel/connect";

export async function POST(request: Request) {
  try {
    const order = await request.json();

    const token = await getToken("api.resend.com/prateek-website-v1", {
      subject: { type: "app" },
    });

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [order.email],
        subject: `Order ${order.orderNumber} confirmed`,
        html: `
          <h1>Order Confirmed</h1>
          <p>Hi ${order.customerName},</p>
          <p>Thank you for your order.</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Amount:</strong> ₹${order.amount}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Shipping Address:</strong> ${order.address}</p>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Resend error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}