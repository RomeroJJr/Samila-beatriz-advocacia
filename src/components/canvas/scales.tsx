'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';

import { onImpact } from '@/lib/scene-actions';
import { sceneState } from '@/lib/scene-state';
import { getLawMaterials } from './materials';

const FLOOR_Y = -1.75;
const BEAM_Y = 1.3;
const ARM = 1.45; // distância do centro ao ponto de suspensão
const HANG = 1.35; // comprimento das correntes
const PAN_R = 0.62;

const v2 = (pairs: [number, number][]) => pairs.map(([r, y]) => new THREE.Vector2(r, y));

// Balaústre da coluna central (perfil revolucionado)
const COLUMN_PROFILE = v2([
  [0.42, -1.45], [0.42, -1.4], [0.3, -1.36], [0.3, -1.3], [0.2, -1.24], [0.16, -1.1], [0.115, -0.7],
  [0.095, 0.2], [0.11, 0.7], [0.14, 0.95], [0.2, 1.03], [0.12, 1.1], [0.17, 1.14], [0.17, 1.2], [0.1, 1.24],
]);

// Travessão: mais grosso no centro, afinando nas pontas (revolucionado e deitado no eixo X)
const BEAM_PROFILE = Array.from({ length: 41 }, (_, i) => {
  const y = -1.5 + (3 * i) / 40;
  return new THREE.Vector2(0.02 + 0.032 * Math.exp(-((y / 0.7) ** 2)), y);
});

// Prato côncavo
const PAN_PROFILE = v2([
  [0, -0.17], [0.18, -0.165], [0.38, -0.12], [0.54, -0.04], [0.62, 0], [0.64, 0.012], [0.62, 0.024],
]);

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function Chain({ from, to, material }: { from: THREE.Vector3; to: THREE.Vector3; material: THREE.Material }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = to.clone().sub(from);
    const length = dir.length();
    return {
      length,
      position: from.clone().add(to).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()),
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <cylinderGeometry args={[0.011, 0.011, length, 8]} />
    </mesh>
  );
}

function Pan({ material, brass }: { material: THREE.Material; brass: THREE.Material }) {
  const anchors = useMemo(
    () =>
      [90, 210, 330].map((deg) => {
        const a = THREE.MathUtils.degToRad(deg);
        return new THREE.Vector3(Math.cos(a) * 0.6, -HANG, Math.sin(a) * 0.6);
      }),
    [],
  );
  const origin = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  return (
    <>
      {anchors.map((p, i) => (
        <Chain key={i} from={origin} to={p} material={brass} />
      ))}
      <group position={[0, -HANG, 0]}>
        <mesh material={material}>
          <latheGeometry args={[PAN_PROFILE, 64]} />
        </mesh>
        <mesh position={[0, 0.012, 0]} rotation-x={Math.PI / 2} material={material}>
          <torusGeometry args={[PAN_R + 0.005, 0.018, 16, 80]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} material={material}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
      </group>
      {/* argola de suspensão */}
      <mesh material={material}>
        <sphereGeometry args={[0.04, 16, 16]} />
      </mesh>
    </>
  );
}

export function Scales() {
  const m = useMemo(getLawMaterials, []);
  const root = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Group>(null);
  const panL = useRef<THREE.Group>(null);
  const panR = useRef<THREE.Group>(null);
  const spring = useRef({ angle: 0, vel: 0 });
  const glow = useRef(0);

  // Impacto do martelo: empurra o travessão e faz o ouro brilhar
  useEffect(
    () =>
      onImpact(() => {
        spring.current.vel += 1.1;
        glow.current = 1;
      }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const s = sceneState;
    const intro = easeOut(s.intro);

    // Travessão: oscilador amortecido (mola) → peso real, não interpolação linear
    const target = THREE.MathUtils.clamp(s.beamBase + s.beamHover + Math.sin(t * 0.7) * 0.03, -0.35, 0.35);
    const sp = spring.current;
    sp.vel += (16 * (target - sp.angle) - 2.6 * sp.vel) * dt;
    sp.angle += sp.vel * dt;

    if (beam.current) beam.current.rotation.z = sp.angle;
    // Os pratos sempre pendem na vertical (contra-rotação) e balançam com a velocidade
    if (panL.current) panL.current.rotation.z = -sp.angle + Math.sin(t * 1.4) * 0.02 + sp.vel * 0.07;
    if (panR.current) panR.current.rotation.z = -sp.angle + Math.sin(t * 1.4 + 1.7) * 0.02 + sp.vel * 0.07;

    if (root.current) {
      const g = root.current;
      const damp = THREE.MathUtils.damp;
      g.position.y = (1 - intro) * -2.2;
      g.scale.setScalar(0.72 + 0.28 * intro);
      g.rotation.y = damp(
        g.rotation.y,
        s.rotY + (1 - intro) * Math.PI * 1.2 + state.pointer.x * 0.2 + Math.sin(t * 0.25) * 0.08,
        4,
        dt,
      );
    }

    glow.current *= Math.exp(-5 * dt);
    m.gold.emissiveIntensity = (1 - intro) * 0.55 + glow.current * 0.6;
  });

  return (
    <group ref={root}>
      {/* Base de mármore em degraus + anel dourado */}
      <mesh position={[0, FLOOR_Y + 0.08, 0]} material={m.marble}>
        <cylinderGeometry args={[1.1, 1.15, 0.16, 96]} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 0.23, 0]} material={m.marble}>
        <cylinderGeometry args={[0.88, 0.92, 0.14, 96]} />
      </mesh>
      <mesh position={[0, -1.45, 0]} rotation-x={Math.PI / 2} material={m.gold}>
        <torusGeometry args={[0.62, 0.03, 16, 96]} />
      </mesh>

      {/* Coluna central dourada */}
      <mesh material={m.gold}>
        <latheGeometry args={[COLUMN_PROFILE, 72]} />
      </mesh>

      {/* Remate superior */}
      <mesh position={[0, 1.62, 0]} material={m.gold}>
        <sphereGeometry args={[0.085, 24, 24]} />
      </mesh>
      <mesh position={[0, 1.8, 0]} material={m.gold}>
        <coneGeometry args={[0.035, 0.28, 16]} />
      </mesh>

      {/* Travessão + pratos */}
      <group ref={beam} position={[0, BEAM_Y, 0]}>
        <mesh rotation-z={Math.PI / 2} material={m.gold}>
          <latheGeometry args={[BEAM_PROFILE, 32]} />
        </mesh>
        <mesh material={m.gold}>
          <sphereGeometry args={[0.12, 32, 32]} />
        </mesh>
        <mesh rotation-y={Math.PI / 2} material={m.brass}>
          <torusGeometry args={[0.16, 0.014, 12, 48]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 1.5, 0, 0]} material={m.gold}>
            <sphereGeometry args={[0.058, 20, 20]} />
          </mesh>
        ))}

        <group ref={panL} position={[-ARM, -0.04, 0]}>
          <Pan material={m.gold} brass={m.brass} />
        </group>
        <group ref={panR} position={[ARM, -0.04, 0]}>
          <Pan material={m.gold} brass={m.brass} />
        </group>
      </group>

      <ContactShadows
        position={[0, FLOOR_Y + 0.001, 0]}
        opacity={0.6}
        scale={9}
        blur={2.6}
        far={3.5}
        resolution={512}
        color="#000000"
      />
    </group>
  );
}
