// Quad em tela cheia: ignora a câmera e escreve direto em clip space.
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
