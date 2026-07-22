"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/attribution";

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => captureFirstTouch(), [pathname, searchParams]);
  return null;
}
