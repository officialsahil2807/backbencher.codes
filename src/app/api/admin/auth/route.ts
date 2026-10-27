import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  getAdminAuthStatus,
  clearAdminSession,
  DEFAULT_ADMIN_PIN,
} from "@/lib/auth/admin";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

// Rate limiting for admin login attempts (prevent brute force)
const loginAttempts = new Map<string, { attempts: number; lockUntil: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const entry = loginAttempts.get(ip);

    if (entry && entry.lockUntil > now) {
      const waitMinutes = Math.ceil((entry.lockUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many failed login attempts. Locked out for ${waitMinutes} minute(s).` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, pin, mode } = body;

    // ---------------------------------------------------------
    // Mode A: Supabase Email & Password Authentication
    // ---------------------------------------------------------
    if (mode === "supabase" || (email && password)) {
      // Input validation
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return NextResponse.json(
          { error: "Please enter a valid administrator email address." },
          { status: 400 }
        );
      }

      if (!password || typeof password !== "string" || password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters." },
          { status: 400 }
        );
      }

      if (!isSupabaseConfigured()) {
        return NextResponse.json(
          {
            error:
              "Supabase credentials are not configured in .env.local yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or sign in with your Security PIN.",
          },
          { status: 400 }
        );
      }

      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        // Track failed attempt
        const cur =
          entry && entry.lockUntil <= now
            ? { attempts: 1, lockUntil: 0 }
            : entry || { attempts: 0, lockUntil: 0 };
        cur.attempts++;

        if (cur.attempts >= 5) {
          cur.lockUntil = now + 15 * 60 * 1000;
          loginAttempts.set(ip, cur);
          return NextResponse.json(
            { error: "Too many failed login attempts. Access locked for 15 minutes." },
            { status: 429 }
          );
        }

        loginAttempts.set(ip, cur);
        return NextResponse.json(
          {
            error:
              error?.message ||
              `Invalid email or password. (${5 - cur.attempts} attempts remaining)`,
          },
          { status: 401 }
        );
      }

      // Supabase authentication succeeded:
      // Also establish JWT admin session for seamless compatibility across all middleware
      loginAttempts.delete(ip);
      await createAdminSession(data.user.email);

      return NextResponse.json({
        success: true,
        message: "Authenticated successfully with Supabase.",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    }

    // ---------------------------------------------------------
    // Mode B: Security PIN Authentication (Emergency / Local Mode)
    // ---------------------------------------------------------
    if (pin) {
      const configuredPin = process.env.ADMIN_SECURITY_PIN || DEFAULT_ADMIN_PIN;

      if (String(pin).trim() !== String(configuredPin).trim()) {
        const cur =
          entry && entry.lockUntil <= now
            ? { attempts: 1, lockUntil: 0 }
            : entry || { attempts: 0, lockUntil: 0 };
        cur.attempts++;

        if (cur.attempts >= 5) {
          cur.lockUntil = now + 15 * 60 * 1000;
          loginAttempts.set(ip, cur);
          return NextResponse.json(
            { error: "Too many failed attempts. Access locked for 15 minutes." },
            { status: 429 }
          );
        }

        loginAttempts.set(ip, cur);
        return NextResponse.json(
          { error: `Invalid Security PIN. (${5 - cur.attempts} attempts remaining)` },
          { status: 401 }
        );
      }

      // Success: Reset rate limit and set cookie
      loginAttempts.delete(ip);
      await createAdminSession("admin@backbencher.codes");

      return NextResponse.json({
        success: true,
        message: "Admin PIN authenticated successfully.",
      });
    }

    return NextResponse.json(
      { error: "Please provide either Email & Password or Security PIN." },
      { status: 400 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Authentication error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const status = await getAdminAuthStatus();
  return NextResponse.json(status);
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}
