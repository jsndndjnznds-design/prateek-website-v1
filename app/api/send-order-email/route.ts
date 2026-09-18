import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const order = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Your Store <your-verified-email@yourdomain.com>",
      to: [order.email],
      subject: `Order request ${order.orderNumber} received`,
      html: `
        <h1>Order Request Received</h1>

        <p>Hi ${order.customerName},</p>

        <p>Your order request has been recorded.</p>

        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Amount:</strong> ₹${order.amount}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
        <p><strong>Shipping Address:</strong> ${order.address}</p>

        <p>This email does not confirm payment or delivery timing.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Email request error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
