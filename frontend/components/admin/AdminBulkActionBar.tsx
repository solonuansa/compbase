"use client";

import type { CompetitionStatus } from "@/lib/types";
import { getStatusLabel } from "@/components/admin/AdminCompetitionManager.utils";

interface AdminBulkActionBarProps {
  selectedCount: number;
  isPending: boolean;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: CompetitionStatus) => void;
  onBulkSetPriority: () => void;
  onBulkRemovePriority: () => void;
  onClearSelection: () => void;
}

export function AdminBulkActionBar({
  selectedCount,
  isPending,
  onBulkDelete,
  onBulkStatusChange,
  onBulkSetPriority,
  onBulkRemovePriority,
  onClearSelection,
}: AdminBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-white/12 bg-[oklch(0.14_0.02_250_/_0.95)] px-5 py-3 shadow-[0_30px_90px_-40px_oklch(0.02_0.03_286)] backdrop-blur-2xl">
        <span className="text-sm font-medium text-zinc-200">
          {selectedCount} kompetisi dipilih
        </span>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-zinc-500">
            Status
          </span>
          {(["open", "coming-soon", "closed"] as CompetitionStatus[]).map(
            (status) => (
              <button
                key={status}
                type="button"
                disabled={isPending}
                onClick={() => onBulkStatusChange(status)}
                className="inline-flex h-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {getStatusLabel(status)}
              </button>
            ),
          )}
        </div>

        <div className="h-6 w-px bg-white/10" />

        <button
          type="button"
          disabled={isPending}
          onClick={onBulkSetPriority}
          className="inline-flex h-8 items-center justify-center rounded-full border border-sky-300/18 bg-sky-300/10 px-3 text-xs font-semibold text-sky-100 transition hover:border-sky-300/32 hover:bg-sky-300/14 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prioritas
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={onBulkRemovePriority}
          className="inline-flex h-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hapus prioritas
        </button>

        <div className="h-6 w-px bg-white/10" />

        <button
          type="button"
          disabled={isPending}
          onClick={onBulkDelete}
          className="inline-flex h-8 items-center justify-center rounded-full border border-rose-300/18 bg-rose-300/10 px-3 text-xs font-semibold text-rose-100 transition hover:border-rose-300/32 hover:bg-rose-300/14 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hapus
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={onClearSelection}
          className="inline-flex h-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-400 transition hover:border-white/20 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
