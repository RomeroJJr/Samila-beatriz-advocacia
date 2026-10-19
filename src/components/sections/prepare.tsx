'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

import { SplitWords } from '@/components/split-text';
import { prepare } from '@/lib/site';

export function Prepare() {
  const [active, setActive] = useState<(typeof prepare)[number]['id']>('inss');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const current = prepare.find((p) => p.id === active)!;
  const done = current.docs.filter((d) => checked[`${active}:${d}`]).length;
  const pct = Math.round((done / current.docs.length) * 100);

  return (
    <section id="preparar" data-pose="preparar" className="section flex items-center">
      <div className="wrap">
        <header className="max-w-2xl">
          <p className="eyebrow">§07 — Preparação</p>
          <h2 className="h2 mt-4">
            <SplitWords text="Prepare a sua *consulta.*" />
          </h2>
          <p data-reveal className="mt-4 text-sm leading-relaxed text-ivory/60">
            Escolha o seu caso e marque o que já tem em mãos. As marcações são temporárias, ficam apenas nesta página e
            nenhum documento é enviado por aqui.
          </p>
        </header>

        <div data-reveal className="glass mt-10 rounded-[2rem] p-7 md:p-11">
          <div role="tablist" aria-label="Tipo de caso" className="flex flex-wrap gap-3">
            {prepare.map((p) => (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={active === p.id}
                onClick={() => setActive(p.id)}
                className={`rounded-full border px-5 py-3 text-sm transition-all ${
                  active === p.id
                    ? 'border-gold-400 bg-gold-500/15 text-ivory'
                    : 'border-gold-500/20 text-ivory/60 hover:border-gold-500/50 hover:text-ivory'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_220px]">
            <ul className="grid gap-3" aria-label="Documentos de apoio">
              {current.docs.map((d) => {
                const key = `${active}:${d}`;
                const on = !!checked[key];
                return (
                  <li key={key}>
                    <label
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 text-sm transition-all ${
                        on ? 'border-gold-400/60 bg-gold-500/10 text-ivory' : 'border-gold-500/15 text-ivory/70 hover:border-gold-500/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
                      />
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all ${
                          on ? 'border-gold-300 bg-gold-400 text-wine-950' : 'border-gold-500/40'
                        }`}
                        aria-hidden
                      >
                        {on && <Check size={14} strokeWidth={3} />}
                      </span>
                      {d}
                    </label>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative grid h-36 w-36 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#d9bb78"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - pct / 100)}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <span className="font-serif text-4xl text-ivory">
                  {done}
                  <span className="text-xl text-ivory/40">/{current.docs.length}</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-ivory/50">
                Faltou algum documento? Ainda assim é possível agendar: ajudamos a identificar o que reunir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
