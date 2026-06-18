import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    console.log("API HIT");

    const {
      customerName,
      email,
      orderNumber,
      amount,
      address,
    } = await req.json();

    console.log("Received data:", {
      customerName,
      email,
      orderNumber,
      amount,
      address,
    });

    // Email to customer
    const customerResult = await resend.emails.send({
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

    console.log("Customer email result:", customerResult);

    // Email to admin
    const adminResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Order Received - ${orderNumber}`,
      html: `
        <h2>New Order Received</h2>

        <p><b>Customer:</b> ${customerName}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Order Number:</b> ${orderNumber}</p>

        <p><b>Amount:</b> ₹${amount}</p>

        <p><b>Address:</b> ${address}</p>
      `,
    });

    console.log("Admin email result:", adminResult);

    return NextResponse.json({
      success: true,
      customerResult,
      adminResult,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}