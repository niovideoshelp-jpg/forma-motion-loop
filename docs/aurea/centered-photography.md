# AURÉA — revisão da variante somente mão

## Direção atual

O usuário solicitou explicitamente **somente a mão, sem braço**. Essa orientação substitui a preferência anterior por antebraço contínuo até a borda. A integração atual deve usar `public/assets/aurea/touch-hand-only.svg`; os assets anteriores foram preservados, sem alterações.

## Asset original

O novo SVG deriva do desenho original `touch-hand.svg`. Indicador, polegar, três dedos flexionados, unha, pregas e paleta quente foram preservados. A silhueta termina com uma base arredondada imediatamente após a palma, em **y = 312**, sem extensão de punho ou antebraço. A antiga prega de punho foi removida; não há manga, luva, contorno branco ou imagem de cursor.

Trata-se de ilustração vetorial com sombreado discreto, não fotografia nem caractere emoji. Não foram utilizados assets de terceiros. O arquivo tem transparência e não contém sombra externa própria. A proveniência e o SHA-256 estão registrados em `touch-hand-provenance.json`.

## Geometria de integração

- `viewBox`: **`-44 -4 200 320`**.
- Tamanho intrínseco: **200 × 320**.
- Ponta do indicador em coordenadas do desenho: **(0, 0)**.
- Ponta dentro do bitmap intrínseco: **(44, 4)**.
- Após `translate(toqueX, toqueY)`, rotação e escala, desenhar com `drawImage(imagem, -44, -4, 200, 320)`.
- Na rasterização nativa, pixels com alfa maior que zero ocupam x = 5…194 e y = 4…315. Em coordenadas de desenho, isso corresponde aos pixels x = −39…150 e y = 0…311; a borda geométrica inferior está em y = 312.

Não reutilizar o deslocamento `-55,-15` nem as dimensões da variante longa, pois isso deslocaria o contato e alteraria a proporção.

## Revisão raster

**PASS do asset isolado.** A SVG foi rasterizada e inspecionada a 400 × 640. Indicador estendido e dedos restantes são distinguíveis; a palma termina de forma limpa, sem faixa residual de braço, cortes em dedos ou contorno externo de cursor. A proporção foi preservada, sem esticar o desenho.

A imagem de inspeção foi criada no diretório temporário do sistema. Somente o novo SVG e os dois documentos autorizados foram escritos; engine, motion, testes e assets anteriores não foram alterados.

## Limite desta aprovação

A integração da mão isolada, os novos enquadramentos de vestidos e o vídeo codificado ainda não foram inspecionados nesta etapa. Na próxima revisão, verificar que a ponta corresponde ao alvo, que a mão não cobre rosto, drapeado, barra ou mensagem, e que as fotografias e miniaturas continuam usando as mesmas peças. Não transferir automaticamente para a nova composição as aprovações de frames ou MP4 da versão com antebraço.

## Revisão da integração centralizada — fonte congelada

**PASS da fotografia, anatomia ilustrada e mensagem comercial nos stills da fonte `a09ea365486be1090b71de564c79013d3925e2d45854f01208a6970a4473eeb9`.** Esta revisão substitui a pendência de integração descrita acima; a revisão do MP4 desta fonte permanece pendente.

Evidências: `out/aurea/storyboard.png`, `out/aurea/transitions.png`, os frames completos `noir.png`, `whatsapp.png` e `transition-4-middle.png`. Os manifestos dos stills e das transições identificam a mesma fonte congelada. A integração no engine foi conferida por leitura: asset `touch-hand-only.svg` e desenho `drawImage(assets.touchHand, -44, -4, 200, 320)`.

- **Somente mão:** em 0,8 s, nos swipes, na seleção de Prune e nos contatos com os CTAs, a silhueta é a variante curta. A base arredondada encerra a palma; não há segmento residual de braço, manga ou punho comprido. Indicador, polegar e três dedos dobrados permanecem distinguíveis. A escala e a rotação mantêm a proporção original, com presença subordinada ao produto. Em 18,5 s a mão está entrando pelo rodapé, portanto aparece parcialmente por movimento; isso não revela antebraço.
- **Contato e obstrução:** o indicador aponta para o alvo e a mão fica no espaço livre à direita das figuras durante os contatos amostrados. Não cobre rosto, decote, drapeado principal ou barra. No CTA inicial, ocupa a extremidade direita sem impedir a leitura. No frame completo de **9,7 s**, durante a saída de 9,44–10,12 s, a ponta está abaixo do recorte: aproximadamente y1518, contra o limite inferior do recorte em y1403. Há cerca de 115 px de separação; nesse frame não existe cruzamento com o tecido ampliado. Os stills não constituem inspeção de todos os frames desse intervalo.
- **Peças e enquadramento:** Noir, Lumière e Prune têm figura completa, margens laterais e barra preservadas nos estados de apresentação. O preto de Noir continua legível pelas dobras e reflexos. As três silhuetas permanecem distintas. O detalhe de Prune amplia a mesma fotografia; miniatura, foto no compositor e imagem final conservam ombro único, dobra da cintura, cor e barra correspondentes. O recorte deliberado de detalhe não é apresentado como foto de corpo inteiro.
- **WhatsApp:** a foto centralizada do compositor preserva a figura inteira. Nome e descrição aparecem separados da foto e do rascunho. O texto completo permanece legível no still central e nos estados amostrados de entrada/saída: “Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?”. A identificação “Rascunho” continua visível; não há representação de envio, confirmação, resposta, número de telefone, preço ou disponibilidade inventada.

