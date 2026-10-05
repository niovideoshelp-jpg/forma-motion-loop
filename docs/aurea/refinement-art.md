# AURÉA — segunda direção de arte

**Proposta para implementação e nova revisão; não aprovada como resultado ainda.** A aprovação técnica/visual anterior verificava integridade e legibilidade, mas não satisfez a preferência estética do usuário. Esta rodada muda composição e protagonismo, não apenas espaçamentos.

## Decisão

Fazer um editorial de moda vertical: fotografias grandes, nome da peça como título, informação útil curta e toque de smartphone. Retirar o cabeçalho com régua, os slogans repetidos em duas linhas, a sombra de cartão e a legenda duplicada junto à base. Preservar paleta, fontes locais, vestidos e beat map de22 s.

Coordenadas abaixo são **screen space1080 ×1920**, nunca coordenadas do mundo/câmera. Texto em coordenada de centro vertical, alinhado conforme indicado. Área protegida: x90–990/y240–1600. O fundo fotográfico pode sair dessa área; cabeça, corpo, barra e texto não.

## Três aberturas realmente diferentes

| Pose | Fotografia: centro / tamanho / limites | Tipografia |
| --- | --- | --- |
| **Noir, 0–3.3 s** | Centro630/907.5;940 ×1175; x160–1100, y320–1495. Retrato ocupa a direita e o fundo corta apenas20 px na borda da tela. | “Noir”: x90/y390, Bodoni124, esquerda. “Longo preto”: x94/y486, Manrope44. |
| **Lumière, 3.3–5.8 s** | Centro440/927.5;940 ×1175; x−30–910, y340–1515. Retrato ocupa a esquerda, com espaço tipográfico à direita. | “Lumière”: x990/y390, Bodoni116, direita. “Midi champanhe”: x986/y486, Manrope44, direita. |
| **Prune, 5.8–8.3 s** | Centro640/907.5;940 ×1175; x170–1110, y320–1495. Fundo creme e figura à direita; a peça se prepara para virar o detalhe. | “Prune”: x90/y390, Bodoni124, esquerda. “Longo ameixa”: x94/y486, Manrope44. |

AURÉA pequeno em x90/y270, Bodoni64. O centro y240 faria letras escaparem da proteção superior. Não repetir “VESTIDOS DE FESTA” em cada quadro. A foto940 ×1175 tem **70% mais área** que a atual720 ×900; esse aumento precisa ser perceptível no comparativo.

Fotografias sem moldura, raio ou sombra. Não tornar o vestido transparente para fundir a foto: qualquer suavização é restrita ao fundo externo, nunca à modelo. Melhor uma margem editorial limpa que uma vinheta visível. As fotos existentes devem ser medidas: nome/subtítulo ficam na área negativa lateral, com pelo menos32 px até cabelo, ombro e tecido. Se houver conflito, deslocar a foto até40 px ou reduzir apenas o título até108 px; nunca ocultar o corpo.

Não usar a foto1175 px de altura começando em y430: ela terminaria em1605, disputando a barra e o CTA. O ponto mais baixo do vestido deve ficar até y1450.

CTA inicial compacto: caixa x90/y1483,590 ×104, centro385/1535. “Ver coleção”, Manrope44. Nas outras duas peças, evitar um segundo grande botão idêntico: o toque/swipe na fotografia sustenta a sequência. Sem novas placas de nome na base. A expressão visual vem de imagem e composição, não de mais copy.

## Detalhe, consulta e assinatura

**8.3–12.3 s — seleção e detalhe.** Prune permanece o mesmo objeto. Título único “O drapeado.” em x90/y320, Bodoni108; apoio “Prune · longo ameixa” em x94/y414, Manrope40. Detalhe dominante: caixa x390/y500,600 ×938, recorte uniforme do mesmo tecido. Referência de look inteiro: x90/y1000,360 ×450, à frente apenas da borda esquerda do detalhe. Os60 px de sobreposição não podem cobrir o centro do drapeado. Eliminar duas grandes legendas soltas e o título genérico de duas linhas. Usar “Drapeado” pequeno junto à borda superior do detalhe se necessário, sem repetir o título.

