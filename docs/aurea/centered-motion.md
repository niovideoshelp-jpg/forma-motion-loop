**AURÉA — coreografia centralizada, 5 de outubro de 2026**

O módulo `public/aurea-motion.js` foi congelado com SHA-256 `73030a273e0400f9d68fafdd86034eed1d1fb48c10c94fc5fe8d9b30b8ce81a4`. Nesta rodada, somente esse módulo de código foi alterado; este documento registra a revisão. Engine, imagens, áudio e rotinas de teste não foram editados.

As fotografias principais agora assentam no eixo horizontal de tela `x=540`. Todas as poses da câmera têm `y=0` e `logZoom=0`; não existe correção de enquadramento por zoom ou desvio vertical. As fotografias continuam com proporção 0,8, sem deformação.

| Elemento | Posição de mundo / tamanho | Deriva durante leitura |
| --- | --- | --- |
| Noir | `(0,965)`, 768 × 960 | Somente y: 0 → −16 px |
| Lumière | `(1150,965)`, 768 × 960 | Somente y: 0 → −16 px |
| Prune | `(2300,965)`, 768 × 960 | x fixo, y: 0 → −12 px |
| Chegada grande do detalhe | `(3450,965)`, 688 × 860 | Chega em 9,10 s; transformação seguinte começa em 9,30 s |
| Retrato pequeno do detalhe | `(3168,975)`, 336 × 420 | Chega em 10,10 s; y termina em 951 em 12,30 s |
| Compositor | `(4600,735)`, 320 × 400 | x fixo; y termina em 727 |
| Marca | `(5750,925)`, 640 × 800 | x fixo; y termina em 913 |
| Retorno Noir | `(6900,965)`, 768 × 960 | Corresponde ao enquadramento inicial |

A marca ocupa inicialmente y=525–1325; a deriva termina em y=513–1313. A nova geometria separa a fotografia da linha superior e da copy inferior nas coordenadas acordadas. A validação de sobreposição com o desenho final cabe às capturas do engine integrado.

Os horários, a duração de 22 s, as curvas dos gestos e os contatos UV foram preservados. Os swipes de Noir e Lumière começam com a ponta em `(808,8;1093)`; o toque em Prune ocorre em aproximadamente `(808,8;1097)`. A ponta acompanha UV `(0,85;0,65)` durante o contato, e sua soltura conserva a velocidade da fotografia antes da saída pelo rodapé. O CTA inicial centralizado recebe o primeiro contato em `(835,1535)` aos 0,35 s; o CTA verde mantém o contato em `(810,1535)` aos 12,30 s.

A deriva é vertical e monotônica durante cada leitura. Sua chegada é usada como partida da transferência seguinte, evitando correções bruscas de posição. O detalhe permanece deslocado lateralmente por sua função de composição com o recorte ampliado; as demais chegadas principais preservam o eixo central.

O teste isolado em Edge, com os plugins GSAP locais, confirmou:

- 2.642 comparações em ordem inversa e permutada, sem diferenças;
- câmera y/zoom corretos nas 1.321 amostras;
- 35 fronteiras examinadas: maior diferença de ponta de 0,00044733 px e de geometria compartilhada de 0,000273 px, com amostras separadas por 0,0000001 s;
- erro máximo de aderência UV de `2,27 × 10⁻¹³` px;
- ponta inicial e final idêntica e oculta.

**Módulo aprovado para integração e capturas.** Este teste verifica geometria e determinismo; não substitui a auditoria de pixels, o loop com exposição integrada ou a revisão do próximo MP4. A exigência visual de mostrar somente a mão, sem braço, depende do novo ativo e de seu desenho no engine; esse material não foi alterado nem aprovado visualmente nesta revisão do módulo.

**Parecer da fonte final integrada — 5 de outubro de 2026**

A fonte completa `147735630fe5b98d71a55f01069afa617b6401b60c8457b518a0e06e6860631e` foi conferida com a função de assinatura do produtor. A folha de seis quadros, as 28 capturas de transições e os relatórios `motion-check.json`, `remotion-parity.json` e `weighted-loop.json` correspondem a essa mesma assinatura. Os três relatórios apresentam `passed: true`.

A composição centralizada está coerente nas chegadas de Noir, Lumière, Prune, compositor e marca. Os vestidos permanecem inteiros nas fotografias de apresentação; o detalhe mantém o retrato de referência e o recorte do mesmo master. Em 8,70 s, a fotografia continua grande enquanto o título entra. Em 12,70 s, o compositor é reconhecível durante a transferência e o CTA permanece fixo na tela. A passagem de retorno continua lateral, sem fragmentos de botões verdes na margem.

