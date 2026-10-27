"use client";

import React, { useEffect, useState } from "react";

interface AdSlotProps {
  placement: "homepage-banner" | "compiler-top" | "compiler-bottom" | "blog-sidebar" | "blog-article";
  className?: string;
  adFormat?: "auto" | "rectangle" | "horizontal";
  slotId?: string;
}

export function AdSlot({ placement, className = "", adFormat = "auto", slotId }: AdSlotProps) {
  const [adsEnabled, setAdsEnabled] = useState(process.env.NEXT_PUBLIC_ADS_ENABLED === "true");
  const [publisherId, setPublisherId] = useState(process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "");
  const [activeSlotId, setActiveSlotId] = useState(slotId || "1234567890");

  useEffect(() => {
    // If not set via env var, check dynamic settings
    if (!publisherId || !adsEnabled) {
      try {
        fetch("/api/admin/settings")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.settings) {
              if (data.settings.adsense_publisher_id) {
                setPublisherId(data.settings.adsense_publisher_id);
              }
              if (typeof data.settings.ads_enabled === "boolean") {
                setAdsEnabled(data.settings.ads_enabled);
              }
              if (placement === "homepage-banner" && data.settings.ads_slot_header) {
                setActiveSlotId(data.settings.ads_slot_header);
              } else if (placement.startsWith("compiler") && data.settings.ads_slot_compiler) {
                setActiveSlotId(data.settings.ads_slot_compiler);
              } else if (placement.startsWith("blog") && data.settings.ads_slot_blog) {
                setActiveSlotId(data.settings.ads_slot_blog);
              }
            }
          })
          .catch(() => {
            // Keep current env settings
          });
      } catch {
        // Ignore
      }
    }
  }, [placement, publisherId, adsEnabled]);

  useEffect(() => {
    if (adsEnabled && publisherId && typeof window !== "undefined") {
      try {
        // Push ad call to Google AdSense queue
        const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
      } catch {
        // Adblocker or script still loading
      }
    }
  }, [adsEnabled, publisherId]);

  // If ads are disabled during development or pending approval, show subtle placeholder in dev
  if (!adsEnabled || !publisherId) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          className={`my-3 p-2 rounded border border-dashed border-[#292929]/60 bg-[#0B0B0D]/50 text-center text-[10px] text-[#71717A] tracking-wider uppercase flex items-center justify-center min-h-[60px] ${className}`}
          aria-label={`Reserved space for ${placement}`}
        >
          <span>ADVERTISEMENT SPACE • {placement}</span>
        </div>
      );
    }
    // In production, keep completely clean when ads are not active
    return null;
  }

  return (
    <div
      className={`my-4 flex flex-col items-center justify-center overflow-hidden min-h-[90px] ${className}`}
    >
      <span className="text-[9px] uppercase tracking-widest text-[#71717A] mb-1">
        ADVERTISEMENT
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client={publisherId}
        data-ad-slot={activeSlotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
