"use client";

import { useFocusTrap } from "@/hooks/useFocusTrap";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ShareButton } from "@/components/ShareButton";
import { StatusBadge } from "@/components/StatusBadge";
import type { Competition } from "@/lib/types";
import {
  formatDate,
  formatDateRange,
  getCompetitionStatus,
  getDaysUntilDeadline,
} from "@/lib/utils/competitions";

interface CompetitionDetailModalProps {
  competition: Competition;
  similarCompetitions: Competition[];
  now: Date;
  onClose: () => void;
  onOpenDetail: (competition: Competition) => void;
}

interface ActionLink {
  label: string;
  href: string;
}

function getWebsiteLink(competition: Competition): string | undefined {
  return competition.links.website ?? competition.links.linktree ?? competition.links.registration;
}

function createActionLinks(competition: Competition): ActionLink[] {
  const links: ActionLink[] = [];
  const websiteLink = competition.links.website ?? competition.links.linktree;

  if (competition.links.registration) {
    links.push({ label: "Registrasi", href: competition.links.registration });
  }

  if (competition.links.guidebook) {
    links.push({ label: "Guidebook", href: competition.links.guidebook });
  }

  if (competition.links.instagram) {
    links.push({ label: "Instagram", href: competition.links.instagram });
  }

  if (websiteLink) {
    links.push({ label: "Website", href: websiteLink });
  }

  return links;
}

function formatShareValue(value: string | undefined): string {
  return value ?? "-";
}

export function CompetitionDetailModal({
  competition,
  similarCompetitions,
  now,
  onClose,
  onOpenDetail,
}: CompetitionDetailModalProps) {
  const containerRef = useFocusTrap(onClose, true);
  const status = getCompetitionStatus(competition, now);
  const daysLeft = getDaysUntilDeadline(competition.regEnd, now);
  const websiteLink = getWebsiteLink(competition);
  const actionLinks = createActionLinks(competition);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?competition=${encodeURIComponent(competition.slug)}`
      : undefined;
  const shareText = [
    `[${competition.name}]`,
    "",
    `Registrasi: ${formatDateRange(competition.regStart, competition.regEnd)}`,
    `Penyisihan: ${formatDateRange(competition.eventStart, competition.eventEnd)}`,
    `Guidebook: ${formatShareValue(competition.links.guidebook)}`,
    `Instagram: ${formatShareValue(competition.links.instagram)}`,
    `Website: ${formatShareValue(websiteLink)}`,
  ].join("\n");

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${competition.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup detail lomba"
        className="absolute inset-0 bg-[oklch(0.13_0.02_286_/_0.78)] backdrop-blur-md"
      />

        <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.4rem] border border-white/7 bg-surface-2/90 shadow-[0_36px_110px_-56px_oklch(0.02_0.03_286)] backdrop-blur-2xl sm:rounded-[1.6rem]">
        <div className="flex items-start justify-between gap-4 px-4 py-5 sm:px-8 sm:py-7">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={status} size="md" />
            </div>

            <div>
              <p className="text-base text-zinc-400">
                {competition.category} | {competition.organizer}
              </p>
              <h3 className="mt-1.5 font-brand text-[clamp(1.85rem,3.8vw,2.75rem)] leading-[1.08] text-zinc-50">
                {competition.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookmarkButton competitionId={competition.id} size="lg" />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:border-white/18 hover:text-zinc-50"
            >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            </button>
          </div>
        </div>

        <div className="grid gap-6 px-4 pb-7 pt-0 sm:px-8 md:pb-9">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1rem] bg-black/12 p-5 text-[0.95rem] text-zinc-300 ring-1 ring-white/6">
              <dt className="text-sm uppercase tracking-[0.22em] text-zinc-500">Deadline pendaftaran</dt>
              <dd className="mt-2.5 text-[1.06rem] font-medium text-zinc-100">{formatDate(competition.regEnd)}</dd>
              <dd className="mt-2 text-sm text-zinc-400">
                {daysLeft === null
                  ? "Tanggal belum ditentukan"
                  : daysLeft === 0
                    ? "Hari terakhir"
                  : daysLeft >= 0
                    ? `Masih ada ${daysLeft} hari`
                    : "Pendaftaran sudah tutup"}
              </dd>
            </div>
            <div className="rounded-[1rem] bg-black/12 p-5 text-[0.95rem] text-zinc-300 ring-1 ring-white/6">
              <dt className="text-sm uppercase tracking-[0.22em] text-zinc-500">Penyisihan</dt>
              <dd className="mt-2.5 text-[1.06rem] font-medium leading-relaxed text-zinc-100">
                {formatDateRange(competition.eventStart, competition.eventEnd)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            <ShareButton
              shareText={shareText}
              shareUrl={shareUrl}
              competitionName={competition.name}
            />

            {actionLinks.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/9 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-200 hover:border-violet-200/20 hover:text-violet-100 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>

          {similarCompetitions.length > 0 ? (
            <section>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Kompetisi serupa
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {similarCompetitions.map((similar) => {
                  const similarStatus = getCompetitionStatus(similar, now);
                  const similarDaysLeft = getDaysUntilDeadline(similar.regEnd, now);
                  return (
                    <button
                      key={similar.id}
                      type="button"
                      onClick={() => onOpenDetail(similar)}
                      className="group min-w-0 flex-1 rounded-[1rem] border border-white/8 bg-white/[0.02] p-4 text-left transition hover:border-violet-200/20 hover:bg-violet-200/5"
                    >
                      <p className="truncate text-sm font-medium text-zinc-100 group-hover:text-violet-100">
                        {similar.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        {similar.organizer}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
                        <span>
                          {similarStatus === "open"
                            ? "Masih buka"
                            : similarStatus === "coming-soon"
                              ? "Coming Soon"
                              : "Sudah tutup"}
                        </span>
                        {similarDaysLeft !== null && similarDaysLeft >= 0 ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Sisa {similarDaysLeft} hari</span>
                          </>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
