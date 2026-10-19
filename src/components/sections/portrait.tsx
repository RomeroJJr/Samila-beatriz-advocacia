'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Retrato da advogada. Coloque o arquivo em /public/assets/samila.jpeg.
 * Sem o arquivo, exibe um monograma elegante no lugar (nunca uma imagem quebrada).
 */
export function Portrait() {
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // O erro pode ocorrer antes da hidratação (onError não dispararia): confere ao montar
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.4rem] border border-gold-500/25 bg-wine-900">
      {!failed ? (
        <img
          ref={img}
          src="/assets/samila.jpeg"
          alt="Samila Beatriz, advogada"
          loading="lazy"
          onError={() => setFailed(true)}
          data-parallax="0.12"
          className="absolute inset-0 h-[118%] w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_30%,#6a1a38,#220a14_70%)]">
          <span className="font-serif text-8xl italic gold-text">SB</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine-950/70 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-3 rounded-[1rem] border border-gold-400/20" />
    </div>
  );
}
