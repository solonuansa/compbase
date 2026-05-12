import { StatusBadge } from "@/components/StatusBadge";
import type { Competition } from "@/lib/types";
import {
  formatDate,
  getCompetitionStatus,
  getDaysUntilDeadline,
} from "@/lib/utils/competitions";

interface CompetitionTimelineProps {
  competitions: Competition[];
  totalCompetitions: number;
  now: Date;
  onOpenDetail: (competition: Competition) => void;
}

interface TimelineGroup {
  key: string;
  label: string;
  items: Competition[];
  isCurrentMonth: boolean;
}

function getRemainingDaysLabel(daysLeft: number | null): string {
  if (daysLeft === null) {
    return "Tanggal belum ditentukan";
  }

  if (daysLeft === 0) {
    return "Hari terakhir";
  }

  if (daysLeft > 0) {
    return `${daysLeft} hari lagi`;
  }

  return "Sudah lewat";
}

function getMonthKey(regEnd: string): string {
  if (!regEnd.trim()) {
    return "unscheduled";
  }

  const [year, month] = regEnd.split("-");
  return `${year}-${month}`;
}

function getMonthLabel(monthKey: string): string {
  if (monthKey === "unscheduled") {
    return "Belum dijadwalkan";
  }

  const [yearInput, monthInput] = monthKey.split("-");
  const year = Number.parseInt(yearInput ?? "", 10);
  const month = Number.parseInt(monthInput ?? "", 10);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return "Belum dijadwalkan";
  }

  const monthDate = new Date(Date.UTC(year, month - 1, 1));

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(monthDate);
}

function getCurrentMonthKey(now: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  });
  const [year, month] = formatter.format(now).split("-");
  return `${year}-${month}`;
}

function compareCompetitionsByDeadline(left: Competition, right: Competition): number {
  const leftDate = left.regEnd.trim();
  const rightDate = right.regEnd.trim();

  if (!leftDate && !rightDate) {
    return left.name.localeCompare(right.name, "id-ID");
  }

  if (!leftDate) {
    return 1;
  }

  if (!rightDate) {
    return -1;
  }

  const byDate = leftDate.localeCompare(rightDate);
  if (byDate !== 0) {
    return byDate;
  }

  return left.name.localeCompare(right.name, "id-ID");
}

function buildTimelineGroups(competitions: Competition[], now: Date): TimelineGroup[] {
  const currentMonthKey = getCurrentMonthKey(now);
  const grouped = competitions.reduce<Map<string, Competition[]>>((map, competition) => {
    const key = getMonthKey(competition.regEnd);
    const currentItems = map.get(key) ?? [];
    currentItems.push(competition);
    map.set(key, currentItems);
    return map;
  }, new Map<string, Competition[]>());

  return Array.from(grouped.entries())
    .sort(([leftKey], [rightKey]) => {
      if (leftKey === "unscheduled") {
        return 1;
      }

      if (rightKey === "unscheduled") {
        return -1;
      }

      return leftKey.localeCompare(rightKey);
    })
    .map(([key, items]) => ({
      key,
      label: getMonthLabel(key),
      items: [...items].sort(compareCompetitionsByDeadline),
      isCurrentMonth: key === currentMonthKey,
    }));
}

function TimelineCard({
  competition,
  now,
  onOpenDetail,
}: {
  competition: Competition;
  now: Date;
  onOpenDetail: (competition: Competition) => void;
}) {
  const status = getCompetitionStatus(competition, now);
  const daysLeft = getDaysUntilDeadline(competition.regEnd, now);
  const daysLabel = getRemainingDaysLabel(daysLeft);

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpenDetail(competition)}
        className="group w-full rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.055]"
      >
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={status} size="sm" />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {competition.category}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-tight text-zinc-100">
          {competition.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">{competition.organizer}</p>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-zinc-500">Deadline</dt>
            <dd className="font-medium text-zinc-200">{formatDate(competition.regEnd)}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-zinc-500">Sisa waktu</dt>
            <dd className="font-semibold text-amber-200">{daysLabel}</dd>
          </div>
        </dl>
      </button>
    </li>
  );
}

export function CompetitionTimeline({
  competitions,
  totalCompetitions,
  now,
  onOpenDetail,
}: CompetitionTimelineProps) {
  if (totalCompetitions === 0) {
    return (
      <section className="soft-panel rounded-[1.5rem] border border-line-soft/80 bg-surface-1/24 p-8 text-center">
        <h2 className="font-brand text-3xl text-zinc-50">Belum ada yang cocok</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Coba ganti kata kunci, kategori, atau tab biar hasilnya lebih banyak.
        </p>
      </section>
    );
  }

  const timelineGroups = buildTimelineGroups(competitions, now);
  const currentMonthKey = getCurrentMonthKey(now);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 text-center sm:text-left">
        <div className="w-full sm:w-auto">
          <p className="section-kicker">Timeline lomba</p>
          <h2 className="mt-2 font-brand text-[1.55rem] text-zinc-50 sm:text-[2.15rem]">
            Lihat jadwal berdasarkan bulan
          </h2>
        </div>
        <p className="mx-auto max-w-sm text-[0.85rem] leading-relaxed text-zinc-300 sm:mx-0 sm:text-[0.95rem]">
          Menampilkan {competitions.length} dari {totalCompetitions} lomba dalam urutan waktu.
        </p>
        {timelineGroups.some((g) => !g.isCurrentMonth) ? (
          <button
            type="button"
            onClick={() =>
              document
                .getElementById(`month-${currentMonthKey}`)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-sm text-violet-200/80 transition hover:text-violet-100"
          >
            &larr; Kembali ke bulan ini
          </button>
        ) : null}
      </div>

      <div className="sticky -top-1 z-10 -mx-4 overflow-x-auto border-b border-white/[0.06] bg-zinc-950/70 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-2">
          {timelineGroups.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() =>
                document
                  .getElementById(`month-${group.key}`)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition ${
                group.isCurrentMonth
                  ? "bg-violet-300/18 text-violet-100"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
              }`}
            >
              {group.label}
              <span className="text-[10px] opacity-60">
                {group.items.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden gap-4 overflow-x-auto pb-2 md:flex">
        {timelineGroups.map((group) => (
          <section
            key={group.key}
            className="soft-panel min-h-[24rem] w-[22rem] shrink-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4"
          >
            <h3
              id={`month-${group.key}`}
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-300"
            >
              {group.label}
              <span className="text-xs text-zinc-500">
                ({group.items.length})
              </span>
              {group.isCurrentMonth ? (
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/14 px-2 py-0.5 text-[10px] tracking-[0.08em] text-emerald-100">
                  Bulan ini
                </span>
              ) : null}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.items.map((competition) => (
                <TimelineCard
                  key={competition.id}
                  competition={competition}
                  now={now}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="space-y-4 md:hidden">
        {timelineGroups.map((group) => (
          <section
            key={group.key}
            className="soft-panel rounded-3xl border border-white/10 bg-white/[0.03] p-4"
          >
            <h3
              id={`month-${group.key}`}
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-300"
            >
              {group.label}
              <span className="text-xs text-zinc-500">
                ({group.items.length})
              </span>
              {group.isCurrentMonth ? (
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/14 px-2 py-0.5 text-[10px] tracking-[0.08em] text-emerald-100">
                  Bulan ini
                </span>
              ) : null}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.items.map((competition) => (
                <TimelineCard
                  key={competition.id}
                  competition={competition}
                  now={now}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
