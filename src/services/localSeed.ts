import { hasAnyGame, upsertGames } from "../lib/db";

// Seed mínimo só para não ficar vazio na 1ª execução totalmente offline.
// (thumbnails podem ficar null; assim que houver internet, a sync baixa capas reais)
const FALLBACK = [
  { id: 1086940, title: "Baldur's Gate 3", thumbnail: null, description: "RPG de mesa em forma digital, liberdade total de escolhas." },
  { id: 413150,  title: "Stardew Valley",  thumbnail: null, description: "Fazenda, relacionamentos e exploração." },
  { id: 105600,  title: "Terraria",        thumbnail: null, description: "Aventura e construção em 2D." }
];

export async function seedIfNeeded() {
  // Se já tem algo no banco, não faz nada
  if (hasAnyGame()) return;
  // Povoa com 3 jogos mínimos (sem depender de arquivo externo)
  upsertGames(FALLBACK);
}