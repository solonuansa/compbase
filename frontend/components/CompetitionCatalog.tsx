"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CompetitionDetailModal } from "@/components/CompetitionDetailModal";
import { useFavorites } from "@/components/FavoritesContext";
import { CompetitionGrid } from "@/components/CompetitionGrid";
import { CompetitionTimeline } from "@/components/CompetitionTimeline";
import { SpotlightSection } from "@/components/SpotlightSection";
import { useBookmarks } from "@/hooks/useBookmarks";
import type { Competition, CompetitionView } from "@/lib/types";

interface CompetitionCatalogProps {
  competitions: Competition[];
  allCompetitions: Competition[];
  spotlightCompetitions: Competition[];
  totalCompetitions: number;
  now: Date;
  initialView: CompetitionView;
  initialCompetition?: Competition;
  children?: ReactNode;
}

export function CompetitionCatalog({
  competitions,
  allCompetitions,
  spotlightCompetitions,
  totalCompetitions,
  now,
  initialView,
  initialCompetition,
  children,
}: CompetitionCatalogProps) {
  const [activeCompetition, setActiveCompetition] = useState<Competition | null>(
    initialCompetition ?? null,
  );
  const [viewMode, setViewMode] = useState<CompetitionView>(initialView);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showFavoritesOnly } = useFavorites();
  const { bookmarkedIds } = useBookmarks();

  const handleChangeView = (nextView: CompetitionView): void => {
    setViewMode(nextView);
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextView === "grid") {
      nextParams.delete("view");
    } else {
      nextParams.set("view", nextView);
    }

    const nextQuery = nextParams.toString();
    const nextHref = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(nextHref, { scroll: false });
  };

  const handleOpenDetail = (competition: Competition): void => {
    setActiveCompetition(competition);
  };

  const handleCloseDetail = (): void => {
    setActiveCompetition(null);
  };

  const displayedCompetitions = useMemo(() => {
    if (showFavoritesOnly) {
      const bookmarkedSet = new Set(bookmarkedIds);
      return allCompetitions.filter((c) => bookmarkedSet.has(c.id));
    }

    return competitions;
  }, [showFavoritesOnly, allCompetitions, bookmarkedIds, competitions]);

  const displayedTotal = showFavoritesOnly
    ? displayedCompetitions.length
    : totalCompetitions;

  return (
    <>
      {!showFavoritesOnly ? (
        <SpotlightSection
          competitions={spotlightCompetitions}
          now={now}
          onOpenDetail={handleOpenDetail}
        />
      ) : null}

      {children}

      {showFavoritesOnly && bookmarkedIds.length === 0 ? (
        <section className="soft-panel rounded-[1.5rem] border border-line-soft/80 bg-surface-1/24 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/15 bg-amber-300/8 text-amber-300">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" />
            </svg>
          </div>
          <h2 className="mt-5 font-brand text-2xl text-zinc-50">
            Belum ada favorit
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base">
            Klik ikon bookmark di kartu lomba untuk menyimpan kompetisi favoritmu.
            Datanya tersimpan di perangkat ini, jadi kamu bisa kembali kapan saja.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-end">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => handleChangeView("grid")}
                aria-pressed={viewMode === "grid"}
                className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition ${
                  viewMode === "grid"
                    ? "bg-violet-300/20 text-violet-100"
                    : "text-zinc-300 hover:text-zinc-100"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => handleChangeView("timeline")}
                aria-pressed={viewMode === "timeline"}
                className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition ${
                  viewMode === "timeline"
                    ? "bg-violet-300/20 text-violet-100"
                    : "text-zinc-300 hover:text-zinc-100"
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          <div key={viewMode} className="view-enter">
            {viewMode === "grid" ? (
              <CompetitionGrid
                competitions={displayedCompetitions}
                totalCompetitions={displayedTotal}
                now={now}
                onOpenDetail={handleOpenDetail}
              />
            ) : (
              <CompetitionTimeline
                competitions={displayedCompetitions}
                totalCompetitions={displayedTotal}
                now={now}
                onOpenDetail={handleOpenDetail}
              />
            )}
          </div>
        </section>
      )}

      {activeCompetition ? (
        <CompetitionDetailModal
          competition={activeCompetition}
          similarCompetitions={allCompetitions.filter(
            (c) =>
              c.category === activeCompetition.category &&
              c.id !== activeCompetition.id,
          ).slice(0, 3)}
          now={now}
          onClose={handleCloseDetail}
          onOpenDetail={handleOpenDetail}
        />
      ) : null}
    </>
  );
}