**Impedimentos encontrados: nenhum nos frames e estados examinados.** A revisão visual cobre os seis estados principais e a folha de transições, com inspeção em resolução completa dos pontos críticos indicados. A verificação temporal exaustiva e a leitura após compressão a 360 × 640 dependem do novo MP4; aprovações de vídeos anteriores não se aplicam automaticamente. Nenhum engine, asset ou fonte tipográfica foi alterado nesta revisão.

## Revalidação da fonte final — correção local do botão

**PASS mantido para a fonte `147735630fe5b98d71a55f01069afa617b6401b60c8457b518a0e06e6860631e`.** Reabertos `out/aurea/storyboard.png` e o frame completo `out/aurea/noir.png` após a regeneração; os manifestos de stills e transições identificam esse SHA. A alteração informada pelo responsável foi restrita ao desenho local de `buttonWords`, para estabilizar a rasterização do chevron no loop.

Na evidência reaberta, a mão continua sem braço, com término limpo da palma e contato na extremidade do botão; as fotografias, proporções, recorte do detalhe, miniaturas e rascunho preservam o resultado visual aprovado. Nenhuma regressão de integridade da peça, anatomia ilustrada, obstrução ou leitura foi identificada. Esta é uma revalidação visual da fonte: a revisão do MP4 codificado permanece pendente até a conclusão da exportação e inspeção das imagens extraídas dessa versão.

## Veredito final do MP4 — revisão amostral a 360 × 640

**APROVADO no escopo visual amostral de fotografia, mão isolada e mensagem comercial após codificação.** A pendência de revisão do MP4 mencionada acima está encerrada para o arquivo abaixo.

- Vídeo: `out/aurea/aurea-1080x1920-60.mp4`.
- SHA-256 do vídeo, recalculado do arquivo local: `67ae42a12ccee00130531fd047acab65dc191223e5403cdab267398656f62113`.
- Fonte: `147735630fe5b98d71a55f01069afa617b6401b60c8457b518a0e06e6860631e`, também identificada no `final-check.json`, cujo resultado é `passed: true`.
- Evidências reabertas: `out/aurea/encoded-contact.png` e os onze PNGs de 360 × 640 em `out/aurea/encoded-review/frame-{21,198,222,372,522,547,582,738,786,977,1144}-360.png`.

Nos frames 21/198/222/372, a aproximação e os swipes exibem somente a mão ilustrada. A base da palma é curta e arredondada, sem antebraço. O indicador continua estendido e distinguível; a redução e a codificação preservam a leitura do polegar e dos dedos flexionados. O desfoque durante os swipes reduz temporariamente o detalhe, sem produzir duplicação anatômica identificável ou extensão de braço. Nas poses estáveis e nos contatos 738/1144, a mão tem proporção consistente e o texto dos CTAs continua legível.

Noir, Lumière e Prune permanecem completos e centralizados nos estados estáveis da folha de contato. A leitura do vestido preto resiste à compressão pelas dobras e reflexos. A entrada lateral durante os swipes é transição; não foi confundida com o enquadramento final. Nos frames 522 e 547, Prune ainda aparece de corpo inteiro antes da ampliação. No frame 582 (9,7 s), o recorte mostra as mesmas dobras, cor e ombro único da miniatura; a mão está abaixo dele, sem cobrir o tecido ampliado. O frame 738 confirma a miniatura inteira e a correspondência com o detalhe.

Nos frames 786 (13,1 s) e 977 (16,283 s), o rascunho completo é legível a 360 × 640: “Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?”. Foto, nome Prune, descrição e identificação “Rascunho” permanecem separados e legíveis. Não há braço, mão sobre o texto, envio representado, resposta, número, preço ou confirmação de estoque. A foto do compositor mantém a barra inteira.

**Nenhum impedimento profissional identificado nas amostras examinadas.** Este parecer é uma inspeção visual de onze frames reduzidos e da folha de contato extraídos do MP4; não declara que os 1320 frames foram vistos individualmente, nem substitui a validação temporal automatizada. Engine, assets, scripts e fontes permaneceram congelados; somente este documento recebeu o registro final.
