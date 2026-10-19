'use client';

import dynamic from 'next/dynamic';

// three/R3F/drei só existem no browser. A abertura (Intro) cobre a tela enquanto o chunk carrega.
const LawScene = dynamic(() => import('@/components/canvas/law-scene'), { ssr: false, loading: () => null });

export function CanvasRoot() {
  return <LawScene />;
}
