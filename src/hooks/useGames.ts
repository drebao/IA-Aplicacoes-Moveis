// src/hooks/useGames.ts
import { useEffect, useState, useCallback, useRef } from "react";
import type { Game } from "../types";
import { initDB, getAllGames /*, clearGames*/ } from "../lib/db";
import { seedIfNeeded } from "../services/localSeed";
import { syncFeatured } from "../services/sync";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

function isOnlineStable(state: NetInfoState | null): boolean {
  if (!state) return false;
  const reachable = state.isInternetReachable;
  return !!(state.isConnected && (reachable === null || reachable === undefined || reachable));
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const lastOnlineRef = useRef<boolean>(false);
  const coolingRef = useRef<NodeJS.Timeout | null>(null);

  const loadFromDB = useCallback(() => {
    const rows = getAllGames();
    // de-dup por título, por garantia
    const unique = rows.filter(
      (g, i, self) =>
        i === self.findIndex((x) => x.title.trim().toLowerCase() === g.title.trim().toLowerCase())
    );
    setGames(unique);
  }, []);

  const syncIfOnline = useCallback(async () => {
    try {
      setError(null);
      await syncFeatured();
      setOffline(false);
      console.log("🌐 Online: sincronizado com a Steam");
    } catch (e) {
      // Se falhar (sem rede/CORS), mantemos cache
      setOffline(true);
      console.log("⚠️ Sync falhou — usando SQLite");
    } finally {
      loadFromDB();
    }
  }, [loadFromDB]);

  // Carga inicial única
  useEffect(() => {
    let unsub = () => {};
    let finished = false;

    (async () => {
      try {
        setLoading(true);
        initDB();

        seedIfNeeded(); 
        loadFromDB(); 

        const s = await NetInfo.fetch();
        const online = isOnlineStable(s);
        lastOnlineRef.current = online;
        setOffline(!online);

        if (online) {
          await syncIfOnline();
        }
      } catch (e: any) {
        setError(e?.message ?? "Erro inesperado na inicialização");
      } finally {
        finished = true;
        setLoading(false);
        const sub = NetInfo.addEventListener((state) => {
          if (!finished) return;

          const nowOnline = isOnlineStable(state);
          setOffline(!nowOnline);

          if (coolingRef.current) return;
          coolingRef.current = setTimeout(() => {
            coolingRef.current = null;
          }, 600);

          if (!lastOnlineRef.current && nowOnline) {
            lastOnlineRef.current = true;
            syncIfOnline();
            return;
          }

          if (lastOnlineRef.current && !nowOnline) {
            lastOnlineRef.current = false;
            console.log("💾 Agora OFFLINE — lendo do SQLite");
            loadFromDB();
            return;
          }
        });
        unsub = sub;
      }
    })();

    return () => {
      if (coolingRef.current) clearTimeout(coolingRef.current);
      try { unsub && (unsub as any)(); } catch {}
    };
  }, [loadFromDB, syncIfOnline]);

  const reload = useCallback(async () => {
    if (offline) {
      console.log("↻ Reload ignorado (offline) — mostrando cache");
      loadFromDB();
      return;
    }
    setLoading(true);
    try {
      await syncIfOnline();
    } finally {
      setLoading(false);
    }
  }, [offline, loadFromDB, syncIfOnline]);

  return { games, loading, error, offline, reload };
}