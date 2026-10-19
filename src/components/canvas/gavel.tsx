'use client';

import { useMemo, useRef, type ComponentProps } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';

import { sceneState } from '@/lib/scene-state';
import { getLawMaterials } from './materials';

const FLOOR_Y = -1.75;
const ARM = 1.3; // distância do pivô até o centro da cabeça
const STRIKE_ANGLE = 0.15; // cabeça tocando a base
const RAISED_ANGLE = -0.9; // martelo erguido

/**
 * Martelo de juiz em nogueira com cintas douradas sobre base (sound block) de madeira.
 * O pivô fica na empunhadura: o ângulo vem de sceneState.gavel (animado pelo GSAP).
 */
export function Gavel(props: ComponentProps<'group'>) {
  const m = useMemo(getLawMaterials, []);
  const pivot = useRef<THREE.Group>(null);

  // Posição do pivô para que, no golpe, a cabeça (raio .24) encoste no topo da base (y = -1.45)
  const pivotY = useMemo(() => -1.45 + 0.24 + ARM * Math.sin(STRIKE_ANGLE), []);
  const pivotX = useMemo(() => ARM * Math.cos(STRIKE_ANGLE), []);

  useFrame((state) => {
    if (!pivot.current) return;
    const raise = sceneState.gavel + Math.sin(state.clock.elapsedTime * 1.2) * 0.015;
    pivot.current.rotation.z = THREE.MathUtils.lerp(STRIKE_ANGLE, RAISED_ANGLE, raise);
  });

  return (
    <group {...props}>
      <group rotation-y={-0.5}>
        {/* Base (sound block) */}
        <mesh position={[0, FLOOR_Y + 0.1, 0]} material={m.wood}>
          <cylinderGeometry args={[0.95, 1.0, 0.2, 80]} />
        </mesh>
        <mesh position={[0, -1.5, 0]} material={m.wood}>
          <cylinderGeometry args={[0.7, 0.74, 0.1, 80]} />
        </mesh>
        <mesh position={[0, FLOOR_Y + 0.2, 0]} rotation-x={Math.PI / 2} material={m.gold}>
          <torusGeometry args={[0.97, 0.022, 12, 96]} />
        </mesh>

        {/* Martelo */}
        <group ref={pivot} position={[pivotX, pivotY, 0]}>
          {/* cabo */}
          <mesh position={[-ARM / 2 + 0.1, 0, 0]} rotation-z={Math.PI / 2} material={m.wood}>
            <cylinderGeometry args={[0.05, 0.062, ARM + 0.2, 32]} />
          </mesh>
          {/* pomo dourado na empunhadura */}
          <mesh position={[0.22, 0, 0]} material={m.gold}>
            <sphereGeometry args={[0.075, 24, 24]} />
          </mesh>
          {/* cabeça */}
          <group position={[-ARM, 0, 0]}>
            <mesh rotation-x={Math.PI / 2} material={m.wood}>
              <cylinderGeometry args={[0.24, 0.24, 1.0, 64]} />
            </mesh>
            {[-0.5, -0.36, 0.36, 0.5].map((z) => (
              <mesh key={z} position={[0, 0, z]} material={m.gold}>
                <torusGeometry args={[0.245, 0.028, 12, 64]} />
              </mesh>
            ))}
          </group>
        </group>

        <ContactShadows
          position={[0, FLOOR_Y + 0.001, 0]}
          opacity={0.6}
          scale={8}
          blur={2.4}
          far={3}
          resolution={256}
          color="#000000"
        />
      </group>
    </group>
  );
}
