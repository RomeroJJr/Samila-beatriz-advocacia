import { Magnetic } from '@/components/magnetic';
import { SplitWords } from '@/components/split-text';
import { site } from '@/lib/site';

export function Hero() {
  return (
    <section id="inicio" data-pose="hero" className="section flex items-center">
      <div className="wrap">
        <div className="max-w-2xl">
          <p data-hero-fade className="eyebrow flex items-center gap-4">
            <span className="h-px w-10 bg-gold-500/60" />
            Escuta atenta. Orientação clara.
          </p>

          <h1 className="mt-7 font-serif text-[clamp(3.1rem,7.6vw,6.8rem)] leading-[0.94] tracking-tight text-ivory">
            <SplitWords hero text="O Direito começa com a *sua história.*" />
          </h1>

          <p data-hero-fade className="mt-8 max-w-lg text-[1.05rem] leading-relaxed text-ivory/65">
            Orientação jurídica humana em questões trabalhistas e previdenciárias — presencial em Catolé do Rocha e
            região e online para todo o Brasil.
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#agendar" className="btn-gold">
                Agendar consulta
              </a>
            </Magnetic>
            <a href="#atuacao" className="btn-ghost">
              Áreas de atuação
            </a>
          </div>

          <dl
            data-hero-fade
            className="mt-14 grid max-w-xl grid-cols-1 gap-5 border-t border-gold-500/15 pt-6 text-xs sm:grid-cols-3"
          >
            {[
              ['Inscrição', site.oab],
              ['Presencial', 'Catolé do Rocha e região · PB'],
              ['Online', 'Todo o Brasil'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="uppercase tracking-[0.25em] text-gold-400/80">{k}</dt>
                <dd className="mt-1.5 text-sm text-ivory/80">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div data-hero-fade className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden>
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-ivory/40">Role</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-gold-400" />
        </span>
      </div>
    </section>
  );
}
