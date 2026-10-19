# Samila Beatriz Advocacia — site 3D

Next.js 15 (App Router) · TypeScript · Tailwind v4 · React Three Fiber · GSAP + ScrollTrigger · Lenis · GLSL.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npx tsx scripts/test-news.ts   # testa o parser de notícias
```

## Antes de publicar

1. **Imagens** — copie do site antigo para `public/assets/`:
   - `samila.jpeg` (retrato; sem ele aparece o monograma "SB")
   - `marca-alta.jpeg` (opcional)
2. **Revise os textos marcados como rascunho** (ver `src/lib/site.ts`):
   respostas do FAQ, listas de documentos da seção "Prepare sua consulta" e o texto da seção "A advogada".
   Foram escritos a partir dos títulos e do resumo do site original e precisam da aprovação da advogada.
3. **OAB** — o número aparece como "OAB 36213"; acrescente a UF se desejar (`site.oab`).

## Notícias (Radar Jurídico)

`GET /api/noticias` agrega feeds RSS no servidor (cache de 30 min) e o site exibe por abas.
Fontes padrão em `src/lib/news.ts`: STJ, ConJur e Agência Brasil (esta filtrada por tema).
Uma fonte fora do ar não afeta as demais.

Para somar TST, TRT-13, INSS etc., defina na Vercel (Settings → Environment Variables):

```
NEWS_EXTRA_FEEDS=[{"id":"tst","name":"TST","url":"https://URL-DO-FEED","home":"https://www.tst.jus.br","tag":"trabalhista"}]
```

## Estrutura

- `src/components/canvas/` — cena WebGL (balança, martelo, colunas, fumaça GLSL, câmera)
- `src/components/intro.tsx` — abertura cinematográfica
- `src/components/scroll-stage.tsx` — coreografia de scroll (poses da câmera por seção)
- `src/components/sections/` — seções da página
- `src/lib/site.ts` — todo o conteúdo editável
