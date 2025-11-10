export type SteamGame = {
  id: number;
  title: string;
  thumbnail: string | null;
  description: string | null;
};

const DETAILS_URL = "https://store.steampowered.com/api/appdetails?appids=";

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
  return {
    id: appid,
    title: d.name ?? `App ${appid}`,
    thumbnail: d.header_image ?? null,
    description: decodeHtml(d.short_description ?? "")
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

export function mapToDomain(g: SteamGame) {
  return {
    id: g.id,
    title: g.title,
    thumbnail: g.thumbnail ?? null,
    description: g.description ?? "Sem descrição disponível"
  };
}