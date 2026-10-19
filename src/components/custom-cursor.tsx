'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Cursor dourado (anel + ponto). Só em dispositivos com mouse; cresce sobre elementos clicáveis. */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;

    document.documentElement.classList.add('has-cursor');

    const rx = gsap.quickTo(ringEl, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ringEl, 'y', { duration: 0.55, ease: 'power3' });
    const dx = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' });

    const move = (e: PointerEvent) => {
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      ringEl.style.opacity = '1';
      dotEl.style.opacity = '1';
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest('a, button, summary, label, select, [data-cursor]');
      ringEl.classList.toggle('is-active', !!hit);
    };
    const leave = () => {
      ringEl.style.opacity = '0';
      dotEl.style.opacity = '0';
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    document.addEventListener('pointerleave', leave);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
