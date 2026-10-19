import { MapPin, Video } from 'lucide-react';

import { SplitWords } from '@/components/split-text';

export function Service() {
  return (
    <section id="atendimento" data-pose="atendimento" className="section flex items-center">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">§05 — Atendimento</p>
          <h2 className="h2 mt-4">
            <SplitWords text="Perto de você, *onde estiver.*" />
          </h2>

          <div data-stagger className="mt-12 grid gap-5">
            <article data-stagger-item className="glass rounded-[1.6rem] p-7 md:p-9">
              <div className="flex items-center gap-4 text-gold-300">
                <MapPin size={22} />
                <h3 className="font-serif text-3xl text-ivory">Presencial</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ivory/65">
                Em Catolé do Rocha e região, na Paraíba. O local e o horário são informados na confirmação do
                agendamento.
              </p>
            </article>

            <article data-stagger-item className="glass rounded-[1.6rem] p-7 md:p-9">
              <div className="flex items-center gap-4 text-gold-300">
                <Video size={22} />
                <h3 className="font-serif text-3xl text-ivory">Online</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ivory/65">
                Para todo o Brasil, por videochamada, com horário agendado previamente.
              </p>
            </article>
          </div>
        </div>

        {/* Espaço aberto: o martelo 3D aparece aqui */}
        <div className="hidden lg:col-span-6 lg:block" aria-hidden />
      </div>
    </section>
  );
}
