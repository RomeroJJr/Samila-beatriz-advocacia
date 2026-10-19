'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, MessageCircle } from 'lucide-react';

import { Magnetic } from '@/components/magnetic';
import { SplitWords } from '@/components/split-text';
import { strikeGavel } from '@/lib/scene-actions';
import { wa } from '@/lib/site';

const br = (iso: string) => iso.split('-').reverse().join('/');

export function Booking() {
  const [minDate, setMinDate] = useState('');
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Data mínima calculada no cliente (evita divergência de hidratação)
  useEffect(() => {
    setMinDate(new Date().toISOString().slice(0, 10));
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const date = String(f.get('data') ?? '');
    if (!date) {
      setError('Escolha uma data de preferência.');
      return;
    }
    setError('');

    const nome = String(f.get('nome') ?? '').trim();
    const lines = ['Olá, Dra. Samila! Gostaria de agendar uma consulta.', ''];
    if (nome) lines.push(`Nome: ${nome}`);
    lines.push(
      `Formato: ${f.get('formato')}`,
      `Data de preferência: ${br(date)}`,
      `Assunto: ${f.get('assunto')}`,
      `Período: ${f.get('periodo')}`,
      '',
      '(Solicitação enviada pelo site)',
    );
    const message = lines.join('\n');

    const url = wa(message);
    setLink(url);

    // Abre a aba já no clique (evita bloqueio de pop-up) e a redireciona depois do golpe do martelo
    const tab = window.open('', '_blank');
    strikeGavel();
    window.setTimeout(() => {
      if (tab) tab.location.href = url;
      else window.location.href = url;
    }, 900);
  };

  return (
    <section id="agendar" data-pose="agendar" className="section flex items-center">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12">
        <div data-reveal className="glass rounded-[2rem] p-7 md:p-11 lg:col-span-7">
          <p className="eyebrow">§06 — Agendamento</p>
          <h2 className="h2 mt-4">
            <SplitWords text="Agende a sua *consulta.*" />
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/60">
            Preencha as preferências e envie pelo WhatsApp. A data não é confirmada automaticamente: a confirmação
            vem após o retorno da advogada.
          </p>

          <form onSubmit={onSubmit} className="mt-9 grid gap-6" noValidate>
            <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/90">
              Nome (opcional)
              <input name="nome" type="text" autoComplete="name" placeholder="Como devemos chamá-lo(a)?" className="field normal-case tracking-normal" />
            </label>

            <fieldset>
              <legend className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-400/90">Formato</legend>
              <div className="grid grid-cols-2 gap-3">
                {['Online', 'Presencial'].map((v, i) => (
                  <label key={v} className="seg relative">
                    <input type="radio" name="formato" value={v} defaultChecked={i === 0} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/90">
                Data de preferência
                <input name="data" type="date" min={minDate} className="field normal-case tracking-normal" aria-invalid={!!error} />
              </label>
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/90">
                Assunto
                <select name="assunto" className="field normal-case tracking-normal" defaultValue="Previdenciário">
                  <option>Trabalhista</option>
                  <option>Previdenciário</option>
                  <option>Preciso de orientação</option>
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-400/90">Período</legend>
              <div className="grid grid-cols-3 gap-3">
                {['Sem preferência', 'Manhã', 'Tarde'].map((v, i) => (
                  <label key={v} className="seg relative">
                    <input type="radio" name="periodo" value={v} defaultChecked={i === 0} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="text-sm text-[#f0a3b5]">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <button type="submit" className="btn-gold">
                  <CalendarCheck size={18} /> Solicitar pelo WhatsApp
                </button>
              </Magnetic>
              {link && (
                <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gold-300 underline-offset-4 hover:underline">
                  <MessageCircle size={16} /> A conversa não abriu? Clique aqui
                </a>
              )}
            </div>
          </form>
        </div>

        {/* Espaço aberto: o martelo 3D aparece aqui */}
        <div className="hidden lg:col-span-5 lg:block" aria-hidden />
      </div>
    </section>
  );
}
