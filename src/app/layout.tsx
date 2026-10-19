import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

import './globals.css';
import { CanvasRoot } from '@/components/canvas-root';
import { CustomCursor } from '@/components/custom-cursor';
import { Intro } from '@/components/intro';
import { SmoothScroll } from '@/components/smooth-scroll';
import { site } from '@/lib/site';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const description =
  'Atendimento jurídico trabalhista e previdenciário, presencial em Catolé do Rocha e região e online para todo o Brasil.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'Samila Beatriz | Advocacia em Catolé do Rocha e Online',
  description,
  openGraph: {
    title: 'Samila Beatriz | Advocacia em Catolé do Rocha e Online',
    description,
    url: site.url,
    siteName: site.fullName,
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#4b1026',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: site.fullName,
  url: site.url,
  telephone: '+55 83 9841-8078',
  description,
  areaServed: ['Catolé do Rocha', 'Paraíba', 'Brasil'],
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'BR' },
  knowsAbout: ['Direito Trabalhista', 'Direito Previdenciário'],
  employee: { '@type': 'Person', name: site.name, jobTitle: 'Advogada' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${cormorant.variable}`}>
      <head>
        {/* Sem JavaScript a abertura não pode cobrir o site */}
        <noscript>
          <style>{`#intro{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SmoothScroll>
          <CanvasRoot />
          <CustomCursor />
          <Intro />
          {children}
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
