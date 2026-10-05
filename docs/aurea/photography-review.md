# AUREA — revisão fotográfica e comercial

## Escopo e resultado

As três imagens PNG geradas foram abertas individualmente e inspecionadas em resolução de visualização. **Aprovadas para a marca conceitual AUREA, como imagens ilustrativas.** Não foi identificada deformação anatômica material, membro adicional ou inconsistência evidente de construção do vestido.

Esta aprovação avalia a coerência das imagens, não a existência dos produtos nem sua fidelidade a peças reais: nenhuma fotografia de referência de um produto real foi fornecida nesta revisão. O material deve manter a indicação de conceito e imagens ilustrativas.

## Noir

- Fonte: `exec-3885122b-918b-4d96-ae58-e9def66db0ad.png`.
- Vestido preto longo, alças finas, decote reto, cintura marcada e saia ampla até o chão.
- Brilho e pregas separam o tecido preto do fundo ameixa; a cintura e a largura da saia são perceptíveis.
- Cabeça, braços, mãos e barra do vestido estão presentes. Pés ocultos pelo comprimento são coerentes com a silhueta.
- Cuidado no enquadramento: preservar largura da saia e barra em pelo menos uma aparição. Não escurecer mais a fotografia nem sobrepor texto escuro à saia.
- Resultado: aprovado para uso ilustrativo.

## Lumière

- Fonte: `exec-cdc9a58f-4281-4895-a0be-84908b9b6fe6.png`.
- Vestido champagne midi, mangas curtas, decote drapeado, cintura marcada e saia aberta.
- Comprimento, mangas e tonalidade o distinguem dos dois modelos longos. Pernas e sapatos visíveis tornam a diferença de comprimento clara.
- Não foi encontrado defeito material em braços, mãos, pernas, sapatos ou articulação da pose. Costuras e pregas são visualmente coerentes.
- Cuidado no enquadramento: não cortar a região abaixo do joelho na apresentação principal, pois eliminaria a principal diferença entre os modelos.
- Resultado: aprovado para uso ilustrativo.

## Prune

- Fonte: `exec-177bc8eb-bb78-4bdd-bd35-64dc4bebc741.png`.
- Vestido ameixa longo, de um ombro só, com drapeado diagonal e franzido lateral na cintura.
- O fundo claro separa bem o contorno escuro. O ombro assimétrico e o franzido continuam identificáveis em redução.
- Braços, mãos e proporções visíveis são coerentes. A barra longa cobre os pés sem sugerir ausência anatômica.
- Cuidado no enquadramento: preservar o ombro e o franzido durante a escolha; manter a mesma imagem ao chegar à mensagem de interesse.
- Resultado: aprovado para uso ilustrativo.

## Coerência da série

Rosto, penteado e tratamento de luz apresentam continuidade visual suficiente para uma mesma série editorial. Não se faz identificação de pessoa real. Noir e Lumière compartilham fundo ameixa; Prune usa fundo claro e pode funcionar como a escolha destacada. A mudança de fundo não deve ser apresentada como mudança de cor do mesmo vestido: são três modelos diferentes.

## Critérios comerciais para a revisão do filme

- Marca conceitual AUREA e fotos ilustrativas explicitamente identificadas no material de entrega.
- Nenhum telefone, QR code, preço, estoque, prazo de entrega ou grade de tamanhos inventados.
- Seleção visual deve chegar a Prune antes de compor a mensagem.
- Texto esperado, completo entre 13,1 e 16,3 segundos: “Olá! Tenho interesse no vestido Prune. Quais tamanhos estão disponíveis?”
- A mensagem permanece rascunho: sem bolha enviada, confirmação, resposta fictícia ou ação externa.
- Texto da mensagem precisa caber integralmente e continuar legível no enquadramento de celular.
- A imagem de Prune e seu nome devem permanecer coerentes em seleção, detalhe e rascunho.

## Revisão do engine e dos seis stills

**Aprovado no escopo de fotografia e clareza comercial, sem impedimento material identificado.** Revisados `public/aurea.js`, `public/aurea.html`, `AUREA.md`, a proveniência das imagens e os seis stills de `out/aurea/storyboard.png`: Noir (0,8 s), Lumière (4,7 s), Prune (7,2 s), detalhe (10,7 s), WhatsApp (14,5 s) e marca (18,5 s). Detalhe e WhatsApp também foram ampliados em suas imagens individuais de 1080 × 1920.

