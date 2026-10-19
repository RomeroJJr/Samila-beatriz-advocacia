'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LenisContext = createContext<Lenis | null>(null);

/** Acesso à instância do Lenis (ex.: `lenis?.scrollTo('#agendar')`, `lenis?.stop()`). */
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Lenis → ScrollTrigger
    const onScroll = () => ScrollTrigger.update();
    instance.on('scroll', onScroll);

    // GSAP ticker → Lenis (um único requestAnimationFrame para tudo)
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Âncoras (#secao) rolam com inércia em vez de saltar
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute('href');
      if (!hash || hash === '#' || !document.querySelector(hash)) return;
      e.preventDefault();
      instance.scrollTo(hash, { duration: 1.8, offset: 0 });
    };
    document.addEventListener('click', onClick);

    setLenis(instance);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      instance.off('scroll', onScroll);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
