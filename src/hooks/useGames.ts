import { useEffect, useState, useCallback } from "react";
import type { Game } from "../types";
import { initDB, getAllGames } from "../lib/db";
import { seedIfNeeded } from "../services/localSeed";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromDB = useCallback(() => {
    const rows = getAllGames();
    setGames(rows);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      loadFromDB();
    } catch {
      setError("Erro ao carregar jogos locais.");
    } finally {
      setLoading(false);
    }
  }, [loadFromDB]);

  useEffect(() => {
    initDB();
    seedIfNeeded();   // popula a primeira vez com games.json
    reload();
  }, [reload]);

  return { games, loading, error, reload };
}