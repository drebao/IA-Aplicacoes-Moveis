import { useCallback, useEffect, useState } from "react";
import type { Game } from "../types";
import { getAllFavorites } from "../lib/db";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    try {
      const rows = getAllFavorites();
      setFavorites(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { favorites, loading, reload: load };
}
