"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { restoreScrollPosition } from "@/lib/utils/scrollRestore";

export function ScrollRestoration(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Delay agar DOM stabil setelah soft navigation.
    const timer = setTimeout(() => {
      restoreScrollPosition();
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
