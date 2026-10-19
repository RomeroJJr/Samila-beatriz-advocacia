'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';

/** Card com inclinação 3D que acompanha o mouse e um brilho dourado que segue o cursor. */
export function TiltCard({
  children,
  className = '',
  onEnter,
  onLeave,
}: {
  children: ReactNode;
  className?: string;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const card = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const move = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || !finePointer()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    gsap.to(el, {
      rotationY: (px - 0.5) * 9,
      rotationX: -(py - 0.5) * 9,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power3.out',
    });
    if (glare.current) {
      glare.current.style.background = `radial-gradient(520px circle at ${px * 100}% ${py * 100}%, rgba(217,187,120,0.16), transparent 42%)`;
      glare.current.style.opacity = '1';
    }
  };

  const leave = () => {
    if (card.current) {
      gsap.to(card.current, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    }
    if (glare.current) glare.current.style.opacity = '0';
    onLeave?.();
  };

  return (
    <div
      ref={card}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      onPointerMove={move}
      onPointerEnter={onEnter}
      onPointerLeave={leave}
    >
      <div
        ref={glare}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        aria-hidden
      />
      {children}
    </div>
  );
}
