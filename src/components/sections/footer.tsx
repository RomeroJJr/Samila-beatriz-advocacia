import { Download, MapPin, MessageCircle, Phone } from 'lucide-react';

import { Magnetic } from '@/components/magnetic';
import { SplitWords } from '@/components/split-text';
import { site, wa } from '@/lib/site';
import { BackToTop } from './back-to-top';

export function Footer() {
  return (
    <section id="contato" data-pose="final" className="section flex flex-col justify-end">
      <div className="wrap">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Vamos conversar</p>
          <h2 className="h2 mt-4 !text-[clamp(2.8rem,6.5vw,5.6rem)]">
            <SplitWords text="A sua história merece *atenção.*" />
          </h2>
          <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a href="#agendar" className="btn-gold">
                Agendar consulta
              </a>
            </Magnetic>
            <Magnetic>
              <a href={wa('Olá, Dra. Samila! Gostaria de conversar sobre o meu caso.')} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle size={16} /> WhatsApp {site.phoneDisplay}
              </a>
            </Magnetic>
          </div>
        </div>

        <footer className="glass mt-24 rounded-[2rem] p-8 md:p-10">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="font-serif text-3xl text-ivory">{site.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gold-400/80">Advocacia · {site.oab}</p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/55">
                Direito Trabalhista e Previdenciário. Atendimento presencial em Catolé do Rocha e região e online para
                todo o Brasil.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-ivory/75">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-400" /> {site.phoneDisplay}
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-gold-400" /> {site.city} e região · {site.region}
              </li>
              <li>
                <a
                  href="/assets/samila-beatriz.vcf"
                  download
                  className="inline-flex items-center gap-3 text-gold-300 underline-offset-4 hover:underline"
                >
                  <Download size={16} /> Salvar contato
                </a>
              </li>
            </ul>

            <div className="text-xs leading-relaxed text-ivory/45">
              <p className="font-semibold uppercase tracking-[0.2em] text-ivory/60">Privacidade</p>
              <p className="mt-2">
                Não pedimos CPF nem documentos por este site e não usamos ferramentas de publicidade ou analytics. O
                carregamento de fontes (Google Fonts) e a hospedagem podem processar dados técnicos de acesso, como
                endereço IP.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-gold-500/15 pt-6 text-[0.7rem] leading-relaxed text-ivory/40 md:flex-row md:items-center">
            <p className="max-w-3xl">
              © {new Date().getFullYear()} {site.fullName}. Conteúdo de caráter exclusivamente informativo, em
              observância ao Código de Ética e Disciplina da OAB; não constitui oferta de serviços nem promessa de
              resultado.
            </p>
            <BackToTop />
          </div>
        </footer>
      </div>
    </section>
  );
}
