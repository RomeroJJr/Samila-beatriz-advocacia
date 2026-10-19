'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Magnetic } from '@/components/magnetic';
import { useLenis } from '@/components/smooth-scroll';

const links = [
  { href: '#sobre', label: 'A advogada' },
  { href: '#atuacao', label: 'Áreas' },
  { href: '#noticias', label: 'Notícias' },
  { href: '#atendimento', label: 'Atendimento' },
  { href: '#duvidas', label: 'Dúvidas' },
];

export function BrandMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M50 86V24M30 92h40M16 28q34-8 68 0M16 28 6 62M16 28l12 34M84 28 72 62M84 28l10 34M4 62q13 16 26 0ZM70 62q13 16 26 0Z" />
      <circle cx="50" cy="19" r="4" />
    </svg>
  );
}

export function Header() {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu móvel aberto trava o scroll
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-wine-950/70 py-3 backdrop-blur-xl' : 'py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 md:px-16">
          <a href="#inicio" className="group flex items-center gap-3 text-gold-400" aria-label="Samila Beatriz Advocacia — início">
            <BrandMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="leading-none">
              <span className="block font-serif text-2xl tracking-tight text-ivory">Samila Beatriz</span>
              <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.42em] text-gold-400/80">Advocacia</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-[0.82rem] text-ivory/65 transition-colors hover:text-gold-300"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:inline-block">
              <a href="#agendar" className="btn-gold !px-5 !py-2.5 !text-[0.78rem]">
                Agendar consulta
              </a>
            </Magnetic>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/30 text-ivory lg:hidden"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu móvel */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-wine-950/95 px-8 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-2" aria-label="Menu móvel">
          {[{ href: '#inicio', label: 'Início' }, ...links, { href: '#agendar', label: 'Agendar consulta' }].map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif text-4xl text-ivory transition-all duration-500 hover:text-gold-300"
              style={{ transitionDelay: open ? `${i * 60}ms` : '0ms', transform: open ? 'none' : 'translateY(20px)' }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
