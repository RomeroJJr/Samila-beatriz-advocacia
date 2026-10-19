/**
 * Estado compartilhado entre GSAP (DOM) e useFrame (R3F).
 * Objeto mutável fora do React: o GSAP anima, o loop do R3F apenas lê.
 */
export type Pose = {
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  /** Rotação Y da balança. */
  rotY: number;
  /** Inclinação-base do travessão (rad). */
  beamBase: number;
  /** Intensidade das partículas douradas (0..1). */
  dust: number;
};

/**
 * Mundo 3D com três "palcos" distantes no eixo X; a câmera voa entre eles.
 *   x = 0   → balança da justiça
 *   x = -18 → colunas (arquitetura forense)
 *   x = +18 → martelo e base
 */
export const POSES = {
  hero: { camX: -1.9, camY: 0.9, camZ: 7.4, lookX: -1.9, lookY: 0.55, lookZ: 0, rotY: -0.35, beamBase: 0, dust: 1 },
  sobre: { camX: 3.6, camY: 1.5, camZ: 11, lookX: 3.6, lookY: 0.5, lookZ: 0, rotY: 0.9, beamBase: 0.05, dust: 0.6 },
  atuacao: { camX: 0, camY: 1.0, camZ: 8.4, lookX: 0, lookY: 0.5, lookZ: 0, rotY: 0, beamBase: 0, dust: 1 },
  etapas: { camX: -3.1, camY: 2.0, camZ: 10.5, lookX: -3.1, lookY: 0.4, lookZ: 0, rotY: -0.9, beamBase: -0.05, dust: 0.5 },
  noticias: { camX: -18, camY: 1.2, camZ: 9, lookX: -18, lookY: 2.0, lookZ: -3, rotY: 0, beamBase: 0, dust: 0.4 },
  atendimento: { camX: 16.4, camY: 0.6, camZ: 6.6, lookX: 16.4, lookY: -0.7, lookZ: 0, rotY: 0, beamBase: 0, dust: 0.8 },
  agendar: { camX: 16.1, camY: 0.9, camZ: 6.0, lookX: 16.1, lookY: -0.6, lookZ: 0, rotY: 0, beamBase: 0, dust: 0.8 },
  preparar: { camX: 0, camY: 1.4, camZ: 13.5, lookX: 0, lookY: 0.9, lookZ: 0, rotY: 0.4, beamBase: 0.04, dust: 0.3 },
  duvidas: { camX: 2.8, camY: 1.2, camZ: 12.5, lookX: 2.8, lookY: 0.7, lookZ: 0, rotY: -0.5, beamBase: -0.04, dust: 0.3 },
  final: { camX: 0, camY: 1.1, camZ: 8.8, lookX: 0, lookY: 0.7, lookZ: 0, rotY: 0, beamBase: 0, dust: 1 },
} as const satisfies Record<string, Pose>;

export type PoseKey = keyof typeof POSES;

export type SceneState = Pose & {
  /** 0..1 — revelação da cena após a abertura. */
  intro: number;
  /** Inclinação extra do travessão causada por hover nos cards (rad). */
  beamHover: number;
  /** 0 = martelo na posição de golpe, 1 = erguido. */
  gavel: number;
  /** Progresso total do scroll (0..1). */
  scroll: number;
};

const initial = (): SceneState => ({ ...POSES.hero, intro: 0, beamHover: 0, gavel: 0.3, scroll: 0 });

export const sceneState: SceneState = initial();

export function resetSceneState() {
  const keepIntro = sceneState.intro;
  Object.assign(sceneState, initial(), { intro: keepIntro });
}

/** Cards de área inclinam a balança: positivo = lado esquerdo desce. */
export function setBeamHover(value: number) {
  sceneState.beamHover = value;
}
