import { NextResponse } from "next/server";
import { authCookieNames, getExpiredAuthCookieOptions } from "@/lib/auth-cookies";
import { isAdminEmail } from "@/lib/auth-config";
import { getAuthenticatedUser } from "@/lib/auth-server";

function unauthorized(message: string) {
  const response = NextResponse.json({ error: message }, { status: 401 });
  response.cookies.set(authCookieNames.accessToken, "", getExpiredAuthCookieOptions());
  response.cookies.set(authCookieNames.refreshToken, "", getExpiredAuthCookieOptions());

  return response;
}

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return unauthorized("No active Supabase session.");
  }

  return NextResponse.json({
    user,
    isAdmin: isAdminEmail(user.email),
  });
}
