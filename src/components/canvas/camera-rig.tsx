'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { onImpact } from '@/lib/scene-actions';
import { sceneState } from '@/lib/scene-state';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Diretor de câmera: segue as poses animadas pelo ScrollTrigger e soma
 * parallax do ponteiro, deriva lenta, entrada da abertura e tremor de impacto.
 */
export function CameraRig() {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(...[-1.9, 0.55, 0]), []);
  const shake = useRef(0);

  useEffect(
    () =>
      onImpact(() => {
        shake.current = 1;
      }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const s = sceneState;
    const t = state.clock.elapsedTime;
    const mobile = size.width < 900;
    const damp = THREE.MathUtils.damp;
    const intro = easeOut(s.intro);

    // Em telas estreitas: afasta a câmera e centraliza o objeto (texto fica por baixo)
    const zMul = mobile ? 1.35 : 1;
    const tx = s.camX + state.pointer.x * 0.28 + Math.sin(t * 0.21) * 0.12;
    const ty = s.camY + (mobile ? 0.5 : 0) + state.pointer.y * 0.14 + Math.cos(t * 0.17) * 0.06;
    const tz = s.camZ * zMul + (1 - intro) * 3.5;

    camera.position.x = damp(camera.position.x, tx, 3.2, dt);
    camera.position.y = damp(camera.position.y, ty, 3.2, dt);
    camera.position.z = damp(camera.position.z, tz, 3.2, dt);

    shake.current *= Math.exp(-6 * dt);
    if (shake.current > 0.001) {
      camera.position.x += (Math.random() - 0.5) * 0.09 * shake.current;
      camera.position.y += (Math.random() - 0.5) * 0.09 * shake.current;
    }

    look.x = damp(look.x, mobile ? s.camX : s.lookX, 3.2, dt);
    look.y = damp(look.y, s.lookY - (mobile ? 0.8 : 0), 3.2, dt);
    look.z = damp(look.z, s.lookZ, 3.2, dt);
    camera.lookAt(look);
  });

  return null;
}
