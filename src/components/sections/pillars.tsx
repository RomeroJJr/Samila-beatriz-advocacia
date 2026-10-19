import { SplitWords } from '@/components/split-text';
import { pillars } from '@/lib/site';

export function Pillars() {
  return (
    <section id="pilares" className="section flex items-center">
      <div className="wrap">
        <p className="eyebrow">§03 — Forma de cuidar</p>
        <h2 className="h2 mt-4 max-w-2xl">
          <SplitWords text="Atendimento que começa por *ouvir.*" />
        </h2>

        <div data-stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              data-stagger-item
              className="glass group relative overflow-hidden rounded-[1.8rem] p-8 transition-colors duration-500 hover:border-gold-400/50 md:p-10"
            >
              <span className="font-serif text-7xl italic leading-none text-gold-500/25 transition-colors duration-500 group-hover:text-gold-400/60">
                0{i + 1}
              </span>
              <h3 className="mt-6 font-serif text-3xl text-ivory">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">{p.text}</p>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
