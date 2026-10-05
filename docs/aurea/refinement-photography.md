# AURÉA — revisão da mão, fotografias e consulta

## Veredito da fonte congelada

**PASS para os stills e transições inspecionados; revisão da nova codificação pendente.**

Fonte agregada: `a3ac11952c7718f0835e7b422c3180bd9eda2b15227a54eadf02a88be8ef123e`. Os manifestos atuais de `stills.json` e `transitions.json` registram essa mesma fonte. Nenhum engine ou asset foi alterado durante esta revisão.

## Evidência examinada

- Raster das duas ilustrações originais `touch-hand.svg` e `touch-hand-long.svg`, antes da integração.
- Os seis enquadramentos de `out/aurea/storyboard.png`: Noir, Lumière, Prune, detalhe, compositor WhatsApp e marca.
- Ampliações de Noir em 0,8 s; Prune em 7,2 s; detalhe em 10,7 s; marca em 18,5 s.
- Contato das sete transições de `out/aurea/transitions.png`, com estados anteriores, iniciais, intermediários e posteriores.
- Ampliações de `transition-1-before.png` (3,283 s), `transition-1-middle.png` (3,7 s) e `transition-2-middle.png` (6,2 s).
- Nova inspeção dos PNGs de detalhe e marca após as correções de texto e escala da fotografia final.

## Mão e anatomia

A mão funciona como ilustração de gesto, com volume discreto, sem pretensão de ser uma fotografia. O indicador estendido é único, os três dedos flexionados são distinguíveis e o polegar permanece separado. Unha, pregas e tons de pele ajudam a identificar a mão sem contorno branco, luva ou forma de ponteiro de mouse.

O antebraço prolongado evita o término visível do punho. Nos enquadramentos ampliados, o braço continua para fora da borda inferior ou lateral; não há mão solta ou corte de punho flutuando. No encerramento de 18,5 s, a mão aparece parcialmente pela borda inferior durante sua entrada, de modo compatível com o gesto.

A ilustração é um asset vetorial original, sem biblioteca ou imagem de terceiros. A ponta corresponde à coordenada local `(0,0)`; o renderer usa o deslocamento do viewBox para ancoragem. O desenho não deve ser tratado como mão da modelo fotografada.

## Oclusão durante os gestos

- **Noir, 0,8 s:** o indicador se aproxima da extremidade do botão. A mão não cobre o rosto, as alças, a cintura nem a barra do vestido.
- **Antes da primeira troca, 3,283 s:** mão próxima da borda direita; o contorno principal e a barra de Noir permanecem livres.
- **Primeiro swipe, 3,7 s:** a mão passa à esquerda das pernas e dos sapatos de Lumière. A leitura do comprimento midi não se perde.
- **Segundo swipe, 6,2 s:** mão no espaço claro à esquerda de Prune. A seleção continua identificável e a região do drapeado não é coberta.
- **Seleção/detalhe:** nos contatos examinados, a mão acompanha a miniatura sem ocultar seu rosto ou a referência principal do vestido. O detalhe de cintura permanece disponível para leitura.
- **Encerramento, 18,5 s:** mão abaixo da fotografia e do CTA; o vestido inteiro e o texto principal permanecem desobstruídos.

Não foi encontrada oclusão material da peça nos quadros inspecionados. A revisão de contatos não equivale a uma inspeção visual individual de cada quadro dos swipes.

## Fotografias e enquadramento

Os novos planos ampliam as peças preservando cabeça, silhueta e barra nos enquadramentos de apresentação. Noir continua preto, com brilho e pregas perceptíveis; Lumière mantém pernas e sapatos visíveis, distinguindo seu comprimento midi; Prune mantém ombro assimétrico, drapeado na cintura e saia longa.

O detalhe é um recorte da mesma fotografia de Prune. A miniatura e o compositor também utilizam a mesma peça; não há geração alternativa de cintura, mudança de cor ou troca de vestido durante o percurso. A imagem de marca, ajustada para 688 × 860, mantém a barra e ganha margem em relação ao texto inferior.

A colisão anterior da microcopy do detalhe foi corrigida. “Prune” e “Longo ameixa” agora ocupam a coluna esquerda, em fundo livre, sem avançar sobre a ampliação do tecido. Os PNGs corrigidos foram reinspecionados.

As fotografias continuam sendo ilustrativas de uma marca conceito. A revisão confirma coerência visual interna; não comprova equivalência a produtos reais sem referências comerciais reais.

## Mensagem e clareza comercial

- A seleção apresentada é Prune; nome, fotografia, detalhe e miniatura concordam.
- A consulta permanece: “Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?”
- O compositor mantém o estado “Rascunho”; a fonte registra mensagem completa entre 13,1 e 16,3 s e `sendEnabled: false`.
- O CTA é “Peça pelo WhatsApp”. A mão demonstra a interação; não representa confirmação de compra nem mensagem enviada.
- Não foram identificados número de telefone, QR code, preço, estoque afirmado, grade inventada de tamanhos, envio, resposta da loja ou promessa de entrega.

## Limites e próxima verificação

Este PASS se refere à fonte e aos PNGs desta revisão. O veredito anterior sobre o MP4 com seta não se transfere automaticamente ao novo filme com mão. A nova renderização ainda precisa de inspeção após codificação, especialmente leitura em 360 × 640, brilho do vestido preto, contorno da mão, texto integral da consulta e oclusão durante os gestos. Não há bloqueador visual novo identificado no material inspecionado.

