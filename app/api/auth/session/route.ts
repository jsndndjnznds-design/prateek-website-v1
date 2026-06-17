import { NextRequest, NextResponse } from "next/server";
import {
  authCookieNames,
  getAccessTokenMaxAge,
  getAuthCookieOptions,
  getExpiredAuthCookieOptions,
  refreshTokenMaxAge,
} from "@/lib/auth-cookies";
import { isAdminEmail } from "@/lib/auth-config";
import { getUserFromAccessToken } from "@/lib/auth-server";

type SessionPayload = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number | null;
};

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(authCookieNames.accessToken, "", getExpiredAuthCookieOptions());
  response.cookies.set(authCookieNames.refreshToken, "", getExpiredAuthCookieOptions());
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as SessionPayload;
  const accessToken = payload.access_token;
  const refreshToken = payload.refresh_token;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Missing Supabase session tokens." }, { status: 400 });
  }

  const user = await getUserFromAccessToken(accessToken);

  if (!user) {
    const response = NextResponse.json({ error: "Invalid or expired Supabase session." }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json({
    user,
    isAdmin: isAdminEmail(user.email),
  });

  response.cookies.set(authCookieNames.accessToken, accessToken, getAuthCookieOptions(getAccessTokenMaxAge(payload.expires_at)));
  response.cookies.set(authCookieNames.refreshToken, refreshToken, getAuthCookieOptions(refreshTokenMaxAge));

  return response;
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);

  return response;
}
