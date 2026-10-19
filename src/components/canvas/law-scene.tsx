'use client';

import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, Sparkles } from '@react-three/drei';
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

import { markSceneReady } from '@/lib/intro-store';
import { sceneState } from '@/lib/scene-state';
import { CameraRig } from './camera-rig';
import { Columns } from './columns';
import { Gavel } from './gavel';
import { Scales } from './scales';
import './smoke-material';
import type { SmokeMaterialImpl } from './smoke-material';

/** Fundo GLSL (fumaça bordô + fios dourados) desenhado em tela cheia, atrás de tudo. */
function SmokeBackdrop() {
  const material = useRef<SmokeMaterialImpl>(null);

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    m.uTime = state.clock.elapsedTime;
    m.uProgress = sceneState.scroll;
    m.uMouse.lerp(state.pointer, 0.06);
    m.uResolution.set(state.size.width * state.viewport.dpr, state.size.height * state.viewport.dpr);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
      <smokeMaterial ref={material} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

/** Avisa a abertura que a cena já renderizou alguns frames (shaders compilados, texturas enviadas). */
function ReadyProbe() {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current < 4 && ++frames.current === 4) markSceneReady();
  });
  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.22} color="#ffd9c0" />
      <directionalLight position={[3, 6, 5]} intensity={2.1} color="#ffe2b8" />
      {/* uma luz quente local por palco */}
      <pointLight position={[-2, 2.5, 4]} intensity={22} distance={14} color="#e6c27a" />
      <pointLight position={[-18, 3, 5]} intensity={26} distance={16} color="#e6c27a" />
      <pointLight position={[16, 2, 4]} intensity={22} distance={14} color="#e6c27a" />
      <spotLight position={[4, 6, -3]} angle={0.5} penumbra={1} intensity={45} color="#b0305a" />

      {/* Ambiente 100% procedural (sem baixar HDR) — refletido pelo ouro e pelo mármore */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} color="#fff1d6" position={[0, 5, -4]} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={3} color="#e6c27a" position={[-5, 1, -1]} scale={4} />
        <Lightformer form="rect" intensity={2.4} color="#c2305f" position={[5, -1, 2]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0, 1, 6]} scale={[8, 1.5, 1]} />
      </Environment>
    </>
  );
}

export default function LawScene() {
  // Pós-processamento só em máquinas capazes; o resto usa o pipeline padrão
  const highQuality = useMemo(
    () => window.innerWidth >= 1024 && (navigator.hardwareConcurrency ?? 4) >= 6,
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, highQuality ? 2 : 1.5]}
        camera={{ position: [-1.9, 0.9, 11], fov: 35, near: 0.1, far: 80 }}
        gl={{
          antialias: !highQuality,
          powerPreference: 'high-performance',
          // Com EffectComposer o tone mapping é feito no pós; sem ele, no renderer
          toneMapping: highQuality ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        // O wrapper é pointer-events-none; o Canvas escuta o ponteiro pelo body
        eventSource={document.body}
        eventPrefix="client"
      >
        <SmokeBackdrop />
        <ReadyProbe />
        <Lighting />

        <Suspense fallback={null}>
          <Scales />
          <Columns position={[-18, 0, 0]} />
          <Gavel position={[18, 0, 0]} />

          {/* Partículas douradas em cada palco */}
          {[-18, 0, 18].map((x) => (
            <Sparkles
              key={x}
              position={[x, 0.6, 0]}
              count={70}
              scale={[12, 6, 6]}
              size={2.4}
              speed={0.25}
              opacity={0.7}
              color="#e6cf9a"
            />
          ))}
        </Suspense>

        <CameraRig />

        {highQuality && (
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.55} luminanceThreshold={0.85} luminanceSmoothing={0.25} mipmapBlur />
            <Vignette offset={0.25} darkness={0.7} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