**12.3–16.3 s — consulta.** Evitar cartão dentro de cartão. Título “Vamos conversar?” x90/y320, Bodoni96. Foto da peça x90/y480,416 ×520. Nome Prune x590/y610, Bodoni76; “Longo ameixa” x590/y710, Manrope40, podendo ocupar duas linhas. Caixa de rascunho x90/y1050,900 ×365, raio20; texto x130 nas linhas y1110/1170/1230/1290, Manrope44. “Rascunho” em x130/y1360, Manrope38. Sem seta de envio. CTA verde x90/y1468,900 ×112, rótulo44. Rascunho completo desde13.1 s, sem envio ou confirmação.

**16.3–20.3 s — assinatura.** Produto continua importante: foto x300/y410,720 ×900, com modelo/barra inteiras; AURÉA x90/y300, Bodoni150, sem monograma A separado. Copy curta x90/y1370: “Para o seu próximo evento.”, Bodoni64, medir para caber em900 px ou quebrar em duas linhas56 px. CTA verde permanece em x90/y1468,900 ×112. Não transformar esta pose num cartão vazio com marca central.

**20.3–22 s — retorno.** A janela fotográfica e o limite do CTA conduzem de volta ao primeiro look. Reconstituir foto, nome, marca, CTA e estado da mão do frame0. Não reaproveitar o A monolinear anterior apenas para justificar uma transição.

## Mão e fluidez

Eliminar o cursor de seta do macOS. Usar mão vetorial com indicador estendido, sem emoji: aproximadamente104 ×136 px, contorno4 px e preenchimento creme, legível sobre claro/escuro. O ponto animado é a **ponta do dedo**, não o centro do desenho. Mão não encobre rosto, nome, tecido principal ou rascunho.

Toques visíveis nos gestos3.3/8.3/12.3 s: aproximação0.25–0.35 s, contato0.08–0.12 s, saída0.2 s. Uma expansão discreta de20–32 px comunica contato. Sem hover de desktop, clique com seta ou mão pairando vários segundos. A mão sai do quadro entre ações. A consulta não vira mensagem enviada.

Um deslocamento de8 px no quadro original equivale a2.7 px no celular e parece quase parado. Planejar movimento de enquadramento de24–40 px ou escala1–1.035 por pose, limitado pela folga real da cabeça/barra. Não mover foto e palavra como um mesmo bloco. Para trocar de peça, preservar a janela/recorte; evitar três entradas laterais idênticas de páginas inteiras.

## Checklist de aceitação

- Comparativo lado a lado mostra ganho evidente de área fotográfica e retirada do aspecto de catálogo em cartões.
- Look inteiro visível por pelo menos1.2 s em cada peça, incluindo cabeça e barra/calçados dentro da área protegida.
- Texto nenhum toca cabelo, ombro, saia ou fronteira da fotografia; gap mínimo32 px na pose estável.
- Nome, tipo e CTA legíveis em360 ×640, com Bodoni estática500/opsz12 e Manrope500/600.
- Três poses têm ritmos e eixos distintos; a Lumière não é apenas a primeira peça recolorida.
- A ponta do dedo encontra o alvo, o contato é visível e a mão não cobre palavras em nenhum quadro intermediário.
- Detalhe e miniatura pertencem à mesma Prune; sem alteração de anatomia, peça ou material.
- Rascunho completo em13.1 s; nenhum número, QR, preço, estoque afirmado ou envio.
- Novos seis stills e contatos densos antes de render final. O maior tamanho das fotos não autoriza cortar a barra durante aproximações.

Revisor responsável pela proposta: `astra_art_review`. Nenhum engine, fonte ou fotografia editado nesta etapa.


## Revisão dos primeiros seis stills da nova composição

Revisor: `astra_art_review`. Data: 2026-10-05T13:28:46.506Z. Storyboard inspecionado: `5ccd1ee1ae5f4ee20bb855cbdea2b12eec055076fd45b6985d27be3b83991c76`. Inspeção do contato, Noir/Lumière/marca ampliados, e Prune/consulta/marca reduzidos em memória a360 ×640. Não houve edição de engine ou geração de novos quadros.

**Parecer: três looks e consulta passam; aguardar correção conhecida do detalhe. Há um P2 pontual no fechamento.**

