import { parseFeed, type FeedDef } from './news-parse';
import type { NewsItem, NewsResponse, NewsSource, NewsTag } from './news-types';

/**
 * Fontes padrão.
 *  - STJ e Agência Brasil: feeds testados (RSS 2.0).
 *  - ConJur: URL oficial do feed, listada em diretório público (falha em silêncio se indisponível).
 * Para somar TST, TRT-13, INSS etc., defina NEWS_EXTRA_FEEDS (JSON) no ambiente:
 *   [{"id":"tst","name":"TST","url":"https://…","home":"https://www.tst.jus.br","tag":"trabalhista"}]
 */
const DEFAULT_FEEDS: FeedDef[] = [
  {
    id: 'stj',
    name: 'STJ',
    url: 'https://res.stj.jus.br/hrestp-c-portalp/RSS.xml',
    home: 'https://www.stj.jus.br',
    defaultTag: 'tribunais',
  },
  {
    id: 'conjur',
    name: 'ConJur',
    url: 'https://www.conjur.com.br/rss.xml',
    home: 'https://www.conjur.com.br',
    defaultTag: 'tribunais',
  },
  {
    id: 'agenciabrasil',
    name: 'Agência Brasil',
    url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml',
    home: 'https://agenciabrasil.ebc.com.br',
    defaultTag: 'tribunais',
    filter: true, // feed generalista: só passam matérias trabalhistas/previdenciárias
  },
];

const TAGS: NewsTag[] = ['trabalhista', 'previdenciario', 'tribunais'];

function extraFeeds(): FeedDef[] {
  const raw = process.env.NEWS_EXTRA_FEEDS;
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as { id: string; name: string; url: string; home: string; tag?: NewsTag; filter?: boolean }[];
    return list
      .filter((f) => f?.id && f?.name && f?.url?.startsWith('http') && f?.home)
      .map((f) => ({
        id: f.id,
        name: f.name,
        url: f.url,
        home: f.home,
        defaultTag: f.tag && TAGS.includes(f.tag) ? f.tag : 'tribunais',
        filter: f.filter,
      }));
  } catch {
    return [];
  }
}

async function fetchFeed(def: FeedDef): Promise<NewsItem[]> {
  const res = await fetch(def.url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; SamilaBeatrizBot/1.0; +https://samila-beatriz-advocacia.vercel.app)',
      accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    },
    signal: AbortSignal.timeout(8000),
    // Cache de dados do Next: cada feed é buscado no máximo a cada 30 min
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseFeed(await res.text(), def);
}

/** Agrega todos os feeds. Uma fonte fora do ar nunca derruba as outras. */
export async function loadNews(): Promise<NewsResponse> {
  const feeds = [...DEFAULT_FEEDS, ...extraFeeds()];
  const results = await Promise.allSettled(feeds.map(fetchFeed));

  const sources: NewsSource[] = [];
  const all: NewsItem[] = [];

  results.forEach((r, i) => {
    const def = feeds[i];
    if (r.status === 'fulfilled') {
      all.push(...r.value.slice(0, 20));
      sources.push({ id: def.id, name: def.name, home: def.home, ok: true, count: r.value.length });
    } else {
      sources.push({ id: def.id, name: def.name, home: def.home, ok: false, count: 0 });
    }
  });

  const seen = new Set<string>();
  const items = all
    .filter((n) => (seen.has(n.link) ? false : (seen.add(n.link), true)))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 48);

  return { items, sources, updatedAt: new Date().toISOString() };
}
