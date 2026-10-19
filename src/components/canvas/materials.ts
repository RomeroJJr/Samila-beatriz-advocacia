import * as THREE from 'three';
import { makeMarbleTexture, makeWoodTexture } from './textures';

export type LawMaterials = {
  gold: THREE.MeshPhysicalMaterial;
  brass: THREE.MeshPhysicalMaterial;
  marble: THREE.MeshPhysicalMaterial;
  wood: THREE.MeshPhysicalMaterial;
};

let cache: LawMaterials | null = null;

/** Materiais PBR compartilhados pelos três palcos (criados uma única vez, no browser). */
export function getLawMaterials(): LawMaterials {
  if (cache) return cache;

  const marbleMap = makeMarbleTexture(1024);
  const woodMap = makeWoodTexture(1024);

  cache = {
    gold: new THREE.MeshPhysicalMaterial({
      color: '#d9b25a',
      metalness: 1,
      roughness: 0.2,
      clearcoat: 0.4,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.8,
      emissive: '#ffb347',
      emissiveIntensity: 0,
    }),
    brass: new THREE.MeshPhysicalMaterial({
      color: '#9c7a34',
      metalness: 1,
      roughness: 0.38,
      envMapIntensity: 1.4,
    }),
    marble: new THREE.MeshPhysicalMaterial({
      map: marbleMap,
      color: '#ffffff',
      roughness: 0.2,
      metalness: 0,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.1,
    }),
    wood: new THREE.MeshPhysicalMaterial({
      map: woodMap,
      color: '#ffffff',
      roughness: 0.38,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.9,
    }),
  };
  return cache;
}
