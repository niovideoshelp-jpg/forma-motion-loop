# AURÉA — editorial de festa e consulta pelo WhatsApp

## Contrato criativo

AURÉA é uma marca conceito de vestidos para festas e eventos. Filme vertical de 22 segundos, 1080 × 1920, 60 fps, total de 1320 quadros. O produto aparece desde o primeiro quadro. Fotografia, caimento e gesto de escolha conduzem a composição; a interface entra apenas quando ajuda a consultar a peça.

Produção no projeto Remotion e GSAP existente, com busca determinística. As composições Forma, Órbita e Lume continuam disponíveis. Este documento registra a direção, reprodução e evidências da edição AURÉA.

Sem telefone, QR, preço, estoque, desconto, disponibilidade afirmada ou promessa de entrega. O WhatsApp é apresentado como rascunho de interesse e consulta. Não animar envio, confirmação de envio, resposta da loja ou sucesso de compra.

## Paleta e tipografia

| Papel | Especificação |
| --- | --- |
| Ameixa / fundo profundo e texto escuro | `#291C30` |
| Champanhe / superfícies e destaque editorial | `#F4DFBF` |
| Creme / fundo claro e texto sobre ameixa | `#FFF8EE` |
| Verde exclusivamente no CTA WhatsApp | `#176B45`, com rótulo creme; verificar contraste no quadro final |
| Títulos | Bodoni Moda, normal, peso 500, 96–124 px, entrelinha 1.02–1.1 |
| Corpo e nomes de peça | Manrope, normal, peso 500, 44 px, entrelinha 1.3–1.4 |
| CTA / informação de ação | Manrope, normal, peso 600, 44–48 px |

Títulos em frase, de preferência até seis palavras e duas linhas. AURÉA pode usar versais como assinatura curta. Não usar Bodoni para corpo pequeno. Não esticar tipografia horizontalmente. O tamanho óptico de Bodoni deve permanecer fixo por uso; escolher após leitura em escala de celular, sem animar o eixo para engrossar/afinar os glifos.

