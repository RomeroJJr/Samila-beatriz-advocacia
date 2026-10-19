'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { useLenis } from '@/components/smooth-scroll';
import { markIntroDone, onSceneReady } from '@/lib/intro-store';
import { sceneState } from '@/lib/scene-state';

const SEEN_KEY = 'sb-intro-seen';
const NAME = 'Samila Beatriz';

/** Traços do ícone de balança (viewBox 100×100), desenhados com stroke-dashoffset. */
const STROKES = [
  'M50 86 V24',
  'M30 92 H70',
  'M36 86 H64',
  'M16 28 Q50 20 84 28',
  'M16 28 L6 62 M16 28 L28 62',
  'M84 28 L72 62 M84 28 L94 62',
  'M4 62 Q17 78 30 62 Z',
  'M70 62 Q83 78 96 62 Z',
];

/**
 * Abertura cinematográfica: linha dourada, balança desenhada, nome em máscara,
 * contador, e então a cortina se abre enquanto a balança 3D sobe e gira até o lugar.
 * Só termina depois que a cena WebGL realmente renderizou (com limite de segurança).
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useEffect(() => {
    lenis?.stop();
  }, [lenis]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {}

    html.style.overflow = 'hidden';

    const finish = () => {
      html.style.overflow = '';
      lenisRef.current?.start();
      markIntroDone();
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {}
      setGone(true);
    };

    let off: () => void = () => {};
    let safety: ReturnType<typeof setTimeout> | undefined;

    // Versão curta: preferência por menos movimento ou retorno na mesma sessão
    if (reduce || seen) {
      off = onSceneReady(() => {
        gsap.to(sceneState, { intro: 1, duration: reduce ? 0.01 : 1.8, ease: 'power3.out' });
      });
      const t = setTimeout(() => {
        gsap.to(el, { opacity: 0, duration: reduce ? 0.01 : 0.5, onComplete: finish });
        markIntroDone();
      }, reduce ? 50 : 350);
      return () => {
        clearTimeout(t);
        off();
        html.style.overflow = '';
      };
    }

    const ctx = gsap.context(() => {
      const count = { v: 0 };
      const countEl = el.querySelector<HTMLElement>('[data-intro-count]');
      const render = () => {
        if (countEl) countEl.textContent = String(Math.round(count.v)).padStart(2, '0');
        gsap.set('[data-intro-bar]', { scaleX: count.v / 100 });
      };

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });

      tl.fromTo('[data-intro-line]', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'expo.inOut' }, 0)
        .fromTo(
          '[data-intro-stroke]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.09 },
          0.2,
        )
        .from('[data-intro-char]', { yPercent: 125, duration: 1.1, stagger: 0.04, ease: 'expo.out' }, 0.8)
        .from('[data-intro-sub]', { opacity: 0, y: 14, duration: 0.9 }, 1.4)
        .to(count, { v: 92, duration: 2.1, ease: 'power2.inOut', onUpdate: render }, 0.3)
        // Segura aqui até a cena 3D estar pronta (ou 6s de segurança)
        .add(() => {
          tl.pause();
          let resumed = false;
          const go = () => {
            if (resumed) return;
            resumed = true;
            tl.resume();
          };
          off = onSceneReady(go);
          safety = setTimeout(go, 6000);
        }, 2.5)
        .to(count, { v: 100, duration: 0.5, ease: 'power1.out', onUpdate: render })
        .to('[data-intro-content]', { opacity: 0, y: -24, duration: 0.6, ease: 'power2.in' }, '+=0.2')
        .add(() => {
          gsap.to(sceneState, { intro: 1, duration: 2.8, ease: 'power3.out' });
        })
        .to('[data-curtain-top]', { yPercent: -101, duration: 1.3, ease: 'expo.inOut' }, '<')
        .to('[data-curtain-bottom]', { yPercent: 101, duration: 1.3, ease: 'expo.inOut' }, '<')
        .to('[data-intro-line]', { opacity: 0, duration: 0.4 }, '<')
        .add(() => markIntroDone(), '-=0.55');
    }, el);

    return () => {
      ctx.revert();
      off();
      if (safety) clearTimeout(safety);
      html.style.overflow = '';
    };
  }, []);

  if (gone) return null;

  return (
    <div id="intro" ref={root} className="fixed inset-0 z-[200]" role="status" aria-label="Carregando">
      <div data-curtain-top className="absolute inset-x-0 top-0 h-1/2 bg-wine-950" />
      <div data-curtain-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-wine-950" />

      {/* Linha dourada no meio, onde as cortinas se encontram */}
      <div
        data-intro-line
        className="absolute inset-x-0 top-1/2 h-px origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent"
      />

      <div data-intro-content className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center px-6 text-center">
          <svg viewBox="0 0 100 100" className="mb-8 h-24 w-24 text-gold-400" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {STROKES.map((d) => (
              <path key={d} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} data-intro-stroke />
            ))}
            <circle cx="50" cy="19" r="3" pathLength={1} strokeDasharray={1} strokeDashoffset={1} data-intro-stroke />
          </svg>

          <h1 className="font-serif text-[clamp(2.6rem,7vw,5rem)] leading-none tracking-tight text-ivory">
            {NAME.split('').map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-intro-char className="inline-block">
                  {ch === ' ' ? ' ' : ch}
                </span>
              </span>
            ))}
          </h1>

          <p data-intro-sub className="mt-4 text-[0.7rem] uppercase tracking-[0.42em] text-gold-400/80">
            Advocacia · Trabalhista &amp; Previdenciário
          </p>

          <div data-intro-sub className="mt-12 flex w-56 items-center gap-4">
            <span data-intro-count className="w-8 font-serif text-lg tabular-nums text-ivory/80">
              00
            </span>
            <div className="h-px flex-1 bg-white/10">
              <div data-intro-bar className="h-full origin-left scale-x-0 bg-gold-400" />
            </div>
            <span className="text-xs text-ivory/40">100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
