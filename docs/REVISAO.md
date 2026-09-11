# Revisão do site — 11 de setembro de 2026

## Diagnóstico

A versão anterior já possuía identidade coerente, retrato pessoal e comunicação acolhedora. A revisão de conteúdo e código encontrou oportunidades de melhorar utilidade e continuidade do atendimento. Não foi executada auditoria visual em navegador nem Lighthouse; não há notas ou métricas de desempenho presumidas.

| Observação | Mudança implementada | Benefício esperado |
|---|---|---|
| A chamada de agendamento ficava distante durante a leitura no celular | Barra inferior contextual, oculta na abertura e enquanto a seção de agendamento está visível | Acesso à consulta durante a leitura, com menos interferência no formulário |
| Escolher a data não oferecia uma visão consolidada | Resumo de data, período, assunto e modalidade | Conferência antes de continuar |
| O fluxo dependia apenas da abertura de outra janela | Texto copiável e link para reabrir WhatsApp | Alternativa se o navegador bloquear a janela ou o visitante preferir copiar |
| O texto poderia sugerir conclusão do envio | Mensagem explícita de solicitação preparada, sujeita a envio e confirmação | Expectativa correta sobre o atendimento |
| Não havia apoio prático à primeira conversa | Checklist por assunto, com progresso e marcações temporárias | Organização de informações sem coletar documentos |
| Faltava acesso simples ao contato na agenda do visitante | Download de contato vCard | Salvar telefone e nome do escritório |
| Alguns textos secundários estavam pequenos | Revisão de tamanhos e áreas de toque | Leitura e uso mais confortáveis |
| Menu móvel e âncoras tinham oportunidades de melhoria | Fechar ao clicar fora, Escape com retorno de foco, topo real no corpo da página | Navegação mais previsível |
| Calendário dependia só de cliques ou Tab | Setas do teclado, data corrente identificada e nova validação antes do envio | Uso por teclado e proteção contra datas vencidas |
| Privacidade aparecia apenas como uma frase | Explicação acessível no rodapé | Visibilidade sobre mensagem, checklist e serviços externos |
| Projeto era pouco documentado para outro provedor | README, configuração estática e testes de regras | Transferência e manutenção mais simples |

## Ideias para a próxima etapa

1. **Agenda realmente sincronizada:** conectar uma agenda definida pela Samila, com disponibilidade, duração, confirmação e cancelamento. Hoje o calendário apenas prepara uma solicitação.
2. **Dados profissionais completos:** acrescentar endereço confirmado, seccional da OAB e biografia aprovada. O número permanece exatamente como fornecido: 36213.
3. **Domínio próprio e descoberta no Google:** após escolher o domínio público, configurar endereço canônico, sitemap e Search Console. O acesso privado atual não é uma presença pública pesquisável. Não há promessa de posicionamento.
4. **Conteúdo de autoria da Samila:** publicar respostas educativas às dúvidas mais recorrentes, com revisão jurídica, autoria e data. Evitar artigos genéricos sem manutenção.
5. **Medição das campanhas:** definir quais conversões precisam ser medidas antes de instalar ferramentas e atualizar as informações de privacidade conforme o uso real. Nada foi instalado nesta etapa.
6. **Qualidade dos materiais:** uma versão vetorial da marca permitiria melhor adaptação. O arquivo novo fornecido foi mantido; não foi feita vetorização artificial ou recriação de letras.

## Decisões de escopo

Foram preservadas a identidade bordô/dourado e as áreas Trabalhista e Administrativa. Não foram adicionados chatbots jurídicos, cálculo de indenizações, depoimentos inventados, números de êxito ou disponibilidade fictícia. O site não recebe documentos sensíveis.

A marcação estruturada descreve apenas a organização e a profissional com dados fornecidos. Não declara elegibilidade a resultados enriquecidos de negócio local, que dependem de informações adicionais e requisitos do Google.

## Verificações

- Testes automatizados de fuso, datas inexistentes, ano bissexto, datas vencidas, valores inválidos e composição da mensagem.
- Verificação de sintaxe dos scripts, links internos, recursos locais e estrutura de HTML.
- DOM simulado indisponível neste ambiente; não foi executado teste de interface ou auditoria visual em navegador.
- Nenhuma implantação no GitHub/Vercel deve ser presumida a partir da presença da configuração.

## Referências técnicas consultadas

- [Vercel: configuração estática](https://vercel.com/docs/project-configuration/vercel-json).
- [Google: requisitos de dados estruturados para negócios locais](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- [MDN: preferência por movimento reduzido](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
