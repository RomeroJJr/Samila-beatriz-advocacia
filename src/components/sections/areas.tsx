'use client';

import { ArrowUpRight, Briefcase, Landmark } from 'lucide-react';

import { Magnetic } from '@/components/magnetic';
import { SplitWords } from '@/components/split-text';
import { TiltCard } from '@/components/tilt-card';
import { setBeamHover } from '@/lib/scene-state';
import { areas, wa } from '@/lib/site';

const icons = { trabalhista: Briefcase, previdenciario: Landmark } as const;
// Trabalhista (esquerda) faz o lado esquerdo da balança descer; Previdenciário, o direito.
const beam = { trabalhista: 0.15, previdenciario: -0.15 } as const;

export function Areas() {
  return (
    <section id="atuacao" data-pose="atuacao" className="section flex items-center">
      <div className="wrap">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">§02 — Áreas de atuação</p>
          <h2 className="h2 mt-4">
            <SplitWords text="Duas áreas, *um mesmo cuidado.*" />
          </h2>
          <p data-reveal className="mt-5 text-ivory/60">
            Passe o cursor sobre uma área: a balança pesa o seu lado.
          </p>
        </header>

        <div data-stagger className="mt-14 grid gap-8 lg:grid-cols-[1fr_minmax(0,0.9fr)_1fr]">
          {areas.map((a, idx) => {
            const Icon = icons[a.id];
            const card = (
              <div data-stagger-item key={a.id} className={idx === 1 ? 'lg:col-start-3' : 'lg:col-start-1'}>
                <TiltCard
                  className="glass h-full rounded-[1.8rem] p-8 md:p-10"
                  onEnter={() => setBeamHover(beam[a.id])}
                  onLeave={() => setBeamHover(0)}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-6 font-serif text-3xl text-ivory">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{a.lead}</p>
                  <ul className="mt-6 space-y-3 text-sm text-ivory/80">
                    {a.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-0.5 text-gold-500">✧</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Magnetic>
                      <a href={wa(a.message)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                        Conversar sobre meu caso <ArrowUpRight size={16} />
                      </a>
                    </Magnetic>
                  </div>
                </TiltCard>
              </div>
            );
            return card;
          })}
        </div>
      </div>
    </section>
  );
}
