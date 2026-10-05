# AURÉA — composição centralizada e mão fotográfica

Filme de uma marca conceito de vestidos de festa: **22 segundos, 1080 × 1920, 60 fps, 1320 quadros**. Remotion, GSAP e um canvas determinístico. A edição atual mantém o botão Ver coleção e o conteúdo centralizados e substitui a mão vetorial por uma fotografia gerada, sem braço.

Fotos, títulos e ações principais compartilham o eixo **x = 540**. O detalhe usa um conjunto de duas imagens equilibrado dentro da mesma área central. A consulta fica em uma coluna; o parágrafo conserva alinhamento à esquerda dentro de seu painel centralizado. As fotografias são as mesmas das edições anteriores.

## Direção e ativos

- Ameixa `#291C30`, champanhe `#F4DFBF`, creme `#FFF8EE`; verde WhatsApp `#176B45`.
- Bodoni Moda 500: nomes 112 px, detalhe 100 px, consulta 96 px, assinatura 150 px.
- Manrope 500–600: informações 40–44 px; mensagem 44 px, entrelinha 59 px; botões 44 px.
- Fontes locais: instância Bodoni `wght=500, opsz=12` e Manrope variável, com licenças SIL OFL 1.1 e metadados preservados. [Proveniência das fontes](public/assets/aurea/fonts/provenance.json).
- Fotografias ilustrativas de uma mesma modelo adulta: Noir longo preto, Lumière midi champanhe e Prune longo ameixa. [Proveniência das imagens](public/assets/aurea/images-provenance.json). Detalhe e miniaturas derivam da mesma fotografia Prune.
- Mão fotográfica [touch-hand-photo.png](public/assets/aurea/touch-hand-photo.png), criada com **imagegen integrado**: indicador, polegar, três dedos flexionados e base curta na dobra do punho, sem antebraço. Pele e unhas naturais, PNG nativo 1024 × 1536 com transparência preservada. A ponta medida em 338/82 é mapeada para 0/0; escala-base 312/1347 e altura aparente ≈262 px. Pressão e rotação acontecem ao redor da ponta. [Proveniência](docs/aurea/touch-hand-provenance.json), [prompts completos](docs/aurea/generated-hand-prompts.md), [comparação da mão](docs/aurea/hand-comparison.png).

AURÉA é uma demonstração: nenhum telefone, QR, preço, estoque, desconto, disponibilidade afirmada ou promessa de entrega. A consulta é um **rascunho**, sem envio, resposta ou confirmação de pedido.

## Enquadramentos

Área protegida de conteúdo: **x = 90–990; y = 240–1600**. Não é uma garantia universal contra toda interface de plataforma.

| Cena | Composição em tela |
| --- | --- |
| Noir, Lumière, Prune | Foto 768 × 960, centro 540/965 antes da deriva vertical. AURÉA 540/275, nome 540/365, tipo 540/442. Cabeça e barra preservadas; nomes acima das fotografias. |
| Abertura | Ver coleção 590 × 104, centro 540/1535. Rótulo e chevron formam um conjunto centralizado. A ponta toca a borda em 835/1535. |
| Chegada ao detalhe | Prune 688 × 860, centro 540/965; chega antes de reduzir à referência. |
| Detalhe | Look 336 × 420, centro 258/975. Recorte de largura 532, centro 724/987,5, com escala uniforme. Conjunto ocupa x90–990 com 32 px entre as imagens. Título 540/385 e subtítulo 540/470; legendas da referência em x258. |
| Consulta | Título 540/390; identificação WhatsApp centralizada em y480. Foto 320 × 400, centro 540/735; Prune 540/990, tipo 540/1044. Painel 900 × 350, centro 540/1265. |
| Assinatura | AURÉA 540/320; descritor 540/430; traço 155 px centrado em y481. Foto 640 × 800, centro 540/925. Frase 540/1397. |
| Ação WhatsApp | Um único botão 900 × 112, centro 540/1535, estável durante detalhe, consulta e assinatura. Grupo de ícone, rótulo e chevron centralizado. |

As derivas são verticais: não tiram as poses estáveis do eixo central. A câmera percorre os cenários lado a lado; o retrato selecionado continua sendo o mesmo objeto. A câmera permanece com y = 0 e zoom = 1 nesta edição, mantendo a grade previsível.

## Beat map

| Tempo | Conteúdo e continuidade |
| --- | --- |
| 0–3,3 s | Noir desde o primeiro quadro. Mão entra em 0,05 s; contato em 0,35 s inicia o preenchimento líquido. |
| 3,3–5,8 s | Swipe e câmera apresentam Lumière. |
| 5,8–8,3 s | Novo swipe apresenta Prune sobre o fundo claro. |
| 8,3–9,3 s | A imagem de Prune chega inteira e centralizada ao detalhe. |
| 9,3–12,3 s | Foto reduz à referência enquanto o recorte do drapeado se abre. |
| 12,3–16,3 s | Toque no WhatsApp; a mesma foto vira a referência central. Rascunho completo em 13,1 s, com 3,2 s de leitura. |
| 16,3–20,3 s | Consulta se recolhe e apresenta a assinatura com a peça e o CTA. |
| 20,3–22 s | Prune sai, Noir retorna e o traço forma o contorno central do botão inicial. |