## Revisão final da fonte 536e12db

**PASS — fotografia, gesto e mensagem comercial da fonte congelada `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`.** Não foram identificados impedimentos visuais novos no escopo desta revisão. A aprovação da codificação continua pendente até a entrega do novo MP4.

Reinspecionados os contatos atuais em `docs/aurea/storyboard.png`, `docs/aurea/transitions.png` e `docs/aurea/return-review.png`. Os manifestos de stills e transições em `out/aurea` registram a fonte acima. Também foram abertas as ampliações de `transition-3-after.png` (9,117 s), `transition-4-middle.png` (9,7 s) e `whatsapp.png` (14,5 s), além da leitura do trecho correspondente do engine, sem modificá-lo.

### Detalhe em duas fases

- **8,3–9,3 s:** a peça selecionada permanece em plano de vestido completo, ainda com cabeça, ombro, cintura e barra visíveis. O título anuncia o drapeado enquanto a mão se mantém à direita, sobre fundo livre. Na ampliação de 9,117 s, a mão não encobre a barra ou a silhueta principal.
- **9,3–10,1 s:** o detalhe do tecido entra enquanto a imagem completa diminui para a miniatura de contexto. Na ampliação de 9,7 s, cintura e pregas do recorte correspondem à fotografia completa; a mão já se afasta abaixo das imagens. Não há troca de modelo nem alteração da peça.
- O recorte continua derivado de `assets.prune`, com origem `420,345` e área `355×555` da fotografia selecionada. A miniatura também deriva de `assets.prune`.
- As duas imagens mantêm funções distintas: uma mostra o corte integral; a outra permite ver o drapeado. A sobreposição parcial das janelas não oculta o rosto ou a barra da miniatura nem a região central de interesse do recorte.

### Consulta, encerramento e retorno

A imagem de Prune, o nome e a descrição “Longo / Ameixa” continuam coerentes. O WhatsApp mostra a consulta completa em quatro linhas e o estado “Rascunho”, com margem suficiente antes do CTA. Nenhum número, grade de tamanhos, envio, resposta ou confirmação de pedido foi introduzido.

O contato de retorno confirma que Noir reaparece com vestido completo e leitura do tecido preto. O enquadramento de 21,983 s corresponde visualmente ao início no contato; isso não substitui a auditoria técnica do loop, conduzida separadamente. Os testes de motion/paridade/loop informados pela produção não foram usados como substituto da presente inspeção visual.

Esta seção aprova somente fonte e capturas. A compressão do novo MP4 e sua leitura final em 360 × 640 ainda precisam de fechamento; nenhum engine ou asset foi editado nesta etapa.

## Fechamento da codificação final — aprovado

**PASS FINAL — aprovado em fotografia, anatomia do gesto, integridade das peças e leitura comercial após codificação. Sem impedimento identificado no escopo desta revisão.**

- Fonte congelada: `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`.
- Vídeo: `out/aurea/aurea-1080x1920-60.mp4`.
- SHA-256 do MP4, conferido independentemente no arquivo: `10c52785dd83de589fde5bef0253549d30df8c4027efef9a0717f145587f1e53`.

Inspecionados `encoded-contact.png` e os quadros codificados 21, 198, 222, 372, 522, 547, 582, 738, 786, 977 e 1144, todos em suas versões **360 × 640**. Esses quadros cobrem 0,350; 3,300; 3,700; 6,200; 8,700; 9,117; 9,700; 12,300; 13,100; 16,283 e 19,067 segundos.

### Constatações na codificação

- **Vestido completo antes do detalhe:** em 8,700 e 9,117 s, Prune mantém cabeça, ombro assimétrico, cintura e barra inteiros. A mão se apoia visualmente no espaço à direita e não cobre as partes que identificam a peça.
- **Recorte e miniatura:** em 9,700 s, drapeado, pregas e tonalidade do detalhe correspondem à imagem inteira. A miniatura preserva o vestido completo; não há salto de identidade ou geração alternativa da peça.
- **Gesto:** indicador, polegar e dedos flexionados permanecem reconhecíveis. Antebraço contínuo até a borda, sem punho solto. O borrão nos momentos de swipe é coerente com deslocamento e não foi confundido com deformação anatômica.
- **Oclusão:** nos quadros 198, 222, 372 e 738, a mão não elimina rosto, cintura, comprimento midi ou barra necessários à leitura do produto. No quadro 1144, a ponta toca a região livre à direita do CTA, deixando seu rótulo legível.
- **Preto e tecido:** Noir conserva brilho, pregas e contorno no material codificado. Os três looks continuam visualmente distintos.
- **WhatsApp:** nos quadros 786 e 977, a consulta já está completa e é legível em tamanho de celular: “Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?”. Nome, miniatura e estado “Rascunho” concordam; não há envio ou resposta representados.
- **Informação comercial:** nenhum telefone, QR code, preço, estoque afirmado, tamanho inventado ou promessa de entrega foi observado. A classificação como marca conceito e fotografias ilustrativas permanece necessária e já está documentada no projeto.

Esta é uma inspeção visual amostral dos quadros codificados e do contato, não alegação de leitura manual de todos os 1320 quadros. O PASS técnico informado pela produção foi mantido separado do julgamento visual. Somente este arquivo de revisão foi atualizado nesta etapa; engine e assets permaneceram congelados.
