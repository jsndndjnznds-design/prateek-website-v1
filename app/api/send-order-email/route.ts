import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const order = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Your Store <your-verified-email@yourdomain.com>",
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

        <p>We'll keep you updated about your order.</p>
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