Fontes oficiais obtidas do repositório [Google Fonts — Bodoni Moda](https://github.com/google/fonts/tree/main/ofl/bodonimoda) e [Google Fonts — Manrope](https://github.com/google/fonts/tree/main/ofl/manrope), revisão `9710da1eacb3be272583c3224dcb70f9da6eadbb`. Os binários variáveis originais são preservados sem modificação. Uma instância estática derivada de Bodoni foi acrescentada após a revisão de arte para fixar o tamanho óptico e melhorar o controle dos filetes em escala de celular.

| Arquivo local | Eixos validados | Uso |
| --- | --- | --- |
| [BodoniModa-normal-variable.ttf](public/assets/aurea/fonts/BodoniModa-normal-variable.ttf) | `wght` 400–900; `opsz` 6–96 | peso 500 |
| [BodoniModa-500-opsz12.ttf](public/assets/aurea/fonts/BodoniModa-500-opsz12.ttf) | instância estática `wght=500`, `opsz=12` | versão para a revisão de legibilidade; declarar peso 500 |
| [Manrope-normal-variable.ttf](public/assets/aurea/fonts/Manrope-normal-variable.ttf) | `wght` 200–800 | pesos 500 e 600 |

A instância usa fontTools 4.60.1 e interpolação dos eixos originais, sem edição manual de contornos. Família interna: `Aurea Bodoni Text`; o alias de renderização pode continuar `AureaBodoni`. O eixo óptico padrão do original é 11, confirmado no `fvar`; a versão estática remove `fvar`/`gvar`, impedindo seleção óptica automática. Peso OS/2 500 e glifos portugueses usados no filme foram verificados. Ferramenta instalada apenas em pasta temporária, sem alteração de dependências do projeto ou instalação global. Reavaliar largura de texto após a troca.

As licenças SIL OFL 1.1 e metadados originais acompanham cada família. [Proveniência](public/assets/aurea/fonts/provenance.json) registra URLs fixadas à revisão, tamanho em bytes e SHA-256 de todos os arquivos. O carregamento deve terminar antes de medir texto ou desenhar o primeiro quadro; declarar peso variável no FontFace/@font-face e evitar falso negrito por fallback.

## Fotografia e assets

Três fotografias editoriais geradas pelo responsável pela produção, para produto fictício: **Noir** (longo preto), **Lumière** (midi champanhe) e **Prune** (longo ameixa). Não são fotografias de estoque real da loja. Registrar os arquivos finais e sua origem quando forem entregues.

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

CTA final: centro x = 540 / y = 1530, largura = 880, altura = 110, limite inferior y = 1585. O cartão de consulta termina em y = 1440, reservando 35 px antes do botão. As fotos de Lumière e Prune deslocam-se para lados diferentes da grade; os títulos têm respiro próprio acima da fotografia.

## Beat map aprovado

Intervalos de quadro abaixo usam início inclusivo e fim exclusivo, a 60 fps.

| Tempo | Quadros | Conteúdo | Composição e continuidade |
| --- | --- | --- | --- |
| 0–3.3 s | 0–198 | Noir, longo preto | Peça legível desde o primeiro quadro; movimento já nos primeiros 0.2 s. Foto dominante com assinatura AURÉA e título curto. |
| 3.3–5.8 s | 198–348 | Lumière, midi champanhe | Passagem motivada pela janela fotográfica. Preservar um limite/objeto durante a troca. Comprimento midi claramente visível. |
| 5.8–8.3 s | 348–498 | Prune, longo ameixa | Novo equilíbrio entre modelo e texto, mantendo cenário/luz consistentes. Evitar repetir a composição de Noir. |
| 8.3–9.3 s | 498–558 | Seleção de Prune | Gesto escolhe a peça apresentada; sua imagem continua no quadro e conduz ao detalhe. |
| 9.3–12.3 s | 558–738 | Detalhe da peça selecionada | Recorte da mesma fotografia, com aproximação uniforme e evidência do tecido/caimento. A imagem prepara sua redução a miniatura. |
| 12.3–16.3 s | 738–978 | Compositor de consulta | A foto selecionada vira referência do rascunho. Texto integral legível desde **13.1 s / quadro 786**, permanecendo até a saída. |
| 16.3–20.3 s | 978–1218 | Marca e CTA | Assinatura AURÉA, peça/contexto preservado e botão verde. Pelo menos 2 s de leitura clara do CTA. Nenhum envio é representado. |
| 20.3–22 s | 1218–1320 | Retorno ao início | A superfície/foto conduz de volta a Noir. Reconstituir o primeiro quadro sem fade global, quadro copiado ou salto de exposição. |

## Texto funcional

CTA: **Peça pelo WhatsApp**. Abertura: **Ver coleção**.

Rascunho completo: **Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?**

O rascunho usa quatro linhas, Manrope 44 px e entrelinha 61 px. A miniatura completa, nome e mensagem referem-se à mesma peça Prune. Não há envio animado ou contato funcional.

O compositor é uma demonstração de rascunho. Sem cursor digitando por vários segundos: completar até 13.1 s para garantir tempo útil de leitura. Não inventar remetente, destinatário ou conversa anterior.

## Direção de movimento e revisão

Movimento contínuo em 2D, sem molas, balanço de cartão, giro de telefone ou zoom extremo sem propósito. A mesma foto/superfície liga os estados. A energia vem da alternância de escala e composição e do gesto de escolha; não de partículas, cintilação, gradiente de texto ou elementos decorativos sem relação com as peças.

Critérios de aprovação:

1. Produto reconhecível em até 0.8 s; Noir não fica aguardando uma abertura de logo.
2. Três peças distinguíveis em cor, comprimento e construção. Nenhuma mudança de identidade, vestido ou material entre detalhe e look inteiro.
3. Texto principal e CTA legíveis numa prévia de 360 × 640. Examinar especialmente os filetes da Bodoni e o acento de AURÉA.
4. Nenhuma colisão entre texto, cursor/gesto, rosto, barra, miniatura e botão. Inspecionar quadros intermediários, não somente poses finais.
5. Toda transição mantém uma referência contínua; não há quadro vazio, flash claro, foto sem correspondência, duplicação de peça ou texto que aparece atravessando uma máscara.
6. Rascunho completo a 13.1 s, sem texto menor que o corpo aprovado e sem confirmação de envio.
7. Verde aparece exclusivamente na ação WhatsApp. Cor e contraste dos vestidos sobrevivem à redução e à compressão do vídeo.
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
node scripts/aurea-motion-check.cjs
node scripts/aurea-motion-check.cjs --parity
node scripts/aurea-produce.cjs --render
node scripts/aurea-final-check.cjs
```

O exportador usa 4 subframes por quadro, 12 nas transferências e exposição de 0,42 quadro. Texto é avaliado no tempo central. A composição Remotion **Aurea** usa o mesmo motor e os mesmos assets; o exportador Playwright acrescenta a integração temporal.

Revisões humanas: [arte](docs/aurea/art-review.md), [fotografia](docs/aurea/photography-review.md), [mensagem comercial](docs/aurea/commercial-review.json). Evidências técnicas são registradas em `out/aurea` e `docs/aurea`.

## Entrega e validação final

[Filme MP4](docs/aurea/aurea-1080x1920-60.mp4) · [seis stills](docs/aurea/storyboard.png) · [transições](docs/aurea/transitions.png) · [contato extraído do MP4](docs/aurea/encoded-contact.png).

O arquivo final contém **1080 × 1920, 60 fps, 1320 quadros e 22,000 segundos**, H.264 com AAC estéreo a 48 kHz. A medição do AAC decodificado resultou em **−14,03 LUFS e −1,53 dBTP**, dentro das metas. Os oito eventos preservaram a posição temporal após a codificação. Fotografias, recortes, miniatura e rascunho foram inspecionados também em 360 × 640.

As varreduras dos 1320 quadros da fonte e do MP4 não apontaram saltos isolados. Buscas frias, reversas e aleatórias produziram os mesmos pixels; seis quadros Remotion coincidiram com o motor compartilhado. Dezessete junções do ponteiro passaram pela tolerância de 0,1 px. O primeiro e o último quadros da fonte, incluindo os subframes de motion blur, são idênticos. No MP4, a diferença média entre extremidades foi 0,128634 nível de canal na análise reduzida, dentro da tolerância de um nível reservada à compressão H.264.

Evidências: [validação final](docs/aurea/final-check.json), [metadados](docs/aurea/media-metadata.json), [áudio](docs/aurea/loudness.json), [movimento e buscas](docs/aurea/motion-check.json), [paridade Remotion](docs/aurea/remotion-parity.json), [loop com motion blur](docs/aurea/weighted-loop.json), [varredura da fonte](docs/aurea/frame-scan.json) e [varredura decodificada](docs/aurea/encoded-scan.json). As verificações automáticas complementam as quatro revisões; a varredura de saltos usa resolução reduzida e não substitui a inspeção visual das transições.

SHA-256 do MP4: `6af92781a033615a523dff3b3686d14beab2ea662def588e621048d308555aa3`. Assinatura conjunta da fonte e assets: `743164e5d35bb07ea40b94be3278906cedf687e6eaab9f9fc65f13a70724c6d7`.
