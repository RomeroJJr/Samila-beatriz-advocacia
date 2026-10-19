'use client';

import { ArrowUp } from 'lucide-react';
import { useLenis } from '@/components/smooth-scroll';

export function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => lenis?.scrollTo(0, { duration: 2.2 })}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-500/30 px-4 py-2 text-xs text-gold-300 transition-colors hover:bg-gold-500/10"
    >
      Voltar ao topo <ArrowUp size={14} />
    </button>
  );
}
