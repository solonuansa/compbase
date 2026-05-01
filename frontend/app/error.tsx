"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-[oklch(0.16_0.02_250_/_0.9)] p-6 text-center shadow-[0_30px_90px_-55px_oklch(0.05_0.03_250)] backdrop-blur-2xl sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose-200">
          Terjadi kendala
        </p>
        <h1 className="mt-3 font-brand text-2xl text-zinc-50">
          Halaman belum bisa dimuat.
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          Coba muat ulang halaman ini. Kalau masalah terus berlanjut, hubungi tim teknis.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-violet-200 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-violet-100"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
