import { openDatabaseSync } from "expo-sqlite";
import type { Game } from "../types";

const DB_NAME = "steamdb.db";
const db = openDatabaseSync(DB_NAME);

const CREATE_GAMES_TABLE = `
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    thumbnail TEXT,
    description TEXT,
    price TEXT,
    favorite INTEGER NOT NULL DEFAULT 0
  );
`;

export function initDB() {
  db.execSync(CREATE_GAMES_TABLE);
}

export function upsertGames(games: Game[]) {
  if (!games?.length) return;

  db.execSync("BEGIN");
  try {
    for (const g of games) {
      db.runSync(
        `
        INSERT OR REPLACE INTO games (id, title, thumbnail, description, price, favorite)
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          COALESCE(
            (SELECT favorite FROM games WHERE id = ?),
            ?
          )
        );
      `,
        [
          g.id,
          g.title,
          g.thumbnail ?? null,
          g.description ?? null,
          g.price ?? null,
          g.id,
          g.isFavorite ? 1 : 0,
        ]
      );
    }
    db.execSync("COMMIT");
  } catch (e) {
    db.execSync("ROLLBACK");
    throw e;
  }
}

export function setFavorite(id: number, fav: boolean) {
  db.runSync("UPDATE games SET favorite = ? WHERE id = ?", [
    fav ? 1 : 0,
    id,
  ]);
}

export function getAllGames(): Game[] {
  const rows = db.getAllSync<any>(
    `
      SELECT id, title, thumbnail, description, price, favorite
      FROM games
      ORDER BY title COLLATE NOCASE ASC;
    `
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    thumbnail: r.thumbnail,
    description: r.description,
    price: r.price,
    isFavorite: r.favorite === 1,
  }));
}

export function getAllFavorites(): Game[] {
  const rows = db.getAllSync<any>(
    `
      SELECT id, title, thumbnail, description, price, favorite
      FROM games
      WHERE favorite = 1
      ORDER BY title COLLATE NOCASE ASC;
    `
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    thumbnail: r.thumbnail,
    description: r.description,
    price: r.price,
    isFavorite: true,
  }));
}

export function hasAnyGame(): boolean {
  const row = db.getFirstSync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM games;`
  );
  return !!row?.count;
}

export function clearGames() {
  db.execSync("DELETE FROM games;");
}
