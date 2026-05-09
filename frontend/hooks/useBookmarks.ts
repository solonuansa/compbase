import { useCallback, useMemo, useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "compbase:bookmarks";
const MAX_BOOKMARKS = 50;
const BOOKMARKS_CHANGE_EVENT = "compbase:bookmarks-change";

const bookmarksSchema = z.array(z.string()).max(MAX_BOOKMARKS);

function emitBookmarksChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BOOKMARKS_CHANGE_EVENT));
}

// Referensi tunggal untuk snapshot kosong agar server & client cocok saat hydration.
const EMPTY_SNAPSHOT: string[] = [];

// Cache untuk menghindari infinite loop useSyncExternalStore.
// Snapshot harus stabil secara referensial jika datanya tidak berubah.
let cachedRaw: string | null = null;
let cachedParsed: string[] = EMPTY_SNAPSHOT;

function getBookmarksFromStorage(): string[] {
  if (typeof window === "undefined") return cachedParsed;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === cachedRaw) {
      return cachedParsed;
    }

    if (!raw) {
      cachedRaw = null;
      cachedParsed = EMPTY_SNAPSHOT;
      return cachedParsed;
    }

    const parsed = JSON.parse(raw) as unknown;
    const result = bookmarksSchema.safeParse(parsed);

    if (!result.success) {
      // Data corrupt, hapus saja.
      localStorage.removeItem(STORAGE_KEY);
      cachedRaw = null;
      cachedParsed = EMPTY_SNAPSHOT;
      return cachedParsed;
    }

    cachedRaw = raw;
    cachedParsed = result.data;
    return cachedParsed;
  } catch {
    return cachedParsed;
  }
}

function saveBookmarksToStorage(ids: string[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage mungkin penuh atau tidak tersedia.
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (): void => callback();

  window.addEventListener(BOOKMARKS_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(BOOKMARKS_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): string[] {
  return getBookmarksFromStorage();
}

function getServerSnapshot(): string[] {
  return EMPTY_SNAPSHOT;
}

class BookmarkStore {
  private cachedSnapshot: string[] | null = null;

  getSnapshot(): string[] {
    if (this.cachedSnapshot === null) {
      this.cachedSnapshot = getBookmarksFromStorage();
    }
    return this.cachedSnapshot;
  }

  private invalidateCache(): void {
    this.cachedSnapshot = null;
    emitBookmarksChange();
  }

  toggle(id: string): boolean {
    const current = new Set(this.getSnapshot());
    const willBeBookmarked = !current.has(id);

    if (willBeBookmarked && current.size >= MAX_BOOKMARKS) {
      // Batas tercapai, tidak menambah.
      return false;
    }

    if (willBeBookmarked) {
      current.add(id);
    } else {
      current.delete(id);
    }

    saveBookmarksToStorage(Array.from(current));
    this.invalidateCache();
    return willBeBookmarked;
  }

  isBookmarked(id: string): boolean {
    return this.getSnapshot().includes(id);
  }

  cleanup(validIds: string[]): void {
    const validSet = new Set(validIds);
    const current = this.getSnapshot();
    const filtered = current.filter((id) => validSet.has(id));

    if (filtered.length !== current.length) {
      saveBookmarksToStorage(filtered);
      this.invalidateCache();
    }
  }
}

const store = new BookmarkStore();

export interface UseBookmarksReturn {
  bookmarkedIds: string[];
  isBookmarked: (id: string) => boolean;
  toggle: (id: string) => boolean;
  cleanup: (validIds: string[]) => void;
}

export function useBookmarks(): UseBookmarksReturn {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const bookmarkedSet = useMemo(() => new Set(snapshot), [snapshot]);

  const isBookmarked = useCallback(
    (id: string): boolean => bookmarkedSet.has(id),
    [bookmarkedSet],
  );

  const toggle = useCallback((id: string): boolean => store.toggle(id), []);

  const cleanup = useCallback(
    (validIds: string[]): void => store.cleanup(validIds),
    [],
  );

  return {
    bookmarkedIds: snapshot,
    isBookmarked,
    toggle,
    cleanup,
  };
}
