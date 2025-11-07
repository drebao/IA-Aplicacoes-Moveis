// src/hooks/useGames.ts
import { useEffect, useState, useCallback } from "react";
import type { Game } from "../types";
import { initDB, getAllGames } from "../lib/db";
import { seedIfNeeded } from "../services/localSeed";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const rows = getAllGames();
    setGames(rows);
  }, []);

  useEffect(() => {
    initDB();
    seedIfNeeded({ force: true });
    load();
    setLoading(false);
  }, [load]);

  return { games, loading, reload: load };
}