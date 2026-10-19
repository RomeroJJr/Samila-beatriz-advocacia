'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { onIntroDone } from '@/lib/intro-store';
import { strikeGavel } from '@/lib/scene-actions';
import { POSES, resetSceneState, sceneState, type PoseKey } from '@/lib/scene-state';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Coreografia de scroll. Cada <section data-pose="..."> dispara um voo de câmera até a pose
 * correspondente (scrub); os demais efeitos usam data-attributes:
 *   [data-split]      → palavras sobem com máscara
 *   [data-reveal]     → bloco sobe + fade
 *   [data-stagger]    → filhos [data-stagger-item] entram em cascata
 *   [data-parallax]   → deslocamento vertical leve (valor = velocidade)
 *   [data-timeline]   → linha dourada que se desenha + passos que acendem
 */
export function ScrollStage({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let offIntro: () => void = () => {};

    const ctx = gsap.context(() => {
      /* 1) Câmera: poses por seção */
      Object.assign(sceneState, POSES.hero);
      const sections = gsap.utils.toArray<HTMLElement>('[data-pose]');
      let prev: PoseKey = 'hero';
      sections.forEach((el, i) => {
        const key = el.dataset.pose as PoseKey;
        if (!(key in POSES)) return;
        if (i > 0) {
          gsap.fromTo(
            sceneState,
            { ...POSES[prev] },
            {
              ...POSES[key],
              ease: 'none',
              immediateRender: false,
              scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 28%', scrub: reduce ? true : 1 },
            },
          );
        }
        prev = key;
      });

      /* 2) O martelo bate quando o visitante chega ao atendimento */
      ScrollTrigger.create({ trigger: '#atendimento', start: 'top 55%', once: true, onEnter: () => strikeGavel() });

      /* 3) Progresso do scroll → shader de fundo + barra lateral */
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          sceneState.scroll = self.progress;
          gsap.set('[data-progress-bar]', { scaleY: self.progress });
        },
      });

      /* 4) Hero: entra depois da abertura */
      const heroWords = '[data-hero-word]';
      const heroFade = '[data-hero-fade]';
      if (reduce) {
        gsap.set([heroWords, heroFade], { clearProps: 'all' });
      } else {
        gsap.set(heroWords, { yPercent: 115 });
        gsap.set(heroFade, { opacity: 0, y: 26 });
        offIntro = onIntroDone(() => {
          gsap.to(heroWords, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.07 });
          gsap.to(heroFade, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
        });
      }

      if (reduce) return;

      /* 5) Títulos por palavra */
      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        gsap.from(el.querySelectorAll('[data-word]'), {
          yPercent: 115,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      /* 6) Blocos */
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 70,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-stagger-item]'), {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      });

      /* 7) Parallax */
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? '0.1');
        gsap.fromTo(
          el,
          { yPercent: -speed * 60 },
          {
            yPercent: speed * 60,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      /* 8) Linha do tempo previdenciária */
      gsap.utils.toArray<HTMLElement>('[data-timeline]').forEach((tl) => {
        const line = tl.querySelector('[data-timeline-line]');
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: tl, start: 'top 65%', end: 'bottom 60%', scrub: 0.6 },
            },
          );
        }
        tl.querySelectorAll('[data-step]').forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 62%',
            toggleClass: { targets: step, className: 'is-active' },
          });
        });
      });
    }, root);

    /* A altura da página muda (notícias, FAQ, fontes): recalcula os triggers com debounce */
    let timer: gsap.core.Tween | undefined;
    const ro = new ResizeObserver(() => {
      timer?.kill();
      timer = gsap.delayedCall(0.2, () => ScrollTrigger.refresh());
    });
    ro.observe(root);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ro.disconnect();
      timer?.kill();
      offIntro();
      ctx.revert();
      resetSceneState();
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 bg-white/10 lg:block">
        <div data-progress-bar className="h-full origin-top scale-y-0 bg-gradient-to-b from-gold-300 to-gold-600" />
      </div>
      <main ref={rootRef} className="relative z-10">
        {children}
      </main>
    </>
  );
}
