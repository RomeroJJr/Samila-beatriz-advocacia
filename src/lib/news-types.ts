export type NewsTag = 'trabalhista' | 'previdenciario' | 'tribunais';

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  /** Resumo em texto puro, truncado. */
  summary: string;
  source: string;
  tag: NewsTag;
  /** ISO 8601 (UTC). */
  publishedAt: string;
};

export type NewsSource = {
  id: string;
  name: string;
  home: string;
  ok: boolean;
  count: number;
};

export type NewsResponse = {
  items: NewsItem[];
  sources: NewsSource[];
  /** ISO 8601 — momento da montagem da resposta. */
  updatedAt: string;
};
