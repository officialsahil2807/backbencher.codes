import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getSiteSettings, updateSiteSettings } from "@/lib/supabase/settings";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const settings = await getSiteSettings();
  const supabaseConnected = isSupabaseConfigured();

  return NextResponse.json({
    settings,
    environment: {
      supabaseConnected,
      envAdSensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || null,
      envAdsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
    },
  });
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { adsense_publisher_id, ads_enabled, ads_slot_header, ads_slot_compiler, ads_slot_blog } = body;

    // Validation
    if (adsense_publisher_id !== undefined && typeof adsense_publisher_id === "string") {
      const trimmed = adsense_publisher_id.trim();
      if (trimmed && !/^ca-pub-\d+$/i.test(trimmed)) {
        return NextResponse.json(
          {
            error:
              "Invalid AdSense Publisher ID format. It should start with 'ca-pub-' followed by digits (e.g., ca-pub-1234567890123456).",
          },
          { status: 400 }
        );
      }
    }

    const success = await updateSiteSettings({
      adsense_publisher_id: adsense_publisher_id?.trim(),
      ads_enabled: Boolean(ads_enabled),
      ads_slot_header,
      ads_slot_compiler,
      ads_slot_blog,
    });

    return NextResponse.json({
      success,
      message: success
        ? "Settings updated in Supabase database successfully."
        : "Failed to persist to Supabase. Check database permissions and connection.",
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
