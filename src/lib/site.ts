export const site = {
  name: 'Samila Beatriz',
  fullName: 'Samila Beatriz Advocacia',
  oab: 'OAB 36213',
  whatsappNumber: '558398418078',
  phoneDisplay: '(83) 9841-8078',
  city: 'Catolé do Rocha',
  region: 'PB',
  url: 'https://samila-beatriz-advocacia.vercel.app',
} as const;

/** Link do WhatsApp com mensagem pré-preenchida. */
export const wa = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const areas = [
  {
    id: 'trabalhista',
    title: 'Direito Trabalhista',
    lead: 'Orientação para quem trabalha e precisa entender seus direitos e o melhor caminho.',
    items: [
      'Contratos e relações de trabalho',
      'Rescisões e verbas trabalhistas',
      'Jornada, remuneração e condições de trabalho',
      'Consultoria e demandas trabalhistas',
    ],
    message: 'Olá, Dra. Samila! Gostaria de conversar sobre um caso trabalhista.',
  },
  {
    id: 'previdenciario',
    title: 'Direito Previdenciário',
    lead: 'Acompanhamento cuidadoso em benefícios, contribuições e decisões do INSS.',
    items: [
      'Aposentadorias e planejamento previdenciário',
      'Benefícios por incapacidade e auxílio-acidente',
      'Pensão por morte e salário-maternidade',
      'BPC/LOAS (benefício assistencial)',
      'Análise do CNIS, contribuições e documentos',
      'Requerimentos, revisões e recursos no INSS',
    ],
    message: 'Olá, Dra. Samila! Gostaria de conversar sobre um caso previdenciário.',
  },
] as const;

export const steps = [
  {
    title: 'Escuta e análise',
    text: 'Ouvimos a sua história e analisamos o CNIS, as contribuições e os documentos disponíveis.',
  },
  {
    title: 'Orientação e preparação',
    text: 'Explicamos o caminho adequado ao seu caso e organizamos o que é necessário antes do pedido.',
  },
  {
    title: 'Pedido e acompanhamento',
    text: 'O requerimento é apresentado e cada movimentação é acompanhada com você.',
  },
  {
    title: 'Análise da decisão',
    text: 'Avaliamos o resultado e, quando cabível, seguimos com revisão, recurso ou medida judicial.',
  },
] as const;

export const pillars = [
  { title: 'Escuta com atenção', text: 'Cada caso começa por ouvir. Só depois vem a análise.' },
  { title: 'Clareza em cada etapa', text: 'Linguagem acessível, sem juridiquês, do primeiro contato à decisão.' },
  {
    title: 'Respeito à história',
    text: 'Análise individual, discrição e cuidado com as informações compartilhadas.',
  },
] as const;

export const faq = [
  {
    q: 'Posso pedir orientação antes de fazer um pedido?',
    a: 'Sim. A conversa inicial serve para entender o seu caso, indicar quais documentos fazem falta e avaliar se este é o momento de dar entrada — antes de qualquer pedido.',
  },
  {
    q: 'O que fazer se o meu benefício foi negado?',
    a: 'A negativa nem sempre encerra o assunto. É preciso analisar o motivo apontado pelo INSS, os documentos e os prazos. Conforme o caso, pode caber recurso, nova análise ou medida judicial. Cada situação é avaliada individualmente e não há garantia de resultado.',
  },
  {
    q: 'Como funciona a primeira consulta?',
    a: 'Você conta a sua história, apresentamos a leitura dos documentos que tiver em mãos e explicamos os caminhos possíveis em linguagem clara. A consulta pode ser online, por videochamada, ou presencial.',
  },
  {
    q: 'Atendem pessoas de outras cidades?',
    a: 'Sim. O atendimento online alcança todo o Brasil. O atendimento presencial é em Catolé do Rocha e região, na Paraíba.',
  },
  {
    q: 'Quais documentos devo levar?',
    a: 'Depende do assunto. Use a seção “Prepare sua consulta” para ver uma lista de apoio. Se faltar algum documento, ainda assim é possível agendar: ajudamos a identificar o que precisa ser reunido.',
  },
  {
    q: 'Como funcionam os honorários?',
    a: 'Os honorários são informados com transparência durante a consulta, de acordo com o tipo e a complexidade do caso. Este site não divulga valores.',
  },
  {
    q: 'A data da consulta é confirmada na hora?',
    a: 'Não. O formulário envia a sua solicitação pelo WhatsApp e a data só é confirmada após o retorno da advogada, com o local e o horário no caso do atendimento presencial.',
  },
] as const;

export const prepare = [
  {
    id: 'trabalho',
    label: 'Relação de trabalho',
    docs: [
      'Documento de identificação com foto e CPF',
      'Carteira de Trabalho (física e/ou digital)',
      'Contrato de trabalho, se houver',
      'Holerites e comprovantes de pagamento',
      'Termo de rescisão (TRCT) e extrato do FGTS',
      'Mensagens, escalas ou registros de jornada que ajudem a contar a história',
    ],
  },
  {
    id: 'inss',
    label: 'Aposentadoria ou benefício do INSS',
    docs: [
      'Documento de identificação com foto e CPF',
      'Extrato CNIS (pelo Meu INSS)',
      'Carteira de Trabalho e carnês de contribuição',
      'Comprovante de residência',
      'Laudos, receitas e atestados (benefícios por incapacidade)',
      'Cartas, indeferimentos ou exigências recebidas do INSS',
    ],
  },
  {
    id: 'duvida',
    label: 'Ainda não tenho certeza',
    docs: [
      'Documento de identificação com foto e CPF',
      'Carteira de Trabalho (física e/ou digital)',
      'Extrato CNIS, se tiver acesso',
      'Qualquer carta, comprovante ou protocolo relacionado ao assunto',
      'Um resumo simples, em ordem de datas, do que aconteceu',
    ],
  },
] as const;

export const portals = [
  { name: 'STF', desc: 'Supremo Tribunal Federal', url: 'https://portal.stf.jus.br' },
  { name: 'STJ', desc: 'Superior Tribunal de Justiça', url: 'https://www.stj.jus.br' },
  { name: 'TST', desc: 'Tribunal Superior do Trabalho', url: 'https://www.tst.jus.br' },
  { name: 'TRT-13', desc: 'Tribunal Regional do Trabalho da Paraíba', url: 'https://www.trt13.jus.br' },
  { name: 'TRF-5', desc: 'Tribunal Regional Federal da 5ª Região', url: 'https://www.trf5.jus.br' },
  { name: 'CNJ', desc: 'Conselho Nacional de Justiça', url: 'https://www.cnj.jus.br' },
  { name: 'Meu INSS', desc: 'Extratos, CNIS e requerimentos', url: 'https://meu.inss.gov.br' },
  { name: 'Planalto', desc: 'Presidência da República e legislação', url: 'https://www.planalto.gov.br' },
  { name: 'ConJur', desc: 'Consultor Jurídico', url: 'https://www.conjur.com.br' },
  { name: 'Migalhas', desc: 'Notícias e análises jurídicas', url: 'https://www.migalhas.com.br' },
  { name: 'JusBrasil', desc: 'Jurisprudência e notícias', url: 'https://www.jusbrasil.com.br' },
] as const;
