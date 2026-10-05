# AURÉA — revisão de movimento da mão fotográfica

## Parecer da fonte

**Aprovada a integração da mão fotográfica na fonte `bc439b849f28e66ec4a80bf2d6bf1aa522cffaa5e1fbecccaabf8bcb12ef2dbd`.** A troca preserva os contatos, o percurso e o loop do rig. Não encontrei falha concreta de ancoragem, escala ou sobreposição nas amostras examinadas. Este parecer cobre PNGs da fonte e relatórios correspondentes; não constitui reprodução manual integral nem aprovação do novo MP4 codificado.

Asset examinado: `public/assets/aurea/touch-hand-photo.png`, SHA-256 `128bdc46fa2f2589a46bcf2a7672d76ded1593aa5aaca171b612f056db726eff`. Módulo de movimento preservado: `73030a273e0400f9d68fafdd86034eed1d1fb48c10c94fc5fe8d9b30b8ce81a4`.

## Âncora e pressão

O PNG mede 1024 × 1536. Uma leitura independente do canal alpha confirmou alpha 230 em (338,82); na linha y82 o trecho com alpha ≥128 vai de x330 a x346. Portanto, o ponto escolhido está no centro aproximado do topo visível do indicador, e não numa margem transparente.

O desenho subtrai esse ponto nativo antes da escala e da rotação. Assim, a ponta permanece exatamente na posição produzida por `touchGesture`, inclusive durante a pressão. A distância nominal entre ponta e base é 312 px antes da escala externa de 0,84: 262,08 px em repouso e 254,74 px sob pressão máxima. A contração de 2,8% acontece em torno da ponta, sem empurrar o contato para fora do botão ou da fotografia.

O primeiro contato ocorre em 0,35 s, no ponto (835,1535), limite arredondado direito do CTA inicial. O preenchimento começa após esse contato, conforme a busca numérica: primeiro valor positivo em 0,3500006437 s. Nos contatos verdes, a mão fica abaixo do botão e a ponta alcança sua área direita; a troca do sprite não altera a geometria do controle.

## Inspeção visual amostral

Foram examinados `out/aurea/generated-hand-review.png`, o asset nativo e as dez imagens de revisão a 360 px de largura.

| Frame / tempo | Observação |
| --- | --- |
| 21 / 0,35 s | A ponta encontra o extremo direito do contorno champanhe; a palma permanece abaixo do botão. |
| 48 / 0,80 s | A mão mantém o contato enquanto o preenchimento avança; o texto permanece legível. |
| 198 / 3,30 s | O gesto de Noir toca a região direita da fotografia, sobre o fundo, sem cobrir rosto ou vestido. |
| 222 / 3,70 s | A mão já liberada acompanha a saída para baixo e à esquerda; a amostra é coerente com a liberação do swipe. |
| 348 / 5,80 s | Lumière repete o contato no fundo lateral da fotografia, mantendo a roupa valorizada. |
| 498 / 8,30 s | A seleção de Prune mantém o indicador ligado à mesma fotografia. |
| 558 / 9,30 s | O segundo toque conserva a relação espacial com a foto antes do detalhe. |
| 738 / 12,30 s | A ponta pressiona o CTA verde real; palma abaixo, sem deslocamento visível durante a pressão. |
| 1110 / 18,50 s | A entrada parcial do dedo pelo rodapé é coerente com a trajetória de aproximação. |
| 1144 / 19,0667 s | O último toque mantém a ponta no CTA central e deixa o texto principal legível. |

A textura de pele, unhas e volume da palma tornam a mão fotográfica reconhecível nessa escala. A silhueta mostra a mão e uma base curta de punho, sem antebraço longo. Nas composições examinadas, a sombra permanece discreta e não aparece como retângulo de fundo. A mão ocupa menos atenção que a fotografia e não introduz uma nova colisão relevante com títulos ou vestuário.

## Evidência técnica atual

Os relatórios `motion-check.json`, `remotion-parity.json` e `weighted-loop.json` correspondem à assinatura acima e apresentam aprovação:

