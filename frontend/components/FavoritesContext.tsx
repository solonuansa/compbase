"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface FavoritesContextValue {
  showFavoritesOnly: boolean;
  toggleFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  showFavoritesOnly: false,
  toggleFavorites: () => {},
});

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleFavorites = useCallback((): void => {
    setShowFavoritesOnly((prev) => !prev);
  }, []);

  return (
    <FavoritesContext.Provider value={{ showFavoritesOnly, toggleFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  return useContext(FavoritesContext);
}
