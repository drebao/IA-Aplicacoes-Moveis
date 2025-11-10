import { hasAnyGame, upsertGames } from "../lib/db";

const FALLBACK = [
  { id: 1086940, title: "Baldur's Gate 3", thumbnail: null, description: "RPG de mesa em forma digital, liberdade total de escolhas." },
  { id: 413150,  title: "Stardew Valley",  thumbnail: null, description: "Fazenda, relacionamentos e exploração." },
  { id: 105600,  title: "Terraria",        thumbnail: null, description: "Aventura e construção em 2D." }
];

export async function seedIfNeeded() {
  if (hasAnyGame()) return;
  upsertGames(FALLBACK);
}