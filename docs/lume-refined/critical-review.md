# Lume refined — revisão final de transições

**Parecer: aprovado.** Revisor: `astra_art_review`. Nenhum defeito bloqueante encontrado nas oito janelas finais.

Escopo: oito contatos da captura final Canvas 2D por CPU, com 13 quadros consecutivos por janela, totalizando 104 quadros de origem em 1440 × 1440 a 60 fps. O parecer cobre continuidade, máscaras, transporte de objetos, sobreposições e legibilidade durante as transições.

Fonte: `public/lume-refined.js`

SHA-256: `0386c84103e24febb42600f4d9984637bc04748e551e2207b81e90ca71490ba9`

## 01 — 3.300 s

Quadros 192–204. [Contato](critical/window-01.png) · [Instante exato](critical/point-01.png).

Aprovado. O plano se dobra de forma opaca e mantém a continuidade com a biblioteca; nenhuma faixa órfã aparece.

## 02 — 3.550 s

Quadros 207–219. [Contato](critical/window-02.png) · [Instante exato](critical/point-02.png).

Aprovado. A capa e a legenda entram acompanhando a superfície. Não há resíduo cinza do plano anterior.

## 03 — 7.150 s

Quadros 423–435. [Contato](critical/window-03.png) · [Instante exato](critical/point-03.png).

Aprovado. Uma única faixa opaca transporta o título até o player. As palavras permanecem separadas durante a mudança de linha.

## 04 — 9.675 s

Quadros 575–587. [Contato](critical/window-04.png) · [Instante exato](critical/point-04.png).

Aprovado. Título, subtítulo, contador e rótulo permanecem acima da linha. A cortina remove o conteúdo anterior sem atravessar o texto novo; singular “1 dia” correto.

## 05 — 12.725 s

Quadros 758–770. [Contato](critical/window-05.png) · [Instante exato](critical/point-05.png).

Aprovado. A linha do gráfico se transforma sobre o cartão azul, sem pontos abandonados ou desconexão visível.

## 06 — 16.450 s

Quadros 981–993. [Contato](critical/window-06.png) · [Instante exato](critical/point-06.png).

Aprovado. O símbolo passa acima do nome com espaço suficiente; assinatura única, sem colisão ou duplicação.

## 07 — 20.850 s

Quadros 1245–1257. [Contato](critical/window-07.png) · [Instante exato](critical/point-07.png).

Aprovado. O retorno mantém a placa opaca e o botão azul. A breve redução de conteúdo faz parte da transformação e não produz flash ou superfície acinzentada.

## 08 — 21.350 s

Quadros 1275–1287. [Contato](critical/window-08.png) · [Instante exato](critical/point-08.png).

Aprovado. O texto do hero reaparece por recorte, com uma única placa de plano e um único CTA. Os glifos parciais são estados contínuos do recorte.

## Evidência complementar e limites

A revisão detalhada anterior dos quadros 555–590 (9,25–9,833 s) está registrada em [transition-review.json](transition-review.json) e no [contato de 36 quadros](transition-review/window-555-590.png). Ela verificou a entrada progressiva de título e contador após suas caixas passarem pela linha. As trajetórias são as mesmas da versão final; a configuração de antialiasing dessa captura anterior difere da captura CPU atual. A janela final 575–587 foi novamente inspecionada nesta revisão e não apresenta regressão.

O responsável pelo engine informou aprovação de 48/48 buscas, 1320 quadros sem flags e zero pixels de diferença no loop. Esses testes não foram repetidos por este revisor. A análise aqui documentada é visual dos quadros de origem; não constitui inspeção do vídeo final codificado nem validação de sincronismo de áudio. Nenhum arquivo de engine foi alterado pelo revisor.
