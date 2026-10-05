# AURÉA — mão fotográfica gerada

Ferramenta: **imagegen integrado**, sem CLI/API alternativo. PNG final preservado integralmente, sem tratamento de pixels externo. Arquivo ativo: `public/assets/aurea/touch-hand-photo.png`, 1024 × 1536, RGBA. SHA-256: `128bdc46fa2f2589a46bcf2a7672d76ded1593aa5aaca171b612f056db726eff`.

A geração inicial foi refinada por uma edição com referência. As duas chamadas pediram `transparent_background: true`. A validação de transparência foi feita em composição real sobre creme e ameixa: os valores RGB sob alpha zero não devem ser interpretados como fundo visível. A textura e a anatomia foram aprovadas em escala nativa e móvel; há apenas uma curta base na dobra do punho, sem antebraço.

## Prompt de geração

```text
Use case: photorealistic-natural. Asset type: a single high-end transparent PNG gesture hand for an elegant fashion-boutique motion graphic. Generate ONE anatomically correct adult woman's RIGHT HAND, back of the hand facing the viewer, the fingernail of the index finger visible. The index finger extends STRAIGHT VERTICALLY UP to touch a smartphone interface. Middle, ring, and little fingers are naturally flexed into the palm, with three distinct believable knuckles. The thumb folds naturally across the left side of the palm below the index. Exactly five digits total, correct joints, slender elegant natural proportions, relaxed believable touch pose. Light-to-medium warm skin, finely resolved natural pores and subtle creases, short clean subtly nude nails, no rings, no bracelet. Photoreal studio product photography, soft warm frontal light from upper left, gentle realistic shading within the hand, sharp clean silhouette, premium editorial quality that matches real evening-dress photographs. Show ONLY the hand. End the image of the hand immediately at the base of the palm / wrist crease with a clean visual crop. NO wrist extension, NO forearm, NO arm, NO sleeve. This is a floating interface gesture asset. Composition: tall portrait canvas, entire hand fully visible, generous genuinely transparent padding on all sides, index fingertip approximately at 35 percent of canvas width and 8 percent of height, palm occupying the lower-right area. Keep the index axis perfectly vertical, camera nearly orthographic without perspective foreshortening. Only one pose and one hand, not a contact sheet. No object or smartphone, no surface, no cast shadow, no text, no watermark, no glow. Background must be actual transparent alpha, not white and not a drawn checkerboard. The hand must have significantly more natural anatomy and skin detail than a vector cursor illustration.
```

## Prompt final de edição

Alvo: a mão produzida pela geração anterior. Pose e aparência preservadas; acabamento de recorte solicitado.

```text
Edit this hand asset. Preserve the exact hand pose, five-digit anatomy, index finger pointing vertically up, natural warm skin, nude short nails, frontal editorial photography and existing proportions. This is a transparent PNG cutout. REMOVE the entire brown diffuse halo and every external shadow or glow from outside the hand. Make the actual skin and nails fully opaque, with alpha 255 throughout the interior. Outside the precise hand silhouette must be alpha 0, genuine transparent empty pixels. Only the thin antialiased edge may have partial alpha. No translucent skin. No dark or brown fringe, no background, no checkerboard painted into the image, no cast shadow. Refine the skin and nails into crisp premium studio photo detail. Show ONLY the hand: terminate cleanly immediately at the base of the palm at the wrist crease. Remove any extended wrist; absolutely no forearm, arm, sleeve or jewelry. Keep generous transparent padding, one hand only and the same vertical index axis. The intended use is a clean floating gesture sprite over an elegant fashion video.
```

## Integração

A ponta medida no PNG está em **338/82**; a base da silhueta dominante em y1429. O canvas mapeia a ponta para `0/0`, aplica escala `312/1347` e usa o movimento existente. A altura visível é aproximadamente 262 px em 1080 × 1920, antes da pequena compressão de pressão. Rotação e escala acontecem ao redor da ponta, para não deslocar o contato. A sombra discreta é desenhada no canvas, não gravada no PNG.

O arquivo nativo tem alpha dominante 253 e nenhum pixel 255; essa característica foi preservada, não “corrigida” por outro editor. O fundo é transparente na [composição](hand-alpha-review.png), sem halo visível. A revisão não pressupõe opacidade 255 nem confunde RGB invisível com cor de fundo.
