# AURÉA — revisão da mão fotográfica gerada

## Candidato inspecionado

- PNG selecionado, copiado sem alterações de pixels: [touch-hand-photo.png](../../public/assets/aurea/touch-hand-photo.png).
- Dimensões: 1024 × 1536, PNG com transparência.
- SHA-256 recalculado: `128bdc46fa2f2589a46bcf2a7672d76ded1593aa5aaca171b612f056db726eff`.
- Evidência de composição: [hand-alpha-review.png](hand-alpha-review.png), sobre os fundos creme e ameixa.
- Inspeção adicional: composição temporária em memória sobre ambos os fundos, com bitmap de 300 px de altura, deixando a mão visível com aproximadamente 260 px. Nenhuma imagem foi sobrescrita ou retocada; somente este documento foi salvo.

## Anatomia e acabamento

**APROVADO como asset de somente mão, sem braço ou antebraço visível.** O dorso da mão tem cinco dedos reconhecíveis: indicador estendido, três dedos dobrados em alturas sucessivas e polegar independente à esquerda. As articulações e os volumes seguem a pose. Não foram identificados dedos duplicados, fusões entre dedos, unha extra, implante de dedo ou deformação material do contorno.

As duas unhas visíveis, do indicador e do polegar, são compatíveis com a orientação. As unhas dos dedos dobrados ficam ocultas de maneira plausível. A manicure é discreta, sem joia ou adorno. A pele apresenta textura e luz fotográficas; no tamanho final, essa textura se integra sem competir com a silhueta do gesto. O indicador é lido imediatamente como dedo de toque, com ponta e eixo nítidos.

**Observação de limite anatômico:** há uma faixa curta de transição entre o dorso da mão e o punho antes da terminação inferior. Não há prolongamento de antebraço. A borda inferior é limpa e levemente curva, sem manga ou pedestal. Isso atende à orientação prática “somente mão, sem braço”; não seria correto descrevê-la como ausência absoluta de qualquer região anatômica do punho. Se “sem punho” for adotado literalmente como condição separada, esse candidato precisará de nova geração, pois essa pequena faixa está visível. A aprovação não oculta essa diferença.

O responsável confirmou o pedido exato do usuário: “é só pra ter a mão, sem o braço”. Portanto, a faixa curta descrita acima não viola a direção aprovada e não constitui impedimento. A integração prevista usa âncora (338, 82), escala-base `312 / (1429 - 82)` e altura aparente de aproximadamente 262 px; a composição amostral examinada corresponde a essa ordem de grandeza.

## Transparência e escala

O halo aparente no visualizador do PNG original não se reproduz nas composições com alfa sobre creme e ameixa. Nessas evidências, a borda é limpa: não há retângulo de fundo, contorno preto/branco amplo ou halo luminoso perceptível. Na composição adicional em escala de uso, o término, a unha do indicador e a separação dos dedos permanecem reconhecíveis. Nenhum defeito de transparência material foi identificado nos dois fundos examinados.

## Escopo do parecer

**Sem impedimento material de anatomia, contorno ou leitura para integração na animação com a direção atual “mão sem braço”.** A curta base anatômica de punho está explicitamente registrada acima. A avaliação cobre o asset isolado e sua composição estática em fundos representativos; ainda não cobre ancoragem no CTA, oclusão das fotografias, trajetória, rotação em movimento ou compressão do novo MP4. Esses pontos dependem da integração. Engine, SVGs, PNG original e demais assets não foram alterados.