- **Noir, Lumière e Prune:** ganho fotográfico visível. Cabeças, barras e calçados permanecem completos; nome/tipo ficam na área negativa e não atravessam rosto, ombro ou tecido. A alternância esquerda/direita e o campo creme de Prune distinguem a série. Não encontrei P1 nesses três quadros.
- **Consulta14.5 s:** nome, tipo/cor, rascunho e CTA legíveis em360 ×640. Foto e mensagem têm áreas próprias; não há texto cobrindo modelo nem cartão externo redundante. Sem P1/P2 de composição nesta pose.
- **P1 conhecido — detalhe10.7 s:** duas microfrases atravessam a borda/crop ampliado. Root já informou substituição por Prune/Longo ameixa em x90/y885 e938. O contato inspecionado ainda mostra a versão anterior; a correção precisa ser conferida no próximo still. Não declaro resolvido a partir apenas do código.
- **P2 — marca18.5 s:** a fotografia termina perto de y1360–1365 e o topo visível de “Para o seu próximo evento.” começa aproximadamente em y1365. Falta respiro; em360 a legenda parece colada à borda da foto. Correção suficiente: foto de marca688 ×860 com centro y900, mantendo sua proporção e a copy em y1397/tamanho64. A base vai para y1330 e cria cerca de35 px de separação visual. Outra geometria serve se preservar pelo menos32 px, sem reduzir o corpo do CTA.
- **Acabamento associado:** a régua y481 cruza a faixa superior da fotografia de marca. Encurtar até screenx260 deixa a regra fora da foto e mantém o motivo gráfico. Não é um novo bloqueante de legibilidade.
- **Mão:** substituição da seta de mouse é visível e o gesto aponta para a interface; nos stills inspecionados ela não cobre rótulos nem vestido. Timing, contato exato da ponta e suavidade devem ser aprovados na revisão de movimento. Não inferir isso de uma imagem estática.

Não há pedido de novo redesign. O caminho agora é fechar o detalhe e o respiro do fechamento, mantendo o ganho de escala e a hierarquia desta rodada. A versão anterior e sua aprovação técnica não são usadas para aprovar automaticamente esta revisão estética.


## Aprovação de arte da revisão editorial — pré-render

**Parecer: aprovado no escopo dos seis stills. Nenhum P1/P2 residual identificado.** Revisor: `astra_art_review`. Data: 2026-10-05T13:31:53.603Z.

Conferi o storyboard atualizado e as imagens de detalhe e marca reduzidas em memória para 360 × 640. Os dois achados da rodada anterior estão resolvidos visualmente:

- **Detalhe, 10.7 s — P1 fechado:** Prune e Longo ameixa agora ficam na coluna esquerda, acima da miniatura. Ambos mantêm separação da fotografia ampliada; as microfrases que cruzavam o recorte desapareceram. Título, crop e referência do look inteiro continuam distintos e legíveis no celular.
- **Marca, 18.5 s — P2 fechado:** a foto menor conserva cabeça e barra, e há aproximadamente 11 px de espaço na prévia 360 entre sua base e a frase (cerca de 33 px na origem). A régua curta termina antes da fotografia. A frase e o CTA não estão colados à imagem.

No contato atualizado, os três looks continuam com fotografia dominante, nome/tipo fora do corpo e barras preservadas. A consulta mantém miniatura, contexto, rascunho e CTA em áreas separadas. Não observei nova colisão ou regressão de hierarquia. O tamanho e o reposicionamento das fotografias produzem uma mudança perceptível em relação à edição anterior; esta aprovação não se limita à ausência de erros técnicos.

### Identificação da versão revisada

- Engine `public/aurea.js`: `7c1d49c6837b04d232d71d4530b42cb8c5c5659fcf0e494a1881d9c3f0e5a36f`.
- Motion `public/aurea-motion.js`: `288a7614bbd686a5a90ce7ace9bba542e49e36dc942374e7ff96e2831c98bd1d`.
- Storyboard: `6dcaa83b55ad8a50843d98db9d4372ad1a9762cf8783d0d7973f8340f34ef9f1`.
- Detalhe: `230ba6eab5334adab94feb4449cb50364aa813d5855220a602b393b40d703bc1`.
- Marca: `6ccc1bb116015ff72d7339c4a20c5bd078847aeb8240432115efc5ddaf3dec4a`.

Aprovação para avançar ao render e à revisão codificada. O gesto da mão, continuidade em movimento, áudio, loop e compressão final exigem suas verificações próprias; não são inferidos destes stills. Nenhum engine, asset ou fotografia foi alterado pelo revisor. Apenas este documento foi atualizado, preservando os pareceres anteriores como histórico.


