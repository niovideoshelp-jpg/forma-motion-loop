**AURÉA — parecer de coreografia e continuidade**

Revisão de 5 de outubro de 2026, feita durante a exportação. A fonte auditada é `a3ac11952c7718f0835e7b422c3180bd9eda2b15227a54eadf02a88be8ef123e`. Os relatórios `motion-check.json`, `remotion-parity.json`, `weighted-loop.json` e `transitions.json`, em `out/aurea`, apontam para essa mesma assinatura. Nenhum código ou ativo foi alterado nesta revisão.

A coreografia está aprovada tecnicamente para exportação. A fotografia continua identificável enquanto muda de função: look, seleção, detalhe e miniatura do rascunho. A câmera avança entre posições do mesmo espaço; a mão entra pelo rodapé, toca uma posição definida e sai mantendo continuidade. Nos swipes, a ponta acompanha o mesmo ponto UV da fotografia de saída. Na soltura, conserva inicialmente a velocidade dessa fotografia e curva em direção ao rodapé. Isso torna o gesto uma causa legível da troca de look.

| Trecho | Ação observada e contrato de movimento |
| --- | --- |
| 0,05–1,52 s | Aproximação pela borda inferior; primeiro contato na borda arredondada do CTA em 0,35 s, em `(680,1535)`. A tinta começa após o contato. A mão pode sair enquanto o preenchimento termina. |
| 3,30 e 5,80 s | Swipes de Noir e Lumière. Contato preso em UV `(0,85; 0,65)` até 3,54 e 6,04 s; a câmera completa cada transferência em 0,8 s. |
| 8,30–9,44 s | Toque em Prune e acompanhamento da redução da fotografia para o detalhe. O recorte ampliado usa o mesmo master. O retrato menor deriva 24 px para cima entre 9,10 e 12,30 s. |
| 12,30–13,10 s | Toque no CTA verde, fotografia levada ao compositor e saída da mão. O rascunho completo permanece disponível entre 13,10 e 16,30 s; envio desativado. |
| 16,30–20,30 s | Miniatura se torna imagem da marca; deriva discreta mantém continuidade. Novo gesto no CTA sem envio de mensagem. |
| 20,30–22 s | Retorno lateral ao Noir; assinatura gráfica se transforma no contorno do CTA. A mão fica oculta no início e no fim do loop. |

As derivas dos retratos têm chegada usada como ponto de partida da transferência seguinte. Não existe reposicionamento de correção na fronteira. O início conserva 50 ms de assentamento, suficientes para as amostras temporais do primeiro quadro também coincidirem com o encerramento.

| Verificação na fonte final | Resultado |
| --- | --- |
| Comparações numéricas em ordens diferentes | 285, sem divergências |
| Replays de pixels | 7 a frio + 48 em ordens diferentes, exatos |
| Poses / varredura | 1.321 poses; 1.320 quadros; zero flags de salto |
| Continuidade da ponta | 40 fronteiras; maior diferença visível de 0,00044733 px, abaixo de 0,1 px |
| Aderência ao ponto UV / CTA | 113 comparações, desvio máximo de 0 px |
| Contato e hover | Ambos em 0,350000 s; primeiro preenchimento positivo em 0,350000644 s |
| Quadros idênticos consecutivos | Maior sequência da miniatura de análise: 0,8833 s; nenhum trecho acima de 1 s |
| Paridade Remotion | Seis quadros diretos, RGBA exato em 1080 × 1920 |
| Loop com exposição integrada | Quatro subframes reais, exposição de 0,42 quadro, amostras envolvendo o limite de 22 s; zero pixels diferentes |

O loop integrado foi medido nas ordens `[0,1319,1319,0]` usando a função de produção, com SHA-256 PNG `aa11302b1df65eba03fbbc80b23101826eeead3c809cf2491213470d14157375` nos quatro resultados. A paridade Remotion refere-se aos quadros diretos; não deve ser confundida com a integração temporal usada no MP4.

A inspeção da folha de 28 transições e dos PNGs completos registra três ressalvas de composição para a revisão em velocidade normal:

- **8,70 s:** a fotografia já encolheu, mas o título e o recorte de detalhe ainda não ocuparam o quadro. Aproximadamente os 750 px superiores ficam vazios; fotografia e mão concentram a atenção na metade inferior. É o intervalo visualmente mais rarefeito.
- **12,70 s:** a miniatura atravessa uma grande área creme antes de o compositor aparecer. Restam faixas do recorte anterior e parte do CTA na margem esquerda. A continuidade espacial existe, mas o quadro isolado parece incompleto.
- **20,70 s:** o Noir já domina a entrada; uma faixa estreita da fotografia anterior e um fragmento do CTA verde permanecem à esquerda. A passagem é coerente como movimento lateral, porém deve ser avaliada pelo ritmo do vídeo, não somente pelo quadro de chegada.

Essas observações são irregularidades transitórias de ocupação do quadro, não descontinuidades detectadas de geometria. Os dados de movimento não comprovam que todo quadro intermediário tem composição equilibrada. A mão tem volume, unha e articulações legíveis, mas seu acabamento continua visivelmente ilustrado; esta revisão não a classifica como fotorrealista.

A liberação técnica da fonte não substitui a revisão do MP4. Permanecem para a etapa após exportação: varredura dos 1.320 quadros decodificados, medição do áudio codificado, inspeção dos quadros comprimidos e reprodução em velocidade normal, especialmente nos três intervalos apontados. Nenhum desses resultados finais é presumido neste parecer.

**Parecer visual final após a correção em duas etapas — 5 de outubro de 2026**

A fonte `75a72499dda1238ab9558f70987f2efdd89022e8dbf4958c93a1ff136194ab14`, conferida com `sourceSignature()` e com a nova folha de transições, substitui a assinatura anterior para esta decisão. Os parágrafos anteriores preservam o diagnóstico que motivou a correção; as duas ressalvas de rarefação abaixo estão encerradas nesta fonte.

Em **8,70 s**, o retrato ainda tem aproximadamente 766 × 957 px, com vestido, mão e título presentes. A fotografia chega grande em 9,10 s, permanece assim até 9,30 s e só então encolhe junto à revelação do recorte, chegando à miniatura em 10,10 s. A deriva vertical de 24 px passa a ocorrer de 10,10 a 12,30 s. Essa ordem conserva a presença do produto durante a transferência e resolve o vazio antes observado. A legenda secundária tangencia a borda superior da fotografia por poucos pixels no quadro intermediário de 8,70 s; continua legível e o afastamento se abre na chegada. Não considero esse encontro transitório um novo bloqueio estético.

Em **12,70 s**, o título, as informações do vestido, a superfície do rascunho e o CTA já entram com o compositor. O enquadramento mostra claramente uma interface chegando, em vez de uma fotografia isolada num campo creme. Os elementos à direita ainda estão parcialmente cortados durante o deslocamento, comportamento coerente com a passagem lateral; o quadro de chegada completa a leitura.

Em **20,70 s**, a faixa estreita da composição anterior e o fragmento de CTA à esquerda continuam visíveis. Aceito essa passagem como continuidade espacial: o Noir domina a entrada e o restante sai pela borda. Não solicito nova alteração desse trecho.

**Aprovação visual da fonte atual para exportação.** A leitura dos relatórios já regenerados confirma `passed: true` em `motion-check.json`, `remotion-parity.json` e `weighted-loop.json`, todos vinculados à assinatura acima. Esta rodada não executou auditoria duplicada nem alterou código ou ativos. Mantêm-se a observação sobre o acabamento ilustrado da mão e a necessidade de validar o MP4 decodificado após a exportação.

**Parecer definitivo da fonte com CTA persistente — 5 de outubro de 2026**

A fonte vigente passa a ser `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`. A nova folha de transições e os três relatórios de movimento, paridade e loop integrado têm exatamente essa assinatura e `passed: true`. As aprovações de versões anteriores ficam como histórico; esta é a referência atual.

A correção do CTA foi conferida tanto nos PNGs completos quanto na ordem de desenho: o botão verde é desenhado depois da restauração da transformação da câmera, em coordenadas de tela. A ponta do dedo e o retângulo visível compartilham, portanto, o mesmo espaço durante o contato em 12,30–12,46 s. O PNG de 12,30 s confirma a ponta sobre o botão, sem deslocamento do alvo junto à fotografia.