- Os três looks mantêm cabeça, comprimento da peça e barra visíveis. O midi continua distinguível; Noir conserva leitura de pregas e contorno no fundo escuro.
- O detalhe usa `assets.prune` e um recorte da própria fotografia, sem nova geração nem troca de vestido. A aproximação evidencia exatamente o drapeado da cintura mostrado no look completo.
- Miniatura, nome Prune, descrição “Longo / Ameixa” e texto da consulta são coerentes.
- O rascunho em quatro linhas cabe integralmente no still de 14,5 s e é legível no contato reduzido. A lógica do engine termina sua entrada em 13,1 s e só começa a retirada após 16,3 s. Isso é verificação de fonte e still representativo; não substitui auditoria de todos os quadros da janela.
- Não foram encontrados telefone, QR, preço, estoque afirmado, opções de tamanho inventadas, confirmação de envio ou resposta fictícia. O diagnóstico expõe `sendEnabled: false`; o HTML de preview não vincula uma conversa externa.
- O preview declara “Marca conceito · Fotografias ilustrativas”. A documentação descreve explicitamente os produtos fictícios.
- “Cetim” deve ser entendido como descrição da peça ilustrativa, não especificação comprovada de um produto real.

### Acabamentos não impeditivos enviados à produção

1. No compositor, a legenda “Rascunho” e a seta ficam próximas do limite inferior da caixa: centro em y = 1410, caixa até y = 1427,5. Subir ambos cerca de 16 px melhora a margem visual; o texto principal da consulta já cabe.
2. `AUREA.md` ainda registra um CTA “Consultar pelo WhatsApp” e uma consulta genérica, enquanto o engine usa “Peça pelo WhatsApp” e a consulta específica de Prune. Alinhar o documento ao texto final autorizado.

A posição de cursor sobre a legenda do detalhe no still anterior não foi tratada como falha atual, pois a produção informou um microajuste posterior. Apenas os dois arquivos desta revisão foram modificados.

## Aprovação final para renderização

**PASS — fotografia e mensagem comercial aprovadas.** Os seis stills atualizados foram revistos, com nova ampliação do compositor de WhatsApp em 1080 × 1920. Não há impedimento à renderização integral no escopo desta revisão.

- Engine revisado: SHA-256 `d5a368fe979c908f2e734894af82634b7fe62aed098cad44ab9bc4a1a6ac7cd1`.
- Fingerprint agregado do manifesto dos stills: `142f11e8591e13e6f525344804cfd75873c6cb4719e1f251ebd40371d7c1e6a3`. O hash do engine no manifesto coincide com o arquivo inspecionado.
- A miniatura Prune, agora em 288 × 360 px, mantém rosto, ombro assimétrico, corpo, saia e barra completos. Não invade a régua sob “WhatsApp”. A pequena deriva de posição preserva sua separação visual no still.
- O rótulo “Rascunho” e a seta agora estão em y = 1384, com caixa até y = 1420: a margem inferior foi corrigida. Mensagem e CTA permanecem claros e completos.
- As novas chamadas editoriais têm espaço sobre as fotografias. Os três comprimentos/silhuetas seguem distinguíveis; Noir continua preto e legível.
- Não restam observações visuais impeditivas ou ajustes fotográficos solicitados.
- O responsável pela produção informou que alinhará `AUREA.md` ao CTA e ao rascunho finais. Essa manutenção documental permanece com ele; os arquivos de engine e assets não foram alterados por esta revisão.

## Veredito sobre o MP4 codificado

**PASS — aprovado no escopo fotográfico e comercial, sem impedimento à publicação.** Foi inspecionado `out/aurea/encoded-contact.png`. Também foram extraídos diretamente do MP4 os quadros em 0,8; 10,7; 13,1; 14,5; 16,283333 e 18,5 segundos e examinados em **360 × 640**, para leitura efetiva em tamanho de celular.

- SHA-256 do MP4, conferido independentemente: `6af92781a033615a523dff3b3686d14beab2ea662def588e621048d308555aa3`.
- Fonte agregada da versão codificada: `743164e5d35bb07ea40b94be3278906cedf687e6eaab9f9fc65f13a70724c6d7`.
- Engine final, conferido independentemente: `10be386d72dde0639f7b4f50a3f162c605a9db50fc9c2c8a91f3224aa3cfa1c5`.
- Noir continua preto e conserva brilho, pregas e silhueta após a compressão. As peças permanecem distintas e as barras não foram perdidas.
- Prune, seu detalhe de cintura e a miniatura de consulta correspondem à mesma peça e fotografia. Não foi observada alteração de anatomia, corte ou material introduzida pela edição/codificação.
- O rascunho está completo já no quadro de 13,1 s, permanece legível em 14,5 s e no último quadro amostrado antes de 16,3 s. Nome, miniatura e mensagem concordam. A inspeção amostral não equivale à leitura visual de cada quadro intermediário.
- “Peça pelo WhatsApp” permanece legível no compositor e no encerramento. Nenhum envio, resposta fictícia, telefone, QR ou informação comercial inventada foi observado.
- `AUREA.md` agora contém o CTA e o rascunho finais; a divergência documental anterior foi resolvida.

Engine e assets permaneceram congelados. Esta etapa modificou somente os dois relatórios sob responsabilidade desta revisão; a folha auxiliar de inspeção foi criada no diretório temporário do sistema.
