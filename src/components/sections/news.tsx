'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink, RefreshCw } from 'lucide-react';

import { SplitWords } from '@/components/split-text';
import type { NewsItem, NewsResponse, NewsTag } from '@/lib/news-types';
import { portals } from '@/lib/site';

type Tab = 'todas' | NewsTag;

const TABS: { id: Tab; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'trabalhista', label: 'Trabalhista' },
  { id: 'previdenciario', label: 'Previdenciário' },
  { id: 'tribunais', label: 'Tribunais e Justiça' },
];

const TAG_LABEL: Record<NewsTag, string> = {
  trabalhista: 'Trabalhista',
  previdenciario: 'Previdenciário',
  tribunais: 'Justiça',
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function when(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (sameDay(d, now)) {
    const mins = Math.max(1, Math.round((now.getTime() - d.getTime()) / 60000));
    return mins < 60 ? `há ${mins} min` : `há ${Math.floor(mins / 60)} h`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return 'ontem';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
}

function NewsCard({ item, featured }: { item: NewsItem; featured: boolean }) {
  const today = sameDay(new Date(item.publishedAt), new Date());
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass group flex flex-col justify-between rounded-[1.6rem] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/50 ${
        featured ? 'lg:col-span-2 lg:row-span-2 lg:p-10' : ''
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em]">
          <span className="rounded-full border border-gold-500/40 px-3 py-1 text-gold-300">{item.source}</span>
          <span className="text-ivory/45">{TAG_LABEL[item.tag]}</span>
          {today && <span className="rounded-full bg-gold-400 px-2.5 py-1 text-wine-950">Hoje</span>}
        </div>
        <h3 className={`mt-5 font-serif leading-tight text-ivory ${featured ? 'text-3xl lg:text-5xl' : 'text-2xl'}`}>
          {item.title}
        </h3>
        {item.summary && (
          <p className={`mt-4 leading-relaxed text-ivory/60 ${featured ? 'text-base' : 'line-clamp-3 text-sm'}`}>
            {item.summary}
          </p>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between text-xs text-ivory/45">
        <time dateTime={item.publishedAt}>{when(item.publishedAt)}</time>
        <span className="inline-flex items-center gap-1.5 text-gold-300 transition-all group-hover:gap-2.5">
          Ler na fonte <ArrowUpRight size={14} />
        </span>
      </div>
    </a>
  );
}

function Skeletons() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={`skeleton h-56 rounded-[1.6rem] ${i === 0 ? 'lg:col-span-2 lg:row-span-2 lg:h-auto' : ''}`} />
      ))}
    </div>
  );
}

export function News() {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [tab, setTab] = useState<Tab>('todas');
  const [visible, setVisible] = useState(7);

  const load = useCallback(async () => {
    setStatus((s) => (s === 'ready' ? s : 'loading'));
    try {
      const res = await fetch('/api/noticias');
      if (!res.ok) throw new Error(String(res.status));
      setData((await res.json()) as NewsResponse);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
    // Renova a cada 20 min enquanto a aba estiver aberta
    const id = setInterval(() => void load(), 20 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const items = useMemo(
    () => (data?.items ?? []).filter((n) => tab === 'todas' || n.tag === tab),
    [data, tab],
  );

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const updated = data ? new Date(data.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;
  const okSources = data?.sources.filter((s) => s.ok) ?? [];

  return (
    <section id="noticias" data-pose="noticias" className="section">
      <div className="wrap">
        <header className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">§04 — Radar jurídico</p>
            <h2 className="h2 mt-4 max-w-xl">
              <SplitWords text="As notícias do Direito, *todos os dias.*" />
            </h2>
            <p className="mt-4 text-sm capitalize text-ivory/50">{today}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-ivory/50">
            {updated && <span>Atualizado às {updated}</span>}
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-4 py-2 text-gold-300 transition-colors hover:bg-gold-500/10"
            >
              <RefreshCw size={14} className={status === 'loading' ? 'animate-spin' : ''} /> Atualizar
            </button>
          </div>
        </header>

        <div role="tablist" aria-label="Filtrar notícias" className="mt-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
                setVisible(7);
              }}
              className={`rounded-full border px-5 py-2.5 text-sm transition-all ${
                tab === t.id
                  ? 'border-gold-400 bg-gold-500/15 text-ivory'
                  : 'border-gold-500/20 text-ivory/60 hover:border-gold-500/50 hover:text-ivory'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8" aria-live="polite">
          {status === 'loading' && !data && <Skeletons />}

          {status === 'error' && !data && (
            <div className="glass rounded-[1.6rem] p-10 text-center text-ivory/65">
              Não foi possível carregar as notícias agora. Tente novamente em instantes ou consulte diretamente os
              portais abaixo.
            </div>
          )}

          {data && items.length === 0 && (
            <div className="glass rounded-[1.6rem] p-10 text-center text-ivory/65">
              Nenhuma notícia disponível nesta categoria no momento. Consulte diretamente os portais abaixo.
            </div>
          )}

          {items.length > 0 && (
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, visible).map((n, i) => (
                <NewsCard key={n.id} item={n} featured={i === 0} />
              ))}
            </div>
          )}

          {items.length > visible && (
            <div className="mt-8 text-center">
              <button type="button" className="btn-ghost" onClick={() => setVisible((v) => v + 6)}>
                Ver mais notícias
              </button>
            </div>
          )}

          {okSources.length > 0 && (
            <p className="mt-8 text-xs leading-relaxed text-ivory/40">
              Fontes: {okSources.map((s) => s.name).join(', ')}. Conteúdo de terceiros, publicado apenas como
              chamada com link para a matéria original; os direitos pertencem às respectivas fontes. As notícias têm
              caráter informativo e não substituem orientação jurídica individual.
            </p>
          )}
        </div>

        {/* Portais jurídicos */}
        <div className="mt-24">
          <p className="eyebrow">Portais jurídicos</p>
          <h3 className="mt-3 font-serif text-4xl text-ivory">Acesso direto às fontes oficiais</h3>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {portals.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group flex items-center justify-between gap-4 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-gold-400/50"
              >
                <span>
                  <span className="block font-serif text-2xl text-ivory">{p.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-ivory/50">{p.desc}</span>
                </span>
                <ExternalLink size={16} className="shrink-0 text-gold-500/70 transition-colors group-hover:text-gold-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
