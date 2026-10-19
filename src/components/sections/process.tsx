import { SplitWords } from '@/components/split-text';
import { steps } from '@/lib/site';

export function Process() {
  return (
    <section id="etapas" data-pose="etapas" className="section flex items-center">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">Acompanhamento previdenciário</p>
          <h2 className="h2 mt-4 max-w-md">
            <SplitWords text="Quatro etapas, *sem surpresas.*" />
          </h2>

          <ol data-timeline className="relative mt-14 space-y-12 pl-14">
            <span className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-white/10" aria-hidden />
            <span
              data-timeline-line
              className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-gold-300 to-gold-600"
              aria-hidden
            />
            {steps.map((s, i) => (
              <li key={s.title} data-step className="relative">
                <span className="step-node absolute -left-14 top-0 grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 bg-wine-950 font-serif text-lg text-gold-300">
                  {i + 1}
                </span>
                <div className="step-body">
                  <h3 className="font-serif text-3xl text-ivory">{s.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory/65">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <p data-reveal className="mt-12 max-w-md border-l border-gold-500/40 pl-5 text-xs leading-relaxed text-ivory/50">
            A concessão de benefícios e os prazos de análise dependem do INSS e do Judiciário e, por isso, não são
            garantidos pelo escritório.
          </p>
        </div>

        {/* Espaço aberto: a balança 3D aparece aqui */}
        <div className="hidden lg:col-span-6 lg:block" aria-hidden />
      </div>
    </section>
  );
}
