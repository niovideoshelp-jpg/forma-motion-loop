# AURÉA — editorial de festa e consulta pelo WhatsApp

## Contrato criativo

AURÉA é uma marca conceito de vestidos para festas e eventos. Filme vertical de 22 segundos, 1080 × 1920, 60 fps, total de 1320 quadros. O produto aparece desde o primeiro quadro. Fotografia, caimento e gesto de escolha conduzem a composição; a interface entra apenas quando ajuda a consultar a peça.

Produção no projeto Remotion e GSAP existente, com busca determinística. As composições Forma, Órbita e Lume continuam disponíveis. A segunda edição amplia as fotografias para 940 × 1175 px, alterna sua posição e substitui a seta por uma mão vetorial com gestos de smartphone. O roteiro e a trilha de 22 segundos são preservados.

A primeira edição permanece no histórico do commit `d75c044`. O [comparativo visual](docs/aurea/refinement-comparison.png) mostra o ganho de área fotográfica e a nova hierarquia. Os relatórios `refinement-*` documentam a nova revisão; as aprovações anteriores valem somente para os hashes nelas registrados.

Sem telefone, QR, preço, estoque, desconto, disponibilidade afirmada ou promessa de entrega. O WhatsApp é apresentado como rascunho de interesse e consulta. Não animar envio, confirmação de envio, resposta da loja ou sucesso de compra.

## Paleta e tipografia

| Papel | Especificação |
| --- | --- |
| Ameixa / fundo profundo e texto escuro | `#291C30` |
| Champanhe / superfícies e destaque editorial | `#F4DFBF` |
| Creme / fundo claro e texto sobre ameixa | `#FFF8EE` |
| Verde na identificação e CTA WhatsApp | `#176B45`, com rótulo creme |
| Títulos | Bodoni Moda 500: nomes 116–124 px, detalhe 108 px, consulta 96 px, marca 150 px |
| Corpo e tipo da peça | Manrope 500, 40–44 px; rascunho 44 px |
| CTA / informação de ação | Manrope, normal, peso 600, 44–48 px |

Os nomes das peças são os títulos principais. Os slogans ficam secundários na área negativa da fotografia. AURÉA usa versais na assinatura. Bodoni tem tamanho óptico fixo, sem falso negrito ou distorção horizontal; Manrope compõe informações e ações.