- 285 comparações numéricas, sete replays frios e 48 replays Canvas sem divergência.
- 113 comparações de aderência do toque, com desvio máximo de 0 px.
- 42 junções verificadas; maior diferença visível nas amostras laterais: aproximadamente 0,0004473 px, abaixo da tolerância de 0,1 px.
- Seis quadros Remotion comparados com a fonte, todos com zero pixels diferentes.
- Loop simples e loop integrado com quatro subamostras e exposição de 0,42 frame exatamente iguais. As quatro amostras de fronteira compartilham SHA-256 `484cee701ab77899eb104bab927c353a78e16b2d6e7a094ea034d643dc632d06`.
- Varredura atual sem candidatos de salto ou falhas de diagnóstico.

Essas verificações demonstram determinismo e continuidade geométrica da integração. As imagens estáticas permitem avaliar contato e composição nos instantes selecionados; não substituem uma avaliação perceptiva contínua do filme. A inspeção do novo arquivo codificado permanece para a etapa posterior ao render.

## Fechamento do arquivo codificado

**Aprovado no escopo da auditoria técnica e da inspeção visual amostral do MP4 final.** Foi calculado independentemente o SHA-256 de `out/aurea/aurea-1080x1920-60.mp4`: `3250c232073761ef47196478ff0a2f391ef20cf2e58edcb4352b617823e0c5f0`, igual ao registrado no `final-check.json`. A assinatura da fonte continua `bc439b849f28e66ec4a80bf2d6bf1aa522cffaa5e1fbecccaabf8bcb12ef2dbd`.

Foram inspecionados o novo `encoded-critical.png` e os quadros decodificados 21, 198, 222, 372, 522, 547, 582, 738, 762, 786, 977, 1002, 1110, 1144 e 1242, nas versões de revisão de 360 px de largura. A inspeção confirma os seguintes pontos:

- Nos quadros 21, 198, 738 e 1144, a ponta fotográfica permanece no contato esperado: contorno inicial, fotografia e CTA verde. O corpo da mão não cobre o rosto nem a leitura principal do botão.
- Os quadros 222 e 372 mostram a mão liberada abaixo e à esquerda enquanto a próxima fotografia entra. O desfoque é compatível com o deslocamento; não observei contorno retangular do sprite ou fragmento de antebraço.
- Em 547, a foto de Prune permanece inteira e o contato está sobre seu fundo lateral. Em 582, a composição já distingue a miniatura inteira do recorte ampliado do mesmo vestido; a mão se afasta por baixo, deixando o detalhe visível.
- A sequência 738 → 762 → 786 conserva um único CTA verde na mesma posição de tela. A foto e os textos se deslocam até o compositor enquanto a mão sai pelo rodapé. Em 786, a miniatura e o rascunho estão completos e legíveis; 977 conserva essa leitura.
- Em 1110 a mão entra parcialmente pelo rodapé; em 1144 alcança o CTA. Em 1242 já não há mão visível interferindo no retorno à foto Noir.

Os quadros intermediários 762, 1002 e 1242 ainda mostram textos parcialmente fora da tela e faixas estreitas da composição que sai, consequência do percurso horizontal contínuo. São estados transitórios de transferência, não novas colisões introduzidas pelo PNG. As amostras assentadas examinadas não apresentam esses recortes. Não identifiquei uma correção bloqueante de gesto ou de integração da mão.

Os relatórios finais foram lidos após o render, agora correspondentes ao arquivo e à fonte acima. `final-check.json` apresenta aprovação de metadados, loudness, áudio de origem e varredura decodificada. `frame-scan.json` cobre os 1320 quadros de origem, registra zero flags e igualdade exata dos endpoints integrados. `encoded-scan.json` cobre os 1320 quadros decodificados e registra zero flags; a diferença média dos endpoints é 0,1041898148, máxima 4, na análise reduzida a 90 × 160 com Lanczos e filtro gaussiano. Isso está dentro da tolerância média de um nível utilizada pelo verificador; não é uma alegação de igualdade pixel a pixel no H.264. As 42 junções e as 113 comparações de aderência continuam aprovadas na evidência ligada à fonte final.

O fechamento combina inspeção de quadros extraídos e auditoria automatizada de todos os quadros. Não houve reprodução manual contínua integral do MP4 neste parecer, portanto não se afirma uma avaliação perceptiva de cada instante da fluidez ou da sincronização sonora.
