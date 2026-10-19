import * as THREE from 'three';

/** PRNG determinístico (mulberry32): mesma textura em toda renderização. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping; // espelha para esconder emendas
  texture.anisotropy = 8;
  return texture;
}

/** Mármore creme com nuvens suaves e veios ramificados. */
export function makeMarbleTexture(size = 1024) {
  const r = rng(7);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d')!;

  const base = g.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#f4eee4');
  base.addColorStop(0.5, '#ebe3d6');
  base.addColorStop(1, '#f1eadf');
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);

  for (let i = 0; i < 60; i++) {
    const x = r() * size;
    const y = r() * size;
    const rad = 60 + r() * 220;
    const grad = g.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, `rgba(120,105,95,${0.03 + r() * 0.06})`);
    grad.addColorStop(1, 'rgba(120,105,95,0)');
    g.fillStyle = grad;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  const vein = (x: number, y: number, angle: number, length: number, width: number, alpha: number, depth: number) => {
    const branches: [number, number, number][] = [];
    g.beginPath();
    g.moveTo(x, y);
    for (let i = 0; i < length; i++) {
      angle += (r() - 0.5) * 0.5;
      x += Math.cos(angle) * 9;
      y += Math.sin(angle) * 9;
      g.lineTo(x, y);
      if (depth < 2 && r() < 0.04) branches.push([x, y, angle]);
    }
    g.lineWidth = width;
    g.strokeStyle = `rgba(86,70,66,${alpha})`;
    g.shadowColor = 'rgba(86,70,66,0.35)';
    g.shadowBlur = 6;
    g.stroke();
    for (const [bx, by, ba] of branches) {
      vein(bx, by, ba + (r() - 0.5) * 1.8, (length * 0.5) | 0, width * 0.6, alpha * 0.75, depth + 1);
    }
  };

  for (let i = 0; i < 16; i++) {
    vein(r() * size, r() * size, r() * Math.PI * 2, 50 + ((r() * 70) | 0), 0.6 + r() * 2, 0.12 + r() * 0.3, 0);
  }
  g.shadowBlur = 0;

  return toTexture(canvas);
}

/** Nogueira escura com veios longos e levemente ondulados. */
export function makeWoodTexture(size = 1024) {
  const r = rng(21);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d')!;

  g.fillStyle = '#3b2113';
  g.fillRect(0, 0, size, size);

  for (let i = 0; i < 260; i++) {
    const y = r() * size;
    const dark = r() > 0.5;
    g.strokeStyle = dark ? `rgba(20,10,4,${0.06 + r() * 0.16})` : `rgba(120,70,32,${0.05 + r() * 0.12})`;
    g.lineWidth = 0.5 + r() * 2.2;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= size; x += 32) {
      g.lineTo(x, y + Math.sin(x * 0.01 + i) * 3 + (r() - 0.5) * 1.5);
    }
    g.stroke();
  }

  return toTexture(canvas);
}
