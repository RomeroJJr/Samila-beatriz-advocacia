import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';

import noise from '@/shaders/simplex-noise.glsl';
import vertexMain from '@/shaders/smoke.vert';
import fragmentMain from '@/shaders/smoke.frag';

export type SmokeUniforms = {
  uTime: number;
  uProgress: number;
  uResolution: THREE.Vector2;
  uMouse: THREE.Vector2;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
  uColorC: THREE.Color;
};

const defaults: SmokeUniforms = {
  uTime: 0,
  uProgress: 0,
  uResolution: new THREE.Vector2(1, 1),
  uMouse: new THREE.Vector2(0, 0),
  uColorA: new THREE.Color('#0c0408'),
  uColorB: new THREE.Color('#4b1026'),
  uColorC: new THREE.Color('#c9a45c'),
};

export const SmokeMaterial = shaderMaterial(
  defaults,
  vertexMain,
  /* glsl */ `
${noise}
${fragmentMain}
`,
);

export type SmokeMaterialImpl = THREE.ShaderMaterial & SmokeUniforms;

extend({ SmokeMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    smokeMaterial: ThreeElement<typeof SmokeMaterial>;
  }
}
