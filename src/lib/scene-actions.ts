import gsap from 'gsap';
import { sceneState } from '@/lib/scene-state';

type Callback = () => void;
const impactSubscribers = new Set<Callback>();

/** Assina o instante em que o martelo toca a base (câmera treme, balança oscila, ouro brilha). */
export function onImpact(callback: Callback): () => void {
  impactSubscribers.add(callback);
  return () => {
    impactSubscribers.delete(callback);
  };
}

let striking = false;

/** Ergue e baixa o martelo. Ignora chamadas enquanto um golpe está em andamento. */
export function strikeGavel() {
  if (striking) return;
  striking = true;

  gsap
    .timeline({ onComplete: () => void (striking = false) })
    .to(sceneState, { gavel: 1, duration: 0.55, ease: 'power2.out' })
    .to(sceneState, {
      gavel: 0,
      duration: 0.14,
      ease: 'power4.in',
      onComplete: () => impactSubscribers.forEach((cb) => cb()),
    })
    .to(sceneState, { gavel: 0.3, duration: 1.1, ease: 'power2.inOut' }, '+=0.35');
}
