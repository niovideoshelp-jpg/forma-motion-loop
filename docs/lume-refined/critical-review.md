# Lume refined — revisão final de transições

**Parecer: aprovado.** Revisor: `astra_art_review`. Nenhum defeito bloqueante encontrado nas oito janelas regeneradas após a alteração do CTA.

Escopo: oito contatos finais Canvas 2D por CPU; 13 quadros consecutivos por janela, total de 104 quadros de origem em 1440 × 1440 a 60 fps. A revisão cobre continuidade, máscaras, transporte de objetos e legibilidade, com atenção ao handoff de 3,3 s e ao botão com contorno em 21,35 s.

Fonte: `public/lume-refined.js`

SHA-256: `adccb12092e6f8d3761d024a6fa6e533da5deea3575fd21201abe60576bdb766`

## 01 — 3.300 s

Quadros 192–204. [Contato](critical/window-01.png) · [Instante exato](critical/point-01.png).

Aprovado. O CTA continua azul após a confirmação. A passagem para a superfície seguinte mantém posição, preenchimento e continuidade; o plano se dobra de forma opaca sem faixa órfã.

## 02 — 3.550 s

Quadros 207–219. [Contato](critical/window-02.png) · [Instante exato](critical/point-02.png).

Aprovado. A capa emerge da mesma superfície e a legenda acompanha sua geometria. Nenhum resíduo cinza do plano anterior.

## 03 — 7.150 s

Quadros 423–435. [Contato](critical/window-03.png) · [Instante exato](critical/point-03.png).

Aprovado. Faixa opaca única transporta o título; palavras separadas, arte estável e sem título duplicado.

## 04 — 9.675 s

Quadros 575–587. [Contato](critical/window-04.png) · [Instante exato](critical/point-04.png).

Aprovado. Título, subtítulo, contador e rótulo permanecem acima da linha. A cortina remove o conteúdo anterior sem atravessar o texto novo; singular “1 dia” correto.

## 05 — 12.725 s

Quadros 758–770. [Contato](critical/window-05.png) · [Instante exato](critical/point-05.png).

Aprovado. Linha do gráfico se transforma sobre cartão azul, sem pontos abandonados ou desconexão visível.

## 06 — 16.450 s

Quadros 981–993. [Contato](critical/window-06.png) · [Instante exato](critical/point-06.png).

Aprovado. Símbolo passa acima do nome com espaço suficiente; assinatura única, sem colisão.

## 07 — 20.850 s

Quadros 1245–1257. [Contato](critical/window-07.png) · [Instante exato](critical/point-07.png).

Aprovado. Retorno conserva a placa opaca. O botão azul começa a drenar para revelar fundo claro e borda azul, sem duplicação ou mudança abrupta de forma.

## 08 — 21.350 s

Quadros 1275–1287. [Contato](critical/window-08.png) · [Instante exato](critical/point-08.png).

Aprovado. O CTA já está claro com borda e texto azuis, sem resíduo do líquido. Hero reaparece por recorte e há uma única placa e um único botão.

## Evidência complementar e limites

A alteração do botão tem parecer específico em [cta-review.json](cta-review.json), incluindo contraste durante o preenchimento, origem da frente líquida e recuperação do estado inicial.

A revisão detalhada anterior dos quadros 555–590 (9,25–9,833 s) permanece como evidência complementar em [transition-review.json](transition-review.json) e no [contato de 36 quadros](transition-review/window-555-590.png). Ela verificou a entrada de título e contador somente após suas caixas passarem pela linha. As trajetórias dessa passagem foram preservadas; a captura anterior usa outra configuração de antialiasing. A janela atual 575–587 foi novamente inspecionada e continua aprovada.

A aprovação aqui é visual dos quadros de origem. A igualdade numérica do loop, a determinância de seek e a exportação codificada devem ser confirmadas pelos respectivos relatórios de auditoria da versão atual; esses testes não foram repetidos por este revisor. Não foi avaliado sincronismo de áudio. Nenhum engine foi alterado nem captura regenerada por este revisor.
