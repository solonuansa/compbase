"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

interface BookmarkButtonProps {
  competitionId: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { button: "h-7 w-7", icon: 14 },
  md: { button: "h-8 w-8", icon: 16 },
  lg: { button: "h-10 w-10", icon: 18 },
};

export function BookmarkButton({ competitionId, size = "md" }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks();
  const active = isBookmarked(competitionId);
  const dimensions = SIZE_MAP[size];

  const handleClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    toggle(competitionId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Hapus dari favorit" : "Tambah ke favorit"}
      aria-pressed={active}
      className={`inline-flex ${dimensions.button} items-center justify-center rounded-full border transition ${
        active
          ? "border-amber-300/30 bg-amber-300/15 text-amber-300 hover:border-amber-300/40 hover:bg-amber-300/20"
          : "border-white/10 text-zinc-400 hover:border-white/18 hover:text-zinc-200"
      }`}
    >
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" />
      </svg>
    </button>
  );
}
