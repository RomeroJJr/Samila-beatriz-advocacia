import { XMLParser } from 'fast-xml-parser';
import type { NewsItem, NewsTag } from './news-types';

export type FeedDef = {
  id: string;
  name: string;
  url: string;
  home: string;
  /** Tag usada quando nenhuma palavra-chave bate. */
  defaultTag: NewsTag;
  /** true → só entram itens com palavras-chave trabalhistas/previdenciárias (feeds generalistas). */
  filter?: boolean;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  processEntities: true,
  htmlEntities: true,
  parseTagValue: false,
  trimValues: true,
  isArray: (name) => name === 'item' || name === 'entry',
});

const MONTHS: Record<string, string> = {
  jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
  jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12',
};

/**
 * Datas do feed do STJ vêm como "Seg, out 19 2026 06:50:00" (pt-BR, sem fuso).
 * Assume America/Fortaleza/Brasília (UTC-03, sem horário de verão desde 2019).
 * Qualquer outro formato (RFC 822, ISO) cai no Date.parse padrão.
 */
export function parseDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();

  const pt = s.match(/^[A-Za-zçÇ]{3,},?\s+([A-Za-zçÇ]{3})\.?\s+(\d{1,2})\s+(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (pt) {
    const month = MONTHS[pt[1].toLowerCase()];
    if (month) {
      const iso = `${pt[3]}-${month}-${pt[2].padStart(2, '0')}T${pt[4]}:${pt[5]}:${pt[6] ?? '00'}-03:00`;
      const d = new Date(iso);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    }
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const PREVIDENCIARIO =
  /(previdenci|\binss\b|aposentad|auxilio[- ]?(doenca|acidente|reclusao)|pensao por morte|\bbpc\b|\bloas\b|salario[- ]maternidade|\bcnis\b|\brgps\b|beneficio (previdenci|assistencial|por incapacidade)|segurad[oa])/;
const TRABALHISTA =
  /(trabalhist|trabalhador|empregad|empregador|\bclt\b|\bfgts\b|rescis|jornada de trabalho|horas extras|sindicat|justica do trabalho|\btst\b|\btrt\b|vinculo empregaticio|verbas (rescisorias|trabalhistas)|carteira assinada|demissao|aviso previo|ferias)/;

/** Classifica por palavras-chave; devolve null se nada bater. */
export function classify(text: string): NewsTag | null {
  const t = normalize(text);
  if (PREVIDENCIARIO.test(t)) return 'previdenciario';
  if (TRABALHISTA.test(t)) return 'trabalhista';
  return null;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text: string, max = 220): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30)).replace(/[\s.,;:–—-]+$/, '') + '…';
}

type XmlNode = string | { '#text'?: string; '@_href'?: string } | undefined;

const text = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && '#text' in v) return String((v as { '#text': unknown })['#text'] ?? '');
  return '';
};

const linkOf = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) {
    const alt = v.find((l) => l && (l['@_rel'] === 'alternate' || !l['@_rel'])) ?? v[0];
    return linkOf(alt);
  }
  if (v && typeof v === 'object') {
    const n = v as { '@_href'?: string; '#text'?: string };
    return n['@_href'] ?? n['#text'] ?? '';
  }
  return '';
};

const safeUrl = (u: string): string | null => {
  try {
    const url = new URL(u.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

/** Converte um XML RSS 2.0 / RDF / Atom em itens normalizados. Nunca lança por item malformado. */
export function parseFeed(xml: string, def: FeedDef): NewsItem[] {
  const doc = parser.parse(xml) as Record<string, any>;
  const raw: Record<string, XmlNode | unknown>[] =
    doc?.rss?.channel?.item ?? doc?.['rdf:RDF']?.item ?? doc?.feed?.entry ?? [];

  const items: NewsItem[] = [];

  for (const it of raw) {
    try {
      const title = stripHtml(text(it.title));
      const link = safeUrl(linkOf(it.link) || text(it.guid));
      if (!title || !link) continue;

      const summary = truncate(stripHtml(text(it.description) || text(it.summary) || text(it['content:encoded'])));
      const published =
        parseDate(text(it.pubDate) || text(it.published) || text(it.updated) || text(it['dc:date'])) ?? null;
      if (!published) continue;

      const matched = classify(`${title} ${summary}`);
      if (def.filter && !matched) continue;

      items.push({
        id: `${def.id}:${link}`,
        title,
        link,
        summary: summary === title ? '' : summary,
        source: def.name,
        tag: matched ?? def.defaultTag,
        publishedAt: published,
      });
    } catch {
      // item malformado: ignora e segue
    }
  }

  return items;
}
