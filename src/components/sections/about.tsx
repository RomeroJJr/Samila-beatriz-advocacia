import { SplitWords } from '@/components/split-text';
import { site } from '@/lib/site';
import { Portrait } from './portrait';

export function About() {
  return (
    <section id="sobre" data-pose="sobre" className="section flex items-center">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12">
        {/* Espaço aberto: a balança 3D aparece aqui */}
        <div className="hidden lg:col-span-4 lg:block" aria-hidden />

        <div data-reveal className="glass grid items-center gap-10 rounded-[2rem] p-7 md:grid-cols-[minmax(0,260px)_1fr] md:p-12 lg:col-span-8">
          <Portrait />

          <div>
            <p className="eyebrow">§01 — A advogada</p>
            <h2 className="h2 mt-4">
              <SplitWords text="Samila *Beatriz*" />
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold-400/80">Advogada · {site.oab}</p>

            <p className="mt-6 leading-relaxed text-ivory/70">
              Samila ouve o seu caso com atenção antes de qualquer conclusão. Cada história é tratada de forma
              individual, com análise cuidadosa dos documentos e comunicação acessível — sem juridiquês — em todas as
              etapas.
            </p>

            <ul className="mt-8 grid gap-3 text-sm text-ivory/80 sm:grid-cols-3">
              {['Escuta do caso', 'Análise individualizada', 'Comunicação acessível'].map((t) => (
                <li key={t} className="rounded-xl border border-gold-500/20 bg-white/[0.02] px-4 py-3 text-center">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
