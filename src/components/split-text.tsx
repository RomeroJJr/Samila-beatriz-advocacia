import type { JSX } from 'react';

type Props = {
  /** Use *asteriscos* para destacar palavras em itálico dourado. */
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** true → palavras marcadas para a animação de entrada do hero (após a abertura). */
  hero?: boolean;
};

/**
 * Quebra o texto em palavras com máscara (overflow hidden) para animar com GSAP.
 * Renderiza no servidor: o texto continua legível/indexável sem JavaScript.
 */
export function SplitWords({ text, as: Tag = 'span', className = '', hero = false }: Props) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  const wordAttr: Record<string, string> = hero ? { 'data-hero-word': '' } : { 'data-word': '' };

  const words: { w: string; em: boolean }[] = parts.flatMap((part) => {
    const em = part.startsWith('*') && part.endsWith('*');
    return (em ? part.slice(1, -1) : part)
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, em }));
  });

  const Element = Tag as keyof JSX.IntrinsicElements as 'span';

  return (
    <Element className={className} {...(hero ? {} : { 'data-split': '' })}>
      {words.map(({ w, em }, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
            <span
              {...wordAttr}
              className={`inline-block will-change-transform ${em ? 'font-serif italic gold-text' : ''}`}
            >
              {w}
            </span>
          </span>{' '}
        </span>
      ))}
    </Element>
  );
}
