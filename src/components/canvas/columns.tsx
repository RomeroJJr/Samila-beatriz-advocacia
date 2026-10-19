'use client';

import { useMemo, type ComponentProps } from 'react';
import * as THREE from 'three';

import { getLawMaterials } from './materials';

const FLOOR_Y = -1.75;
const SHAFT_H = 5.2;
const SHAFT_R = 0.62;
const FLUTES = 20;

/** Fuste canelado: cilindro cujo raio oscila com o ângulo, com leve entase (afina para cima). */
function useFlutedShaft() {
  return useMemo(() => {
    const geo = new THREE.CylinderGeometry(SHAFT_R * 0.92, SHAFT_R, SHAFT_H, 120, 24, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const theta = Math.atan2(z, x);
      const groove = Math.pow(Math.abs(Math.sin((theta * FLUTES) / 2)), 0.6);
      const k = 1 - 0.05 * (1 - groove);
      pos.setX(i, x * k);
      pos.setZ(i, z * k);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

const COLUMN_X = [-5.2, -2.6, 0, 2.6, 5.2];

/** Pórtico de colunas em mármore (palco da seção de notícias). */
export function Columns(props: ComponentProps<'group'>) {
  const m = useMemo(getLawMaterials, []);
  const shaft = useFlutedShaft();
  const shaftY = FLOOR_Y + 0.54 + SHAFT_H / 2;
  const capY = shaftY + SHAFT_H / 2;

  return (
    <group {...props}>
      <group position={[0, 0, -3]}>
        {/* Degraus */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, FLOOR_Y + 0.09 + i * 0.18, 1.2 - i * 0.35]} material={m.marble}>
            <boxGeometry args={[16 - i * 0.6, 0.18, 5 - i * 0.7]} />
          </mesh>
        ))}

        {COLUMN_X.map((x) => (
          <group key={x} position={[x, 0, 0]}>
            {/* base */}
            <mesh position={[0, FLOOR_Y + 0.66, 0]} material={m.marble}>
              <boxGeometry args={[1.5, 0.24, 1.5]} />
            </mesh>
            <mesh position={[0, FLOOR_Y + 0.86, 0]} material={m.marble}>
              <cylinderGeometry args={[0.8, 0.86, 0.18, 48]} />
            </mesh>
            {/* fuste */}
            <mesh position={[0, shaftY + 0.1, 0]} geometry={shaft} material={m.marble} />
            {/* capitel */}
            <mesh position={[0, capY + 0.2, 0]} material={m.marble}>
              <cylinderGeometry args={[0.86, 0.66, 0.34, 48]} />
            </mesh>
            <mesh position={[0, capY + 0.46, 0]} material={m.marble}>
              <boxGeometry args={[1.6, 0.2, 1.6]} />
            </mesh>
            <mesh position={[0, capY + 0.36, 0]} rotation-x={Math.PI / 2} material={m.gold}>
              <torusGeometry args={[0.74, 0.02, 10, 64]} />
            </mesh>
          </group>
        ))}

        {/* Entablamento com friso dourado */}
        <mesh position={[0, capY + 0.9, 0]} material={m.marble}>
          <boxGeometry args={[14.6, 0.7, 1.9]} />
        </mesh>
        <mesh position={[0, capY + 0.58, 0.96]} material={m.gold}>
          <boxGeometry args={[14.6, 0.05, 0.04]} />
        </mesh>
        <mesh position={[0, capY + 1.3, 0]} material={m.marble}>
          <boxGeometry args={[15.2, 0.16, 2.2]} />
        </mesh>
      </group>
    </group>
  );
}