Nos quadros intermediários de **12,70 e 16,70 s**, o CTA permanece inteiro e estável enquanto fotografia e textos atravessam o quadro. Desaparecem os fragmentos de botões nas bordas e a ação principal continua legível durante as transições. Em **20,70 s**, o botão verde já saiu; resta somente a faixa da fotografia anterior, coerente com o movimento lateral contínuo. Não há nova rejeição estética nesses três pontos.

**Aprovo a fonte vigente para exportação e revisão do MP4.** A mão, a fotografia e o botão agora têm relação física consistente no toque, além da aderência UV já verificada nos swipes. Nenhum código, ativo ou teste foi modificado ou reexecutado nesta revisão. Permanecem pendentes somente as verificações próprias do arquivo de vídeo final, não presumidas a partir dos PNGs.

**Fechamento técnico do MP4 codificado — 5 de outubro de 2026**

O arquivo `out/aurea/aurea-1080x1920-60.mp4` e a cópia de entrega `docs/aurea/aurea-touch-1080x1920-60.mp4` foram verificados independentemente com SHA-256. Ambos retornam `10c52785dd83de589fde5bef0253549d30df8c4027efef9a0717f145587f1e53`, igual ao arquivo referenciado por `final-check.json` e `encoded-scan.json`. A fonte permanece `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`.

| Evidência final lida | Resultado confirmado |
| --- | --- |
| `final-check.json` | `passed: true`; cinco evidências válidas e vinculadas à fonte correta |
| Metadados do arquivo | 1080 × 1920, 60 fps, 1.320 quadros, 22,000 s, H.264 e AAC estéreo a 48 kHz |
| `frame-scan.json` | 1.320 quadros de produção; zero flags de salto e zero erros de página; integração de 4/12 subframes com exposição de 0,42 quadro |
| Loop da produção antes da compressão | PNGs inicial e final com o mesmo hash, produzidos por amostras reais envolvendo o limite do loop, sem copiar o primeiro quadro |
| `encoded-scan.json` | 1.320 quadros decodificados; zero flags de salto |
| Extremidades do H.264 | Diferença média de 0,12199074 nível por canal e máximo de 5, na análise filtrada de 90 × 160; abaixo da tolerância média de 1 |
| Áudio do AAC final | −14,03 LUFS integrados, −1,53 dBTP, dentro dos limites definidos; áudio de origem corresponde à exportação |
| Continuidade / aderência na fonte | 42 fronteiras, maior desvio visível de 0,00044733 px; 113 comparações de contato, desvio máximo de 0 px |

A diferença residual entre extremidades comprimidas é medida, não ocultada: o H.264 final não é declarado pixel a pixel idêntico. A igualdade exata pertence aos quadros de produção antes da compressão; a comparação do arquivo codificado usa a resolução e a filtragem descritas no relatório.

Foram inspecionados `encoded-critical.png` e os arquivos individuais de 360 px dos quadros **198, 222, 372, 522, 547, 582, 738, 762, 1002 e 1242**. Os quadros 198/222/372 preservam a mão junto às passagens de catálogo; o desfoque direcional aparece nas fases de deslocamento. Os quadros 522/547 mantêm o retrato grande antes da redução, e 582 mostra a transição ao recorte do mesmo vestido. No quadro 738, a ponta está sobre o CTA verde; em 762/1002, esse controle permanece inteiro enquanto o conteúdo se desloca. Em 1242, o retorno ao Noir conserva somente a faixa da fotografia que está saindo, sem fragmento lateral de CTA verde. Não encontrei nova falha de contato, recorte abrupto da mão ou artefato de compressão evidente nessa amostra de revisão.

**Veredito: arquivo codificado e cópia de entrega aprovados tecnicamente dentro do escopo verificado.** A revisão fecha integridade, formato, decodificação, medições de áudio, evidências de continuidade e os quadros críticos selecionados. Não houve reprodução integral em velocidade normal nesta revisão; por isso, a aprovação não presume a percepção contínua de fluidez, ritmo ou conforto visual a partir de stills. O acabamento da mão permanece ilustrado. Nenhuma fonte, trilha ou rotina de teste foi alterada para este fechamento.