## Reinspeção do handoff para detalhe e consulta

Revisor: `astra_art_review`. Data: 2026-10-05T13:45:09.414Z. Nova fonte de captura: `75a72499dda1238ab9558f70987f2efdd89022e8dbf4958c93a1ff136194ab14`. Hash do contato: `6a6f78be1f0531a340dab0e973d465b6ef1e53229a3d626ce3d75dfc06d2d3d3`.

Escopo: contato atualizado e ampliação das capturas 8.7,9.117,9.7,12.7 e10.7 s. **Sem P1 observado; um P2 pontual requer fechamento antes de considerar esta fonte inteiramente aprovada.**

- 8.7 s: foto de Prune ainda grande acompanha a chegada do título; a cena mantém produto e contexto, resolvendo a insuficiência de conteúdo apontada pela produção.
- 9.117 s: look inteiro permanece grande antes da redução para miniatura. Cabeça e barra presentes, sem colisão com o título.
- 9.7 s: a foto se reduz enquanto o detalhe ocupa a área dominante. As duas imagens mantêm referência à mesma peça e não deixam vazio no centro da composição.
- 12.7 s: foto selecionada e contexto da consulta continuam visíveis durante o deslocamento. Título e painel estão parcialmente fora do quadro pela translação em andamento, sem colisão entre si. O rascunho ainda vazio precede a sua apresentação completa em13.1 s; não se trata de um quadro vazio de conteúdo.
- 10.7 s: pose final de detalhe mantém a clareza e as correções de legenda aprovadas.

**P2 novo, em8.7 s:** o subtítulo “Prune · longo ameixa” tem parte inferior próxima de y513, enquanto a borda superior da fotografia móvel está perto de y504. A borda cruza a parte inferior do texto, especialmente o descendente de “longo”. Isso é visível na captura ampliada. A headline permanece separada.

Correção mínima recomendada: manter entrada precoce de marca/headline e atrasar apenas a opacidade desse subtítulo até a fotografia liberar sua caixa de texto mais24 px de respiro, aproximadamente8.95–9.1 s, a confirmar pela geometria amostrada. Não é necessário alterar câmera, escala do vestido ou pose estável. Conferir8.7 s e a entrada posterior do subtítulo. Nenhum código ou asset foi alterado pelo revisor.


## Fechamento da revisão de transição — aprovado

**Parecer atualizado: APROVADO para render no escopo de arte e transições inspecionadas. Zero P1/P2 residual.** Revisor: `astra_art_review`. Data: 2026-10-05T13:46:44.818Z.

A captura8.7 s foi novamente inspecionada em1080 ×1920: marca, headline e foto de Prune permanecem presentes; o subtítulo ainda não aparece e já não cruza a borda da imagem. Na captura9.117 s, o subtítulo está integralmente visível, acima da fotografia e separado dela. A alteração de opacidade apenas no subtítulo preservou o ganho de ocupação da cena e não exigiu mudança de foto, pose ou câmera.

P2 da interseção subtítulo/foto: **resolvido**. A avaliação anterior de9.7,10.7 e12.7 s permanece válida porque a correção é restrita à entrada desse subtítulo. Não identifico necessidade de nova edição de arte nesta fonte.

Fonte combinada das capturas: `2f98767f8f5006e758a8bbe1d7da583008028d5bab873fd2d0b9fc1f4dc2a23c`.

Engine verificado contra o manifesto: `c77845b60e44439d613a220b942f03ea58d6abeb1a2dc8613013cb4ec8eed7d3`.

Captura8.7 s: `47dc30879232f397e09f98883fbbeba73b4014e57accf7872a021eac4a476ee6`.

Captura9.117 s: `cf5e8bb26852221b987589855c7ee3d5306dc61afd38eb4463784cdc3f0197bb`.

Este encerramento não substitui a nova auditoria técnica nem a revisão da exportação codificada. Apenas este documento foi atualizado; engine e assets permaneceram intactos. Os achados anteriores ficam preservados como histórico, com o último estado resolvido neste bloco.


## Encerramento pré-render — CTA persistente

**APROVADO. Nenhum P1/P2 residual no escopo de arte inspecionado.** Revisor: `astra_art_review`. Data: 2026-10-05T13:54:46.919Z.

