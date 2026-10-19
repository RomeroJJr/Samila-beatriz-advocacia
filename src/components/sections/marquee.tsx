const items = [
  'Direito Trabalhista',
  'Direito Previdenciário',
  'Aposentadorias',
  'BPC/LOAS',
  'Pensão por morte',
  'Rescisões e verbas',
  'Benefícios por incapacidade',
  'Salário-maternidade',
  'Análise do CNIS',
  'Recursos no INSS',
];

export function Marquee() {
  // duas cópias → o loop em -50% é contínuo
  const row = [...items, ...items];
  return (
    <div className="marquee relative z-10 overflow-hidden border-y border-gold-500/20 bg-wine-950/70 py-5 backdrop-blur-md" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={`${n}-${i}`} className="flex items-center whitespace-nowrap font-serif text-2xl italic text-ivory/70 md:text-3xl">
                <span className="px-8">{t}</span>
                <span className="text-gold-500">✧</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