Além das folhas gerais, foram examinados os PNGs completos de 3,30 e 12,30 s. A nova ilustração mostra somente a mão compacta, sem antebraço. A ponta acompanha a fotografia no swipe e permanece sobre o controle verde no toque. A hierarquia central deixa a fotografia, a legenda e o CTA separados, sem a mão ocupar o rosto ou o vestido nesses dois quadros de contato. A observação anterior de ativo ainda não inspecionado fica encerrada para essas capturas.

| Prova da fonte final | Resultado |
| --- | --- |
| Determinismo | 285 comparações numéricas, 7 replays a frio e 48 replays de pixels, sem diferenças |
| Varredura | 1.321 poses, zero flags de salto nos 1.320 quadros |
| Continuidade da mão | 42 fronteiras, maior desvio visível de 0,00044733 px |
| Aderência ao alvo | 113 comparações, desvio máximo de 0 px |
| Primeiro contato / hover | Ambos em 0,35 s, na ponta `(835,1535)` |
| Maior sequência idêntica da análise | 0,8833 s; nenhuma acima de 1 s |
| Paridade Remotion | Seis quadros diretos, zero pixels diferentes |
| Loop direto e com exposição | Extremidades exatas nos dois casos |

O loop integrado usa quatro subframes reais por extremidade, com comparação nas ordens `[0,1319,1319,0]`. Todos os PNGs retornam `484cee701ab77899eb104bab927c353a78e16b2d6e7a094ea034d643dc632d06`, com zero pixels e zero níveis de canal diferentes. Portanto, a pequena divergência anterior na rasterização do chevron do CTA não aparece nesta prova final.

**Fonte integrada aprovada visual e tecnicamente para exportação.** Esta revisão somente leu capturas e relatórios existentes e atualizou o presente documento. Não alterou código, ativos, áudio ou testes e não executou auditoria duplicada. O MP4 dessa assinatura ainda estava em renderização; sua decodificação, integridade e reprodução contínua não são presumidas a partir desta aprovação da fonte nem dos resultados de uma exportação anterior.

**Fechamento técnico do MP4 centralizado — 5 de outubro de 2026**

Foram calculados independentemente os hashes de `out/aurea/aurea-1080x1920-60.mp4` e `docs/aurea/aurea-centered-1080x1920-60.mp4`. Os dois arquivos retornam SHA-256 `67ae42a12ccee00130531fd047acab65dc191223e5403cdab267398656f62113`, igual ao MP4 referenciado pelos relatórios finais. A cópia de entrega é, portanto, idêntica à exportação validada. A fonte continua sendo `147735630fe5b98d71a55f01069afa617b6401b60c8457b518a0e06e6860631e`.

`final-check.json`, `media-metadata.json`, `encoded-scan.json` e `loudness.json` foram lidos nesta revisão. Confirmam 1080 × 1920, 60 fps, 1.320 quadros, duração de 22 s, vídeo H.264 e áudio AAC estéreo a 48 kHz. A varredura dos 1.320 quadros decodificados tem zero flags de salto. As cinco evidências de fonte exigidas pelo fechamento estão válidas e vinculadas à assinatura correta; a continuidade em 42 fronteiras e a aderência em 113 comparações permanecem aprovadas.

A comparação das extremidades comprimidas mede diferença média de **0,10023148** nível por canal e máxima de **4** na análise RGB filtrada de 90 × 160. A média está abaixo da tolerância de 1. Isso não significa igualdade de pixels entre extremidades do H.264: a igualdade exata foi comprovada nos quadros da produção antes da compressão. O áudio decodificado do AAC mede **−14,03 LUFS** e **−1,53 dBTP**, dentro dos limites definidos, e corresponde à trilha de origem usada na exportação.

Foram examinados `encoded-critical.png` e os dez PNGs individuais de 360 px: **198, 222, 372, 522, 547, 582, 738, 762, 1002 e 1242**. As passagens de catálogo preservam o vestido e o gesto da mão compacta. Os quadros 522/547 conservam a fotografia grande antes da redução; 582 mostra a passagem ao recorte do mesmo vestido. O quadro 738 confirma a ponta sobre o CTA central, e 762/1002 mantêm o botão inteiro enquanto o conteúdo transita. O retorno em 1242 apresenta o Noir chegando lateralmente, com desfoque de movimento e resíduos marginais da saída coerentes com essa fase. Não foi observado antebraço, perda do alvo de toque, corte abrupto da mão ou defeito evidente de compressão nos quadros dessa amostra.

**Arquivo codificado e cópia de entrega aprovados tecnicamente no escopo desta revisão.** O fechamento cobre identidade dos arquivos, formato, decodificação, medições de áudio, provas de continuidade e inspeção dos quadros críticos. Trata-se de inspeção amostral de imagens e leitura das evidências automatizadas, não de playback manual integral em velocidade normal. Não se presume, por esse método, a percepção completa de fluidez e ritmo. Nenhum código, ativo, áudio ou teste foi alterado nesta etapa.