Reinspecionei exclusivamente as capturas atualizadas de12.7,16.7 e20.7 s em1080 ×1920, após mover o CTA verde para uma única camada de tela. Em12.7 e16.7 s há um só botão, inteiro, na mesma posição, com rótulo e ícone legíveis. Os fragmentos de botões nas bordas foram eliminados. O CTA não cruza a fotografia nem cobre a copy durante esses quadros de transição. Em20.7 s o verde já desapareceu; não há resíduo lateral ou duplicação concorrendo com a chegada de Noir e com o traço do retorno.

A geometria dos layouts estáveis permanece a aprovada anteriormente. Não solicito nova edição de concepção ou acabamento a partir deste trio. O motor e o módulo de movimento correspondem aos hashes do manifesto de captura.

Fonte combinada: `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`.

- 12.7 s: `7ab190965678180f148238cebe5fae321d9059d44565a4c40d3f40dd3b027b39`.
- 16.7 s: `6b615b9d577edbb81f2e0a64c1dd764a6f28f9b3b4ea37742ced539d0e68e2f1`.
- 20.7 s: `28c239204d9fe21ddc4fa6d53dfa358c25b8f6d6add5faf352a4cdf6c8c1cd08`.

A revisão é de quadros específicos e implementação da camada única; a suavidade completa do fade e o arquivo codificado continuam sujeitos aos respectivos testes e à revisão final. Nenhum código ou asset foi modificado. Apenas este documento recebeu o encerramento, com histórico preservado.


## Encerramento da revisão codificada — aprovado

**APROVADO no escopo de arte, composição e legibilidade dos quadros extraídos. Nenhum P1/P2 novo identificado.** Revisor: `astra_art_review`. Data: 2026-10-05T14:15:36.233Z.

Inspecionei `encoded-contact.png`, os frames 522, 547, 582, 762, 1002, 1110 e 1242 em 360 × 640, além dos frames 547 e 1110 ampliados e do frame 786 em tamanho móvel. A inspeção cobre 8.7, 9.117, 9.7, 12.7, 13.1, 16.7, 18.5 e 20.7 s e os layouts estáveis reunidos no contato.

- Em 8.7 s, a fotografia continua presente e o subtítulo permanece oculto. Em 9.117 s, o subtítulo completo já está separado da borda superior da foto. A correção da colisão sobreviveu à codificação.
- Em 9.7 s, miniatura e recorte mantêm a identificação da mesma peça; não observei texto invadindo o drapeado.
- Em 12.7 e 16.7 s, o CTA verde é único, inteiro, na mesma posição e legível em 360 × 640. Não reapareceram fragmentos de botões nas bordas.
- Em 13.1 s, a mensagem completa de interesse e disponibilidade, a identificação Prune/Longo/Ameixa e o rótulo Rascunho são legíveis. O estado permanece um rascunho, sem confirmação de envio.
- Em 18.5 s, marca, vestido inteiro, frase inferior e CTA conservam contraste e separação. Não identifiquei perda de desenho das serifas ou compressão que prejudique a leitura nesta amostra.
- Em 20.7 s, o CTA verde já desapareceu e não deixa duplicata ou resíduo. O contato de retorno mantém a recomposição de Noir.

Há desfoque de movimento e entrada parcial de textos durante os deslocamentos, especialmente em 12.7 e 16.7 s. Esses quadros não permitem ler integralmente a copy em trânsito; os estados estáveis e o CTA permanecem claros. Não classifico isso como regressão de codificação ou colisão de layout.

Fonte combinada: `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`.

MP4: `out/aurea/aurea-1080x1920-60.mp4`. SHA-256 verificado no arquivo: `10c52785dd83de589fde5bef0253549d30df8c4027efef9a0717f145587f1e53`. Todos os arquivos do manifesto de fonte foram confrontados com seus hashes, sem divergência.

O relatório técnico `final-check.json` registra aprovação; isso não substitui o julgamento visual acima. Este parecer é uma revisão de amostras codificadas e leitura móvel, não uma declaração de perfeição, uma audição nem uma avaliação do ritmo integral dos 22 segundos. Nenhum engine, asset ou script foi alterado pelo revisor; somente este documento recebeu o encerramento, preservando o histórico.
