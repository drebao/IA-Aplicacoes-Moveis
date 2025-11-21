import type { Game } from "../types";

export type SteamGame = {
  id: number;
  title: string;
  thumbnail: string | null;
  description: string | null;
  priceText: string | null;
};

const DETAILS_URL =
  "https://store.steampowered.com/api/appdetails?cc=br&l=portuguese&appids=";
const SEARCH_RESULTS_URL =
  "https://store.steampowered.com/search/results/";

const POPULAR_APPIDS = [
  1086940, // Baldur's Gate 3
  413150,  // Stardew Valley
  105600,  // Terraria
  367520,  // Hollow Knight
  504230,  // Celeste
  620,     // Portal 2
  292030,  // The Witcher 3
  1174180, // Red Dead Redemption 2
  588650,  // Dead Cells
  646570,  // Slay the Spire
  427520,  // Factorio
  632360,  // Risk of Rain 2
  264710,  // Subnautica
  374320,  // Dark Souls III
  252950,  // Rocket League
  730      // CS2
];

async function fetchWithTimeout(url: string, ms = 10000): Promise<Response> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, { signal: ctl.signal });
  } finally {
    clearTimeout(t);
  }
}

function decodeHtml(s: string) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

async function fetchGameDetails(appid: number): Promise<SteamGame | null> {
  const res = await fetchWithTimeout(`${DETAILS_URL}${appid}`);
  if (!res.ok) return null;

  const json = await res.json();
  const node = json?.[appid];
  if (!node?.success || !node?.data || node.data.type !== "game") return null;

  const d = node.data;

  let priceText: string | null = null;
  if (d.is_free) {
    priceText = "Gratuito para jogar";
  } else if (d.price_overview?.final_formatted) {
    priceText = d.price_overview.final_formatted as string;
  }

  return {
    id: appid,
    title: d.name ?? `App ${appid}`,
    thumbnail: d.header_image ?? null,
    description: decodeHtml(d.short_description ?? ""),
    priceText,
  };
}

export async function fetchFeatured(): Promise<SteamGame[]> {
  const results: SteamGame[] = [];
  const chunkSize = 6;
  for (let i = 0; i < POPULAR_APPIDS.length; i += chunkSize) {
    const part = await Promise.all(
      POPULAR_APPIDS.slice(i, i + chunkSize).map((id) =>
        fetchGameDetails(id).catch(() => null)
      )
    );
    results.push(...(part.filter(Boolean) as SteamGame[]));
  }
  return results.filter((g) => !!g.thumbnail);
}

export function mapToDomain(g: SteamGame): Game {
  return {
    id: g.id,
    title: g.title,
    thumbnail: g.thumbnail ?? null,
    description: g.description ?? "Sem descrição disponível",
    isFavorite: false,
    price: g.priceText ?? null,
  };
}

export async function searchGames(term: string): Promise<Game[]> {
  const q = term.trim();
  if (!q) return [];

  const qs =
    `term=${encodeURIComponent(q)}` +
    `&category1=998` +
    `&json=1`;

  const url = `${SEARCH_RESULTS_URL}?${qs}`;

  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      return [];
    }

    const json: any = await res.json();
    const items = json?.items ?? [];
    if (!Array.isArray(items)) {
      return [];
    }

    const ids: number[] = [];
    for (const item of items) {
      const logo: string = item.logo;
      if (!logo) continue;

      let id: number | null = null;

      const m1 = /\/apps\/(\d+)\//.exec(logo);
      if (m1 && m1[1]) {
        id = Number(m1[1]);
      } else {
        const m2 = /steam\/\w+\/(\d+)\//.exec(logo);
        if (m2 && m2[1]) {
          id = Number(m2[1]);
        }
      }

      if (id && !Number.isNaN(id) && !ids.includes(id)) {
        ids.push(id);
      }
    }

    const limited = ids.slice(0, 15);

    const detailed = await Promise.all(
      limited.map((id) => fetchGameDetails(id).catch(() => null))
    );

    const games: Game[] = (detailed.filter(Boolean) as SteamGame[]).map((g) => ({
      id: g.id,
      title: g.title,
      thumbnail: g.thumbnail,
      description: g.description ?? "Sem descrição disponível",
      isFavorite: false,
      price: g.priceText ?? null,
    }));

    return games;
  } catch {
    return [];
  }
}
