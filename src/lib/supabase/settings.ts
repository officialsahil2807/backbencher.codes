import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SiteSettings {
  adsense_publisher_id: string;
  ads_enabled: boolean;
  ads_slot_header?: string;
  ads_slot_compiler?: string;
  ads_slot_blog?: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  adsense_publisher_id: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "",
  ads_enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  ads_slot_header: "1234567890",
  ads_slot_compiler: "1234567891",
  ads_slot_blog: "1234567892",
};

/**
 * Retrieves site settings from Supabase site_settings table.
 * Falls back to environment variables if Supabase is offline or not configured.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error || !data || data.length === 0) {
      return DEFAULT_SETTINGS;
    }

    const settings: Partial<SiteSettings> = {};
    for (const row of data) {
      if (row.key === "adsense_publisher_id") {
        settings.adsense_publisher_id = typeof row.value === "string" ? row.value : String(row.value);
      } else if (row.key === "ads_enabled") {
        settings.ads_enabled = Boolean(row.value);
      } else if (row.key === "ads_slot_header") {
        settings.ads_slot_header = String(row.value);
      } else if (row.key === "ads_slot_compiler") {
        settings.ads_slot_compiler = String(row.value);
      } else if (row.key === "ads_slot_blog") {
        settings.ads_slot_blog = String(row.value);
      }
    }

    return {
      adsense_publisher_id: settings.adsense_publisher_id || DEFAULT_SETTINGS.adsense_publisher_id,
      ads_enabled: typeof settings.ads_enabled === "boolean" ? settings.ads_enabled : DEFAULT_SETTINGS.ads_enabled,
      ads_slot_header: settings.ads_slot_header || DEFAULT_SETTINGS.ads_slot_header,
      ads_slot_compiler: settings.ads_slot_compiler || DEFAULT_SETTINGS.ads_slot_compiler,
      ads_slot_blog: settings.ads_slot_blog || DEFAULT_SETTINGS.ads_slot_blog,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Updates site settings in Supabase site_settings table.
 * Uses service role client if available or regular authenticated client.
 */
export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<boolean> {
  try {
    // Prefer admin client if available to bypass RLS, otherwise use server client
    const adminSupabase = createAdminClient();
    const supabase = adminSupabase || (await createServerClient());

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await supabase
          .from("site_settings")
          .upsert({
            key,
            value: JSON.stringify(value),
            updated_at: new Date().toISOString(),
          });
      }
    }

    return true;
  } catch (e) {
    console.error("Failed to update site settings in Supabase:", e);
    return false;
  }
}
