import { NextResponse } from "next/server";
import { getToken } from "@vercel/connect";

export async function POST() {
  try {
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
        to: ["sarkarpratik1905ail.com"],
        subject: "Test email",
        html: "<h1>Hello from Resend</h1>",
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