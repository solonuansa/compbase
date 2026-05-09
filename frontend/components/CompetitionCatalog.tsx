"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CompetitionDetailModal } from "@/components/CompetitionDetailModal";
import { useFavorites } from "@/components/FavoritesContext";
import { CompetitionGrid } from "@/components/CompetitionGrid";
import { SpotlightSection } from "@/components/SpotlightSection";
import { useBookmarks } from "@/hooks/useBookmarks";
import type { Competition } from "@/lib/types";

interface CompetitionCatalogProps {
  competitions: Competition[];
  allCompetitions: Competition[];
  spotlightCompetitions: Competition[];
  totalCompetitions: number;
  now: Date;
  children?: ReactNode;
}

export function CompetitionCatalog({
  competitions,
  allCompetitions,
  spotlightCompetitions,
  totalCompetitions,
  now,
  children,
}: CompetitionCatalogProps) {
  const [activeCompetition, setActiveCompetition] = useState<Competition | null>(
    null,
  );
  const { showFavoritesOnly } = useFavorites();
  const { bookmarkedIds } = useBookmarks();

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
        <CompetitionGrid
          competitions={displayedCompetitions}
          totalCompetitions={displayedTotal}
          now={now}
          onOpenDetail={handleOpenDetail}
        />
      )}

      {activeCompetition ? (
        <CompetitionDetailModal
          competition={activeCompetition}
          now={now}
          onClose={handleCloseDetail}
        />
      ) : null}
    </>
  );
}
