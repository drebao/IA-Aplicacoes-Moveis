import type { Game } from "../types";
import { hasAnyGame, upsertGames, clearGames } from "../lib/db";
import games from "../data/games.json";

function mapItemToGame(it: any, idx: number): Game {
  const id = Number(it.id ?? idx + 1);
  const title = String(it.title ?? it.name ?? it.nome ?? `Jogo ${id}`);
  const thumbnail = it.thumbnail ?? it.image ?? it.img ?? null;
  const description = it.description ?? it.descricao ?? it.short_description ?? null;
  return { id, title, thumbnail, description };
}

// force=true só quando você quiser regravar o banco
export async function seedIfNeeded(options?: { force?: boolean }) {
  const force = !!options?.force;
  if (!force && hasAnyGame()) return;
  if (force) clearGames();

  const list = Array.isArray(games) ? games : [];
  const mapped = list.map(mapItemToGame);
  if (mapped.length) upsertGames(mapped);
}