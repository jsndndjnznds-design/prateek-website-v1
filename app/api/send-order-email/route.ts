import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["sarkarpratik1950@gmail.com"],
      subject: "Test email",
      html: "<h1>Hello from Resend</h1>",
    });

    console.log(result);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error,
    });
  }
}