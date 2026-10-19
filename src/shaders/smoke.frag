// Fundo de fumaça/névoa bordô com fios dourados.
// (snoise() é injetada antes deste arquivo em smoke-material.ts)

uniform float uTime;
uniform float uProgress;   // progresso do scroll 0..1
uniform vec2 uResolution;
uniform vec2 uMouse;       // NDC -1..1
uniform vec3 uColorA;      // vinho quase preto
uniform vec3 uColorB;      // bordô #4b1026
uniform vec3 uColorC;      // dourado

varying vec2 vUv;

float fbm(vec3 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return s;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 1.6;
  vec2 m = uMouse * vec2(aspect, 1.0) * 0.8;

  float t = uTime * 0.045;
  vec3 q = vec3(p, t);

  // Domain warping: a fumaça dobra sobre si mesma
  float n1 = fbm(q);
  float n2 = fbm(q * 1.5 + vec3(n1 * 0.9, n1 * 0.6, 0.0) + vec3(5.2, 1.3, t * 1.4));
  float k = smoothstep(0.05, 0.95, n2 * 0.5 + 0.5);

  vec3 col = mix(uColorA, uColorB, k);

  // Brilho que segue o cursor
  float glow = exp(-length(p - m) * 1.7);
  col += uColorC * glow * 0.09;

  // Fios dourados nas cristas da fumaça (mais presentes ao longo do scroll)
  float wisp = smoothstep(0.66, 0.96, n2 * 0.5 + 0.5);
  col += uColorC * wisp * (0.05 + uProgress * 0.05);

  // Vinheta
  float v = smoothstep(1.35, 0.15, length(vUv - 0.5) * 1.55);
  col *= mix(0.5, 1.0, v);

  // Grão fino
  float g = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);

  #include <colorspace_fragment>
}
