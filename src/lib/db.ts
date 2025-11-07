import { openDatabaseSync } from "expo-sqlite";
import type { Game } from "../types";

// use o mesmo nome sempre; se quiser "reset total", mude esse nome (ex: games_v2.db)
const db = openDatabaseSync("games.db");

export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      thumbnail TEXT,
      description TEXT
    );
  `);
}

export function upsertGames(games: Game[]) {
  if (!games?.length) return;
  db.execSync("BEGIN");
  try {
    for (const g of games) {
      db.runSync(
        `INSERT OR REPLACE INTO games (id, title, thumbnail, description)
         VALUES (?, ?, ?, ?)`,
        [g.id, g.title, g.thumbnail ?? null, g.description ?? null]
      );
    }
    db.execSync("COMMIT");
  } catch (e) {
    db.execSync("ROLLBACK");
    throw e;
  }
}

export function getAllGames(): Game[] {
  return db.getAllSync<Game>(`
    SELECT id, title, thumbnail, description
    FROM games
    ORDER BY title COLLATE NOCASE ASC;
  `);
}

export function hasAnyGame(): boolean {
  const row = db.getFirstSync<{ count: number }>(`SELECT COUNT(*) as count FROM games;`);
  return !!row?.count;
}

export function clearGames() {
  db.execSync("DELETE FROM games;");
}