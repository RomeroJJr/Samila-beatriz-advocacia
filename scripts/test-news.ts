/**
 * Teste do parser de notícias com XML de exemplo no formato real de cada fonte.
 * Rodar: npx tsx scripts/test-news.ts
 */
import assert from 'node:assert/strict';
import { classify, parseDate, parseFeed, truncate, type FeedDef } from '../src/lib/news-parse';

const stj: FeedDef = { id: 'stj', name: 'STJ', url: '', home: '', defaultTag: 'tribunais' };
const agencia: FeedDef = { id: 'ab', name: 'Agência Brasil', url: '', home: '', defaultTag: 'tribunais', filter: true };

// 1) Datas
assert.equal(parseDate('Seg, out 19 2026 06:50:00'), '2026-10-19T09:50:00.000Z', 'data pt-BR do STJ (-03:00)');
assert.equal(parseDate('Mon, 19 Oct 2026 09:02:00 -0300'), '2026-10-19T12:02:00.000Z', 'RFC 822');
assert.equal(parseDate('2026-10-19T08:00:00Z'), '2026-10-19T08:00:00.000Z', 'ISO');
assert.equal(parseDate('lixo'), null, 'inválida');

// 2) Classificação
assert.equal(classify('INSS muda regra de aposentadoria por idade'), 'previdenciario');
assert.equal(classify('TST decide sobre horas extras e jornada de trabalho'), 'trabalhista');
assert.equal(classify('Presidente do STJ participa de evento'), null);

// 3) RSS no formato do STJ (CDATA, data pt-BR, content:encoded)
const stjXml = `<?xml version="1.0"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel><title>STJ</title>
<item>
  <guid>https://www.stj.jus.br/n/1</guid>
  <title><![CDATA[Segunda Turma define regra sobre benefício previdenciário do INSS]]></title>
  <link>https://www.stj.jus.br/n/1</link>
  <description><![CDATA[<p>O colegiado analisou a <b>aposentadoria</b> de segurado.</p>]]></description>
  <pubDate>Seg, out 19 2026 06:50:00</pubDate>
</item>
<item>
  <title>Evento institucional</title>
  <link>https://www.stj.jus.br/n/2</link>
  <description>Evento institucional</description>
  <pubDate>Dom, out 18 2026 06:55:00</pubDate>
</item>
<item><title>Sem data</title><link>https://www.stj.jus.br/n/3</link></item>
<item><title>Link perigoso</title><link>javascript:alert(1)</link><pubDate>Seg, out 19 2026 06:50:00</pubDate></item>
</channel></rss>`;

const a = parseFeed(stjXml, stj);
assert.equal(a.length, 2, 'descarta item sem data e link javascript:');
assert.equal(a[0].tag, 'previdenciario');
assert.equal(a[0].summary, 'O colegiado analisou a aposentadoria de segurado.', 'HTML removido');
assert.equal(a[1].tag, 'tribunais');
assert.equal(a[1].summary, '', 'resumo igual ao título é omitido');

// 4) Feed generalista filtra o que não é do tema
const abXml = `<rss version="2.0"><channel>
<item><title>Chuvas ficam mais intensas no Norte</title><link>https://ab/1</link><pubDate>Mon, 19 Oct 2026 09:02:00 -0300</pubDate></item>
<item><title>INSS libera calendário do 13º</title><link>https://ab/2</link><pubDate>Mon, 19 Oct 2026 08:40:00 -0300</pubDate></item>
</channel></rss>`;
const b = parseFeed(abXml, agencia);
assert.equal(b.length, 1);
assert.equal(b[0].link, 'https://ab/2');

// 5) Atom
const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><entry>
<title>Nova súmula trabalhista</title><link rel="alternate" href="https://x/1"/><updated>2026-10-19T10:00:00Z</updated><summary>Resumo</summary>
</entry></feed>`;
const c = parseFeed(atom, stj);
assert.equal(c.length, 1);
assert.equal(c[0].link, 'https://x/1');

// 6) XML quebrado não lança exceção fatal além do parse
assert.doesNotThrow(() => parseFeed('<rss><channel></channel></rss>', stj));
assert.equal(truncate('a'.repeat(300), 100).length <= 101, true);

console.log('OK — parser de notícias: todos os testes passaram');