Transições de 0,8 s em `cubic-bezier(.45,0,.15,1)`, sem cortes secos, springs, partículas ou glows. Textos entram e saem durante as passagens, sem se transformar em fotografias. A ponta mantém a coordenada UV do alvo até a soltura.

Rascunho: **Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?**

## Áudio e reprodução

A trilha preservada é **Deep Urban — Eugenio Mininni**, Mixkit, retimada a 120 BPM. Abertura filtrada; entrada musical em 3,3 s. Oito SFX com picos em 0,35 / 3,3 / 5,8 / 8,3 / 9,3 / 12,3 / 16,3 / 20,3 s. [Fontes e licenças](docs/aurea/audio-sources.json), [medições dos efeitos](docs/aurea/audio-cues.json).

O WAV permanece com SHA-256 `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`. Fontes musicais e SFX isolados não são distribuídos.

```sh
npm ci
node scripts/aurea-audio.cjs
node scripts/server.cjs 4187
node scripts/aurea-produce.cjs --stills
node scripts/aurea-produce.cjs --transitions
node scripts/aurea-motion-check.cjs --parity
node scripts/aurea-produce.cjs --render
node scripts/aurea-final-check.cjs
```

Preview: `http://127.0.0.1:4187/aurea.html?edition=photo-hand`. A composição Remotion **Aurea** usa o mesmo motor e os mesmos ativos. Exportador Playwright com 4 subframes, 12 nas transferências rápidas e exposição de 0,42 quadro; texto avaliado no tempo central.

## Revisão e entrega

[MP4 — mão fotográfica](docs/aurea/aurea-photohand-1080x1920-60.mp4) · [seis stills](docs/aurea/storyboard.png) · [transições](docs/aurea/transitions.png) · [quadros codificados](docs/aurea/encoded-contact.png) · [quadros críticos](docs/aurea/encoded-critical.png).

Quatro revisões: [arte](docs/aurea/generated-hand-art.md), [fotografia e gesto](docs/aurea/generated-hand-photography.md), [movimento](docs/aurea/generated-hand-motion.md), [áudio](docs/aurea/generated-hand-audio.md). As edições anteriores permanecem no histórico: [primeira AURÉA](https://github.com/niovideoshelp-jpg/forma-motion-loop/tree/d75c044/docs/aurea), [edição touch](https://github.com/niovideoshelp-jpg/forma-motion-loop/tree/a8b8536/docs/aurea) e [mão vetorial centralizada](https://github.com/niovideoshelp-jpg/forma-motion-loop/tree/ced1779/docs/aurea).

Fonte congelada: `bc439b849f28e66ec4a80bf2d6bf1aa522cffaa5e1fbecccaabf8bcb12ef2dbd`. Buscas frias, reversas e aleatórias passaram; seis quadros Remotion coincidiram com o motor; 113 amostras de aderência passaram. Quadros extremos da fonte são idênticos, também com motion blur. A varredura da fonte não apontou saltos isolados.

**Exportação validada:** H.264, 1080 × 1920, 60 fps, 1320 quadros, 22,000 s; AAC estéreo a 48 kHz. Áudio medido em −14,03 LUFS / −1,53 dBTP. A nova verificação independente encontrou correlação de 0,999801420 com o WAV e deslocamento zero na busca de ±48 amostras; as oito janelas de eventos passaram.

A varredura dos 1320 quadros decodificados não apontou saltos isolados. A diferença média entre os quadros extremos H.264 foi 0,104190 nível de canal, abaixo da tolerância de um nível. A fonte e seu loop com motion blur são exatos.

SHA-256 do MP4: `3250c232073761ef47196478ff0a2f391ef20cf2e58edcb4352b617823e0c5f0`, 5.806.241 bytes. A cópia entregue em `docs/aurea/aurea-photohand-1080x1920-60.mp4` corresponde byte a byte ao arquivo validado em `out/aurea`. Os MP4s anteriores permanecem preservados.

Evidências técnicas: [validação final](docs/aurea/final-check.json), [metadados](docs/aurea/media-metadata.json), [áudio](docs/aurea/loudness.json), [movimento](docs/aurea/motion-check.json), [paridade Remotion](docs/aurea/remotion-parity.json), [loop com motion blur](docs/aurea/weighted-loop.json), [fonte](docs/aurea/frame-scan.json), [MP4 decodificado](docs/aurea/encoded-scan.json). Verificar sempre a assinatura da fonte e o hash do vídeo. A varredura automática usa resolução reduzida e complementa a inspeção visual amostral; não representa leitura manual integral de todos os quadros.