Fontes oficiais obtidas do repositório [Google Fonts — Bodoni Moda](https://github.com/google/fonts/tree/main/ofl/bodonimoda) e [Google Fonts — Manrope](https://github.com/google/fonts/tree/main/ofl/manrope), revisão `9710da1eacb3be272583c3224dcb70f9da6eadbb`. Os binários variáveis originais são preservados sem modificação. Uma instância estática derivada de Bodoni foi acrescentada após a revisão de arte para fixar o tamanho óptico e melhorar o controle dos filetes em escala de celular.

| Arquivo local | Eixos validados | Uso |
| --- | --- | --- |
| [BodoniModa-normal-variable.ttf](public/assets/aurea/fonts/BodoniModa-normal-variable.ttf) | `wght` 400–900; `opsz` 6–96 | peso 500 |
| [BodoniModa-500-opsz12.ttf](public/assets/aurea/fonts/BodoniModa-500-opsz12.ttf) | instância estática `wght=500`, `opsz=12` | versão para a revisão de legibilidade; declarar peso 500 |
| [Manrope-normal-variable.ttf](public/assets/aurea/fonts/Manrope-normal-variable.ttf) | `wght` 200–800 | pesos 500 e 600 |

A instância usa fontTools 4.60.1 e interpolação dos eixos originais, sem edição manual de contornos. Família interna: `Aurea Bodoni Text`; o alias de renderização pode continuar `AureaBodoni`. O eixo óptico padrão do original é 11, confirmado no `fvar`; a versão estática remove `fvar`/`gvar`, impedindo seleção óptica automática. Peso OS/2 500 e glifos portugueses usados no filme foram verificados. Ferramenta instalada apenas em pasta temporária, sem alteração de dependências do projeto ou instalação global. Reavaliar largura de texto após a troca.

As licenças SIL OFL 1.1 e metadados originais acompanham cada família. [Proveniência](public/assets/aurea/fonts/provenance.json) registra URLs fixadas à revisão, tamanho em bytes e SHA-256 de todos os arquivos. O carregamento deve terminar antes de medir texto ou desenhar o primeiro quadro; declarar peso variável no FontFace/@font-face e evitar falso negrito por fallback.

## Fotografia e assets

Três fotografias editoriais geradas pelo responsável pela produção, para produto fictício: **Noir** (longo preto), **Lumière** (midi champanhe) e **Prune** (longo ameixa). Não são fotografias de estoque real da loja. Os arquivos e hashes estão na [proveniência](public/assets/aurea/images-provenance.json). As fotografias foram preservadas nesta revisão.

- Mesma modelo adulta, identidade facial e corporal consistente, mesma linguagem de luz, lente aparente e cenário. Poses diferentes, sem parecer três cópias recoloridas.
- Mostrar a barra e a extensão da peça nos planos de look completo. O midi precisa ser reconhecível pelo comprimento, e não somente por uma legenda.
- Vestido preto: luz de recorte suave suficiente para separar do fundo ameixa. Champanhe: fundo mais escuro. Ameixa: fundo champanhe/creme. Não desenhar contornos artificiais sobre tecido ou corpo.
- O detalhe de 9.3–12.3 s deriva de um recorte da mesma fotografia selecionada. Decote, alças, costuras e material permanecem idênticos; não criar outra peça por uma geração separada de detalhe.
- Sem texto, assinatura, logotipo ou interface dentro da imagem gerada. A tipografia é composta pelo renderer.
- Resolver pele, mãos, anatomia, transparências involuntárias, costuras, barra e sombras antes de integrar. Não esconder erro de geração com movimento rápido.
- A imagem pode ocupar toda a tela. Aplicar ampliação uniforme; nunca comprimir a modelo para caber em uma janela.

## Grade, margens e hierarquia

Área protegida principal: **x = 90–990; y = 240–1600**, ou 900 × 1360 px. Essa área protege textos, CTA, rosto e barra no look completo. O fundo fotográfico pode sangrar até as bordas. As margens são uma reserva de composição para Reels/Status, não garantia universal contra toda interface de plataforma.

Cada enquadramento deve oferecer primeiro a peça e depois uma mensagem curta. Não sobrepor texto a estampa, decote ou área de tecido sem contraste estável. Reservar área negativa real da fotografia ou uma superfície opaca desenhada como parte da composição. Evitar véu cinza sobre toda a foto.

Três famílias de enquadramento: look inteiro vertical; detalhe aproximado do tecido; peça selecionada reduzida junto à consulta. Variar a posição entre essas famílias preservando eixo e objeto; não repetir três cartões iguais no centro da tela.

CTA inicial: centro 385/1535, 590 × 104 px. CTA WhatsApp: centro 540/1535, 900 × 112 px, limite inferior 1591. O rascunho termina em 1440, reservando 39 px antes do botão. As fotografias não têm moldura, canto arredondado ou sombra de cartão.

| Pose estável | Foto: centro / tamanho em tela | Texto |
| --- | --- | --- |
| Noir | 630/907,5; 940 × 1175 | nome à esquerda, 90/390; tipo em 94/486 |
| Lumière | 440/927,5; 940 × 1175 | nome à direita, 990/390; tipo em 986/486 |
| Prune | 640/907,5; 940 × 1175 | nome à esquerda, 90/390; tipo em 94/486 |
| Detalhe | crop 568 × 890 à direita; look inteiro 360 × 450 à esquerda | “O drapeado.” em 90/400; legenda na coluna da miniatura |
| Consulta | look inteiro 416 × 520 à esquerda, contexto à direita | rascunho em superfície única, sem cartão externo ou seta de envio |
| Marca | foto 688 × 860, centro 660/900 antes da deriva | AURÉA à esquerda; frase separada da base da foto |

As poses incluem derivas de enquadramento de 16–24 px, cujas chegadas alimentam a transferência seguinte. O fundo das fotos pode sangrar; rosto, peça e barra permanecem preservados. A régua curta sob a assinatura forma a linha que se transforma no contorno do botão inicial.

O CTA WhatsApp é um único controle fixo na tela, visível entre o detalhe, a consulta e a assinatura. As fotografias e o texto viajam atrás dele, mantendo o alvo sob o dedo durante o toque de 12,3 s. Seu desaparecimento é contínuo entre 20,3 e 20,7 s, sem fragmentos de botão nas bordas da passagem.

Prune chega primeiro como retrato de 720 × 900 em 9,1 s. Depois de assentar, encolhe entre 9,3 e 10,1 s enquanto o recorte ocupa a coluna direita. Títulos começam sua entrada 0,16 s após cada gesto; o subtítulo do detalhe espera até 8,95 s para não cruzar a borda da foto. O conteúdo anterior dissolve na metade final da transferência. A mensagem continua completa somente a partir de 13,1 s, com 3,2 s de leitura.

## Beat map aprovado

Intervalos de quadro abaixo usam início inclusivo e fim exclusivo, a 60 fps.

| Tempo | Quadros | Conteúdo | Composição e continuidade |
| --- | --- | --- | --- |
| 0–3.3 s | 0–198 | Noir, longo preto | Foto dominante desde o primeiro quadro; a mão entra em 0,05 s e toca o limite do botão em 0,35 s, iniciando o preenchimento líquido. |
| 3.3–5.8 s | 198–348 | Lumière, midi champanhe | O dedo arrasta a foto anterior e solta; a câmera continua o deslocamento. Foto à esquerda e tipo à direita. |
| 5.8–8.3 s | 348–498 | Prune, longo ameixa | Novo equilíbrio entre modelo e texto, mantendo cenário/luz consistentes. Evitar repetir a composição de Noir. |
| 8.3–9.3 s | 498–558 | Seleção de Prune | Gesto escolhe a peça apresentada; sua imagem continua no quadro e conduz ao detalhe. |
| 9.3–12.3 s | 558–738 | Detalhe da peça selecionada | Recorte da mesma fotografia, com aproximação uniforme e evidência do tecido/caimento. A imagem prepara sua redução a miniatura. |
| 12.3–16.3 s | 738–978 | Compositor de consulta | A foto selecionada vira referência do rascunho. Texto integral legível desde **13.1 s / quadro 786**, permanecendo até a saída. |
| 16.3–20.3 s | 978–1218 | Marca e CTA | Assinatura AURÉA, peça/contexto preservado e botão verde. Pelo menos 2 s de leitura clara do CTA. Nenhum envio é representado. |
| 20.3–22 s | 1218–1320 | Retorno ao início | A superfície/foto conduz de volta a Noir. Reconstituir o primeiro quadro sem fade global, quadro copiado ou salto de exposição. |

## Texto funcional

CTA: **Peça pelo WhatsApp**. Abertura: **Ver coleção**.

Rascunho completo: **Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?**

O rascunho usa quatro linhas, Manrope 44 px e entrelinha 59 px. A miniatura completa, nome e mensagem referem-se à mesma peça Prune. Não há envio animado ou contato funcional.

O compositor é uma demonstração de rascunho. Sem cursor digitando por vários segundos: completar até 13.1 s para garantir tempo útil de leitura. Não inventar remetente, destinatário ou conversa anterior.

## Direção de movimento e revisão

Movimento contínuo em 2D, sem molas, balanço de cartão, giro de telefone ou zoom extremo sem propósito. A mesma foto/superfície liga os estados. A energia vem da alternância de escala e composição e do gesto de escolha; não de partículas, cintilação, gradiente de texto ou elementos decorativos sem relação com as peças.

A mão original tem indicador, três dedos flexionados, polegar, unha e antebraço contínuo. A ponta do indicador é a origem 0/0 do SVG, conservada na rotação e na pressão. Os swipes mantêm uma coordenada UV da fotografia até a soltura e carregam sua velocidade ao iniciar a saída pelo rodapé. A mão fica fora da tela entre gestos e no fechamento do loop. [Proveniência do desenho](docs/aurea/touch-hand-provenance.json).

Critérios de aprovação:

1. Produto reconhecível em até 0.8 s; Noir não fica aguardando uma abertura de logo.
2. Três peças distinguíveis em cor, comprimento e construção. Nenhuma mudança de identidade, vestido ou material entre detalhe e look inteiro.
3. Texto principal e CTA legíveis numa prévia de 360 × 640. Examinar especialmente os filetes da Bodoni e o acento de AURÉA.
4. Nenhuma colisão entre texto, cursor/gesto, rosto, barra, miniatura e botão. Inspecionar quadros intermediários, não somente poses finais.
5. Toda transição mantém uma referência contínua; não há quadro vazio, flash claro, foto sem correspondência, duplicação de peça ou texto que aparece atravessando uma máscara.
6. Rascunho completo a 13.1 s, sem texto menor que o corpo aprovado e sem confirmação de envio.
7. Verde aparece na identificação e ação WhatsApp. Cor e contraste dos vestidos sobrevivem à redução e à compressão do vídeo.
8. Loop fecha na mesma composição e estado de imagem/tipografia do início. Verificar os pixels, além de comparar o primeiro e último contato visual.
9. Antes da exportação, revisar seis stills representativos e janelas densas das trocas 3.3, 5.8, 8.3, 9.3, 12.3, 16.3 e 20.3 s; ampliar a 1080 × 1920 onde houver ambiguidade.

## Reprodução

```sh
npm ci
node scripts/aurea-audio.cjs
node scripts/server.cjs 4187
```

Abrir `http://127.0.0.1:4187/aurea.html`. Fontes e fotografias ilustrativas estão locais; o áudio é reconstruído das fontes Mixkit, cujos arquivos isolados não são distribuídos. Música **Deep Urban — Eugenio Mininni**, retimada a 120 BPM; oito SFX sincronizados pelo pico. Ver [fontes e licenças](docs/aurea/audio-sources.json), [medições](docs/aurea/audio-cues.json) e [revisão de áudio](docs/aurea/audio-review.md).

```sh
node scripts/aurea-produce.cjs --stills
node scripts/aurea-motion-check.cjs --parity
node scripts/aurea-produce.cjs --render
node scripts/aurea-final-check.cjs
```

O exportador usa 4 subframes por quadro, 12 nas transferências e exposição de 0,42 quadro. Texto é avaliado no tempo central. A composição Remotion **Aurea** usa o mesmo motor e os mesmos assets; o exportador Playwright acrescenta a integração temporal.

Revisões da edição atual: [arte](docs/aurea/refinement-art.md), [fotografia e mensagem comercial](docs/aurea/refinement-photography.md), [movimento](docs/aurea/refinement-motion.md) e [áudio e reprodução](docs/aurea/refinement-audio.md). Os relatórios da [primeira edição](https://github.com/niovideoshelp-jpg/forma-motion-loop/tree/d75c044/docs/aurea) preservam seu histórico. Evidências técnicas atuais são registradas em `out/aurea` e `docs/aurea`.

## Entrega e validação

[Filme MP4 — edição touch](docs/aurea/aurea-touch-1080x1920-60.mp4) · [seis stills](docs/aurea/storyboard.png) · [transições](docs/aurea/transitions.png) · [contato extraído do MP4](docs/aurea/encoded-contact.png) · [quadros críticos codificados](docs/aurea/encoded-critical.png).

O formato verificado é **1080 × 1920, 60 fps, 1320 quadros e 22,000 segundos**, H.264 com AAC estéreo a 48 kHz. O WAV foi preservado; a nova codificação foi medida em **−14,03 LUFS / −1,53 dBTP**. A revisão independente do AAC encontrou correlação de 0,999801420 com o WAV e melhor deslocamento de zero amostras na busca de ±48 amostras. Fotografias, recortes, miniatura, gesto e rascunho codificados foram inspecionados também em 360 × 640.

As buscas frias, reversas e aleatórias da nova fonte produziram os mesmos pixels; seis quadros Remotion coincidiram com o motor compartilhado. A aderência do dedo passou em 113 amostras, com erro de ancoragem zero, junto a 42 verificações de continuidade dos gestos. O primeiro e o último quadros da fonte, incluindo os subframes de motion blur, são idênticos. As varreduras da fonte e dos 1320 quadros decodificados não apontaram saltos isolados. A diferença média entre as extremidades H.264 foi **0,121991 nível de canal**, abaixo da tolerância de um nível na análise reduzida.

Evidências: [validação final](docs/aurea/final-check.json), [metadados](docs/aurea/media-metadata.json), [áudio](docs/aurea/loudness.json), [movimento e buscas](docs/aurea/motion-check.json), [paridade Remotion](docs/aurea/remotion-parity.json), [loop com motion blur](docs/aurea/weighted-loop.json), [varredura da fonte](docs/aurea/frame-scan.json) e [varredura decodificada](docs/aurea/encoded-scan.json). As verificações automáticas complementam as quatro revisões; a varredura de saltos usa resolução reduzida e não substitui a inspeção visual das transições.

Assinatura conjunta da fonte e assets da revisão: `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`.

SHA-256 do MP4 da edição touch: `10c52785dd83de589fde5bef0253549d30df8c4027efef9a0717f145587f1e53`. A cópia entregue em `docs/aurea` corresponde byte a byte ao arquivo validado em `out/aurea`. O MP4 da primeira edição permanece preservado com seu nome original.
