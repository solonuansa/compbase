const PENDING_SCROLL_KEY = "compbase:pending-scroll";

export function saveScrollPosition(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(PENDING_SCROLL_KEY, String(window.scrollY));
  } catch {
    // Abaikan jika sessionStorage tidak tersedia.
  }
}

export function restoreScrollPosition(): void {
  if (typeof window === "undefined") return;

  try {
    const raw = sessionStorage.getItem(PENDING_SCROLL_KEY);
    if (!raw) return;

    const position = Number.parseInt(raw, 10);
    if (Number.isFinite(position)) {
      window.scrollTo({ top: position, behavior: "instant" });
    }
    sessionStorage.removeItem(PENDING_SCROLL_KEY);
  } catch {
    // Abaikan jika sessionStorage tidak tersedia.
  }
}
