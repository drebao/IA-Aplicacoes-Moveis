import { fetchFeatured, mapToDomain } from "./api";
import { upsertGames } from "../lib/db";

export async function syncFeatured(): Promise<number> {
  const items = await fetchFeatured();
  const mapped = items.map(mapToDomain);
  if (mapped.length) upsertGames(mapped);
  return mapped.length;
}