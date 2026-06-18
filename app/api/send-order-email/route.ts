import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      customerName,
      email,
      orderNumber,
      amount,
      address,
    } = await req.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `Order Confirmed - ${orderNumber}`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Hello ${customerName},</p>
        <p>Your order <b>${orderNumber}</b> has been confirmed.</p>
        <p><b>Amount:</b> ₹${amount}</p>
        <p><b>Shipping address:</b> ${address}</p>
        <br>
        <p>Regards,<br>HoloVista Team</p>
      `,
    });

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL!,
      subject: "New Order Received",
      html: `
        <h2>New Order Received</h2>
        <p><b>Customer:</b> ${customerName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Order Number:</b> ${orderNumber}</p>
        <p><b>Amount:</b> ₹${amount}</p>
        <p><b>Address:</b> ${address}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}