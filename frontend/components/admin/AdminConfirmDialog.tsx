"use client";

import { useEffect, useRef } from "react";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  variant = "default",
  isPending = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 bg-[oklch(0.13_0.02_286_/_0.78)] backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="relative z-10 w-full max-w-md rounded-[1.5rem] border border-white/10 bg-[oklch(0.16_0.02_250_/_0.95)] p-6 shadow-[0_36px_110px_-56px_oklch(0.02_0.03_286)] backdrop-blur-2xl"
      >
        <h3
          id="confirm-title"
          className="font-brand text-xl text-zinc-50"
        >
          {title}
        </h3>
        <p
          id="confirm-message"
          className="mt-3 text-sm leading-relaxed text-zinc-300"
        >
          {message}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              variant === "destructive"
                ? "border-rose-300/18 bg-rose-300/10 text-rose-100 hover:border-rose-300/32 hover:bg-rose-300/14"
                : "border-amber-200/18 bg-amber-200/10 text-amber-100 hover:border-amber-200/32 hover:bg-amber-200/14"
            }`}
          >
            {isPending ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
