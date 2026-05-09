"use client";

import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "success" | "error";

interface ShareButtonProps {
  shareText: string;
  shareUrl?: string;
  competitionName?: string;
}

export function ShareButton({
  shareText,
  shareUrl,
  competitionName,
}: ShareButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const showToast = (state: CopyState): void => {
    setCopyState(state);
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setCopyState("idle");
    }, 2200);
  };

  const handleCopyLink = async (): Promise<void> => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard tidak tersedia.");
      }

      const urlToCopy = shareUrl ?? window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
      showToast("success");
    } catch {
      showToast("error");
    }
  };

  const handleShare = async (): Promise<void> => {
    if (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function"
    ) {
      const shareData: ShareData = {
        title: competitionName ?? "CompBase",
        text: shareText,
      };
      if (shareUrl) {
        shareData.url = shareUrl;
      }

      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch {
          return;
        }
      }
    }

    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard tidak tersedia.");
      }
      await navigator.clipboard.writeText(shareText);
      showToast("success");
    } catch {
      showToast("error");
    }
  };

  const toastContent =
    copyState === "success" ? (
      <div className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-xs font-medium text-emerald-100 shadow-[0_18px_50px_-30px_oklch(0.7_0.06_160)] backdrop-blur-md">
        Link berhasil disalin
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleCopyLink}
        className="rounded-full border border-violet-200/18 bg-violet-200/8 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-violet-100 hover:border-violet-200/28 hover:bg-violet-200/12"
      >
        Salin link
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="rounded-full border border-violet-200/18 bg-violet-200/8 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-violet-100 hover:border-violet-200/28 hover:bg-violet-200/12"
      >
        Bagikan
      </button>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-8 z-[60] flex justify-center px-5"
        aria-live="polite"
      >
        {toastContent}
      </div>
    </>
  );
}
