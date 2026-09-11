# Samila Beatriz Advocacia

Landing page em português, com identidade bordô e dourado, apresentação da advogada, áreas de atuação, preparação interativa para consulta e solicitação pelo WhatsApp.

## Executar localmente

Não há dependências de produção nem etapa de compilação. Na raiz do projeto:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000`. Para verificar o código, use Node.js 20 ou superior:

```sh
npm run check
npm test
```

## Estrutura

- `dist/index.html`: conteúdo, estrutura, metadados e navegação.
- `dist/style.css`: identidade visual, layout responsivo e animações.
- `dist/app.js`: calendário, formulário, checklist e interações.
- `dist/booking-utils.js`: regras de datas, validação e mensagem.
- `dist/assets/`: fotos, logomarca e contato vCard.
- `tests/booking.test.cjs`: verificações das regras de agendamento.
- `docs/REVISAO.md`: diagnóstico, melhorias e próximos passos.
- `vercel.json`: configuração de exportação estática para Vercel.
- `.openai/hosting.json`: identificação do projeto no Sites; não contém credenciais.

## Publicação a partir do GitHub

No Vercel, importe o repositório, mantenha a raiz do projeto e escolha o preset **Other**. O `vercel.json` define `dist` como diretório de saída e desativa instalação e compilação. Não selecione Next.js ou Vite. Nenhuma chave de API é necessária.

A configuração foi preparada conforme a [documentação do Vercel](https://vercel.com/docs/project-configuration/vercel-json). A publicação no Vercel não foi executada nem validada nesta revisão.

No Sites, mantenha a identidade existente e utilize o fluxo de salvar e publicar versões. Publicações em provedores diferentes são independentes.

## Comportamento do agendamento

O calendário apresenta **preferências**, não disponibilidade em tempo real. O visitante escolhe data, período, formato e assunto. A mensagem fica visível, pode ser copiada e é aberta no WhatsApp. O visitante ainda precisa enviá-la; o escritório confirma a consulta. Não há criação de evento, pagamento, armazenamento de leads ou envio automático.

Datas passadas são recusadas, inclusive quando a página fica aberta de um dia para outro. A data corrente usa o fuso da Paraíba (`America/Fortaleza`). Os dias de fim de semana continuam selecionáveis como preferência; nenhum expediente foi presumido.

A lista de preparação guarda marcações somente na memória da página. Não coleta documentos nem persiste dados. O texto de privacidade descreve o comportamento atual; deve ser revisto se forem adicionados analytics, pixels, agenda externa ou formulários com banco de dados.

## Personalizar

Edite textos em `dist/index.html`. As listas de preparação estão em `preparationSets`, em `dist/app.js`. As cores estão em `:root` de `dist/style.css`.

O WhatsApp é `558398418078`. Ao alterá-lo, atualize os links HTML, a montagem da mensagem em `app.js`, os metadados e o vCard. A logomarca nova é `marca-alta.jpeg`; a imagem original é apresentada através de CSS, sem recriação da tipografia.

Antes de divulgação pública, confirme a seccional da inscrição OAB, endereço completo, condições de atendimento e biografia com a Samila. Não foram acrescentados prêmios, depoimentos, números de clientes, especializações ou promessas de resultado.

## Acessibilidade e dados

Há navegação por teclado, foco visível, datas com rótulos completos, suporte a movimento reduzido e alternativa de contato sem JavaScript. As fontes são carregadas pelo Google Fonts; os demais recursos essenciais estão no projeto. Não há rastreamento publicitário instalado.

Foto e logomarca são materiais fornecidos pelo titular do projeto. Este repositório não concede licença geral para reutilização desses materiais.
