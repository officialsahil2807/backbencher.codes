import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "backbencher-super-secret-admin-session-key-32chars"
);

export const COOKIE_NAME = "backbencher_admin_session";

// High security Master PIN from environment or fallback default for local setup
export const DEFAULT_ADMIN_PIN = process.env.ADMIN_SECURITY_PIN || "BC-ADMIN#984201-SECURE-KEY";

export interface AdminAuthResult {
  authenticated: boolean;
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
  provider?: "supabase" | "pin";
}

/**
 * Creates a signed JWT session cookie for PIN-based or administrative fallback sessions.
 */
export async function createAdminSession(email?: string): Promise<string> {
  const token = await new SignJWT({
    role: "admin",
    email: email || "admin@backbencher.codes",
    authenticatedAt: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(ADMIN_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return token;
}

/**
 * Detailed verification checking both Supabase Auth session and JWT cookie.
 */
export async function getAdminAuthStatus(): Promise<AdminAuthResult> {
  // 1. Check Supabase Auth session first if configured
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) {
      return {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: "admin",
        },
        provider: "supabase",
      };
    }
  } catch {
    // Supabase client failure or not configured, proceed to cookie check
  }

  // 2. Check Backbencher JWT admin session cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const { payload } = await jwtVerify(token, ADMIN_SECRET);
      if (payload.role === "admin") {
        return {
          authenticated: true,
          user: {
            id: (payload.sub as string) || "admin",
            email: (payload.email as string) || "admin@backbencher.codes",
            role: "admin",
          },
          provider: "pin",
        };
      }
    }
  } catch {
    // JWT verification failed
  }

  return { authenticated: false };
}

/**
 * Quick boolean check for backwards compatibility.
 */
export async function verifyAdminSession(): Promise<boolean> {
  const status = await getAdminAuthStatus();
  return status.authenticated;
}

/**
 * Clears all admin sessions (Supabase Auth and JWT session cookie).
 */
export async function clearAdminSession(): Promise<void> {
  // Clear Supabase Auth
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore error if Supabase not configured
  }

  // Clear JWT cookie
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
