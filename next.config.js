/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // three publica ESM moderno; garante que o Next o compile de forma consistente.
  transpilePackages: ['three'],

  /**
   * Webpack (padrão do Next 15 em `dev` e `build`):
   * `asset/source` é um Asset Module nativo do webpack 5 que exporta o conteúdo
   * do arquivo como string bruta, sem precisar do raw-loader.
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/i,
      type: 'asset/source',
    });
    return config;
  },

  /**
   * Turbopack (`next dev --turbopack` / `next build --turbopack`):
   * o Turbopack ignora a chave `webpack`, então repetimos a regra com raw-loader.
   */
  turbopack: {
    rules: {
      '*.glsl': { loaders: ['raw-loader'], as: '*.js' },
      '*.vert': { loaders: ['raw-loader'], as: '*.js' },
      '*.frag': { loaders: ['raw-loader'], as: '*.js' },
    },
  },
};

module.exports = nextConfig;
