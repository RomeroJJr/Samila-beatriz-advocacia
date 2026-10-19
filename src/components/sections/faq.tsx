'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { SplitWords } from '@/components/split-text';
import { faq } from '@/lib/site';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="duvidas" data-pose="duvidas" className="section flex items-center">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">§08 — Dúvidas frequentes</p>
          <h2 className="h2 mt-4">
            <SplitWords text="Perguntas *comuns.*" />
          </h2>
          <p data-reveal className="mt-5 text-sm leading-relaxed text-ivory/60">
            Não encontrou o que procurava? Fale pelo WhatsApp e tire a sua dúvida antes de agendar.
          </p>
        </div>

        <div className="lg:col-span-8" data-stagger>
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} data-stagger-item className="border-b border-gold-500/20">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={`font-serif text-2xl transition-colors md:text-3xl ${isOpen ? 'text-gold-300' : 'text-ivory'}`}>
                      {item.q}
                    </span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-300 transition-transform duration-500 ${
                        isOpen ? 'rotate-45 bg-gold-500/15' : ''
                      }`}
                    >
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  role="region"
                  className={`grid transition-all duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-ivory/65 md:max-w-2xl">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
