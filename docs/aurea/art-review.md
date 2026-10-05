# AURÉA — revisão de arte dos seis stills

## Parecer final — aprovado para a próxima etapa de renderização

**Status: aprovado no escopo visual de arte.** Revisor: `astra_art_review`. Revisão final em 2026-10-05T00:28:48.452Z. Nenhum P1 ou P2 residual impede a exportação de teste no escopo revisado.

O último still de detalhe10.7 s foi conferido em1080 ×1920 e em redução360 ×640, exibida em memória sem gravar outro asset. “Elegância” em y390/tamanho96 agora tem respiro claro abaixo da régua; a segunda linha em y486 mantém separação das fotografias. O cursor aparece na lateral direita da imagem, sem cobrir “Drapeado”. A rota no código passa pelos pontos1040/1320 e1018/1610 antes de se aproximar do CTA, coerente com o desvio da legenda. A trajetória completa em vídeo não foi reproduzida por este revisor nesta etapa.

Os demais cinco stills e a hierarquia mobile foram aprovados na revisão anterior, exceto por esses dois resíduos agora fechados. O original, as correções e os pareceres intermediários permanecem abaixo como histórico; não são pendências atuais.

- Engine: `public/aurea.js`.
- SHA-256 do engine: `dfe2045de0cb769d3bd8b234b7290ef1f840ec009831b90cc77ba5ed43f24215`.
- SHA-256 do detalhe aprovado: `ed942541fe254ab9ab6cbeacd4449cf86ea6bc99d20c9f9787ea12fed947e019`.
- SHA-256 do storyboard atualizado: `e7dbb79b870c24e770fb35f395393f62988ad3fe721b888f3c2d8991528d7fa6`.
- P1 residual de título/régua: resolvido.
- P2 residual de cursor/legenda: resolvido no still e coerente na rota inspecionada.

Esta aprovação cobre desenho, contraste, proporção e leitura dos quadros de origem. Não substitui auditorias de movimento, seek, pixels de loop, áudio ou inspeção do vídeo final codificado. Nenhum engine, fonte, imagem ou documento AUREA.md foi alterado pelo revisor nesta etapa; apenas este parecer foi atualizado.

---

## Histórico da revisão 2

## Revisão 2 — após fonte estática e nova geometria

**Parecer atual: solicitar uma correção pontual antes da aprovação final.** Revisor: `astra_art_review`. Os heros e o compositor fecharam os bloqueios principais; resta a tangência do título do detalhe com a régua, já descrita na revisão inicial. Não solicito redesign.

Escopo: seis stills atualizados, detalhe e compositor ampliados em1080 ×1920, e reduções em memória de Noir, Prune, detalhe, WhatsApp e marca para360 ×640. Nenhum quadro novo foi renderizado pelo revisor. As reduções foram exibidas sem gravar arquivos. Sem avaliação de movimento ou vídeo codificado nesta rodada.

SHA-256 do storyboard revisado: `5f1d6fe73d09a286e3ab92cb964a1dbf51dc410fb72e51822d5e98b6dba95ee5`.

SHA-256 do engine lido nesta rodada: `d5a368fe979c908f2e734894af82634b7fe62aed098cad44ab9bc4a1a6ac7cd1`.

### Fechamentos verificados

| Achado anterior | Estado atual |
| --- | --- |
| Régua/título/foto nos três looks | Resolvido: os títulos em96 px e fotos com topo550 têm separação clara. As barras continuam visíveis. |
| Miniatura atravessando a régua WhatsApp | Resolvido: a foto começa abaixo da régua. |
| Cartão WhatsApp colado ao CTA | Resolvido:35 px separam as superfícies e as sombras já não parecem uma só. |
| Rodapé “Rascunho” na borda da bolha | Resolvido para esta composição: texto38 px reposicionado, legível e contido. |
| Filetes frágeis de Bodoni | Resolvido na comparação360: fonte estática500/opsz12 mantém os traços mais consistentes, sem necessidade de mudar família. |
| Subtítulos de peça pequenos | Melhorados para40 px; tipo/cor legíveis na redução360. Header32 px continua discreto, mas é secundário e não bloqueia. |
| Repetição dos três looks | Melhorada por deslocamentos opostos de fotografia e títulos mais curtos. A construção ainda é uma série editorial coerente; não é bloqueio. |
| Monograma competindo com a marca | Melhorado pela redução. Permanece distinto da serifada, mas agora funciona como acento, sem exigir revisão para exportar. |

### P1 residual — somente o título do detalhe

Em10.7 s, “Elegância” continua centrado em y366 com tamanho108; a régua segue em y309. O topo do E e o topo do ponto do i encostam visualmente na régua. A tangência permanece tanto na imagem1080 quanto em360 ×640. Os títulos dos heros foram corrigidos, mas o bloco `detail()` conserva as coordenadas antigas.

Correção suficiente: aplicar a mesma escala/respiro da família editorial ao detalhe, por exemplo primeira linha em y390/tamanho96 e segunda em y486/tamanho96, verificando a caixa real. Há espaço antes das fotos, portanto não é necessário movê-las. Critério: pelo menos20–24 px de respiro visual entre régua e letra mais alta.

### P2 residual — cursor na legenda Drapeado

Em10.7 s, a ponta do cursor ainda ocupa o início da palavra “Drapeado”. A palavra permanece reconhecível na redução, então não amplio a gravidade: continua P2. Desviar a rota para a lateral da imagem ou para o espaço à direita da legenda remove a interferência. Verificar alguns quadros adjacentes quando o responsável por motion validar a rota.

O compositor, o produto e o fechamento não apresentam outro bloqueante nos stills desta rodada. A aprovação visual final pode ser encerrada com um still corrigido do detalhe; as auditorias de movimento e loop continuam independentes.

---

## Histórico — revisão 1, antes das correções

O parecer abaixo é preservado como registro da versão anterior. Seus achados não devem ser tratados como pendências adicionais quando marcados resolvidos na tabela acima.

**Parecer: solicitar revisão antes do full render.** Revisor: `astra_art_review`. Escopo: storyboard de seis stills e imagens individuais em 1080 × 1920; redução em memória de Noir, WhatsApp e marca para 360 × 640; leitura de `public/aurea.js`. Não foi avaliado o vídeo em movimento. Nenhum engine ou asset foi modificado pelo revisor.

Evidências: [storyboard](storyboard.png), [Noir](noir.png), [Lumière](lumiere.png), [Prune](prune.png), [detalhe](detalhe.png), [WhatsApp](whatsapp.png), [marca](marca.png).

As coordenadas são do quadro de origem, com referências de código quando relevantes. P1 significa corrigir antes da exportação final; P2 significa acabamento visível a resolver na revisão seguinte. Não há P0.

## P1 — títulos comprimidos entre a régua e a fotografia

**Evidência:** Noir 0.8 s, Lumière 4.7 s e Prune 7.2 s. A régua está em y309; a primeira linha de título, centrada em y368 com tamanho108, começa visualmente junto dessa régua. A segunda linha está em y467, enquanto a foto começa em y477.5. No quadro Prune, a borda da foto atravessa claramente a parte inferior de “Seu vestido.”. Nos quadros escuros a colisão é menos evidente porque os fundos têm tons próximos, mas a geometria é a mesma. O título do detalhe também encosta na régua superior.

**Efeito:** cabeçalho, título e foto parecem disputar a mesma faixa. A reorganização de camadas tornou o texto visível, mas não resolveu o espaço de composição. Não é preciso uma margem grande: é preciso que a fronteira da imagem não atravesse uma parte aleatória dos glifos.

**Correção proposta:** medir as caixas reais dos títulos; reservar pelo menos24 px entre régua e topo do título e32 px entre fim do título e início da foto. Uma solução é título em96 px, centros aproximadamente y385/y481, e foto iniciando em y560. Preservar o look inteiro com escala uniforme e recalcular rodapé/CTA; não simplesmente descer uma foto de1025 px e cortar a barra. Alternativa: sobreposição editorial deliberada muito maior, inteiramente apoiada numa área uniforme da fotografia; evitar a interseção acidental de15–25 px atual.

**Critério de fechamento:** nas três peças e no detalhe, nenhum filete de letra tangencia a régua; a fronteira da foto fica separada do texto ou participa de uma sobreposição claramente intencional, consistente e legível.

## P1 — o compositor ainda não tem espaçamento de interface resolvido

**Evidência:** WhatsApp 14.5 s. A miniatura começa por volta de y639, invadindo a régua horizontal em y655. A bolha termina em y1427.5, com “Rascunho” e seta centrados em y1410, deixando quase nenhum espaço inferior. O cartão termina em y1465 e o botão começa em y1475: apenas10 px entre os dois; na prévia360, tornam-se3.3 px e as sombras se fundem.

**Efeito:** a foto está visível, porém a hierarquia interna parece montada por sobreposição. O rodapé do rascunho e o CTA ficam colados às superfícies.

**Correção proposta:** miniatura começa ao menos24–32 px abaixo da régua; mover nome/cor/tipo junto com ela. Dar pelo menos24 px de padding real ao rodapé da bolha. Abrir32 px entre cartão e botão. Há espaço para reduzir a miniatura para aproximadamente280 ×350 ou reduzir a altura do cartão, mantendo o texto do rascunho em44 px. Não solucionar diminuindo o corpo da mensagem.

**Critério de fechamento:** miniatura não atravessa a régua, “Rascunho” não encosta no fundo da bolha, sombras do cartão e botão permanecem visualmente separadas em360 ×640.

## P2 — filetes de Bodoni frágeis na escala de consumo

**Evidência:** em1080, os filetes de AURÉA, “Seu momento.” e “Vamos conversar?” já ficam próximos de1 px em trechos. Na redução360, vários filetes ficam descontínuos. As palavras ainda são reconhecíveis: não classifico os títulos como ilegíveis. O problema é a fragilidade visual, sobretudo na assinatura de58 px, que passa a aproximadamente19 px.

**Correção proposta:** manter o peso500 escolhido e testar um tamanho óptico explicitamente baixo, por exemplo `opsz=12`, antes de alterar família ou peso. Comparar o render real, pois carregar a fonte variável não garante por si só a aparência óptica desejada. Se a assinatura pequena continuar frágil, usar um tratamento de marca específico nesse tamanho ou ampliá-la; não aplicar stroke grosseiro a toda a tipografia.

**Critério de fechamento:** comparação lado a lado em360 ×640, incluindo a marca pequena e a palavra “conversar”; filetes presentes sem engrossar os arcos ao ponto de perder o contraste editorial.

## P2 — microtexto abaixo da hierarquia acordada

**Evidência:** header de categoria em28 px (9.3 px no celular), subtítulos de peça em36 px (12 px), categoria final em34 px (11.3 px). O texto essencial do rascunho e os CTAs, ambos44 px ou maiores, mantêm leitura. A deficiência concentra-se na informação secundária.

**Correção proposta:** usar36–40 px para o pequeno header, ou removê-lo quando repetir informação já evidente. Subtítulos de produto em40–44 px; caso não caibam, separar comprimento e cor em duas linhas em vez de reduzir. Evitar que “MIDI · CHAMPANHE” ocupe toda a borda direita sem respiro.

**Critério de fechamento:** comprador consegue ler tipo e cor da peça em360 ×640 sem ampliar; informação dispensável não compete com o look.

## P2 — pointer interfere na legenda do detalhe

**Evidência:** detalhe 10.7 s. A ponta do cursor aparece sobre o início de “Drapeado”, ocupando a área do D. A imagem ampliada preserva tecido e construção; o problema é a rota do cursor sobre a legenda.

**Correção proposta:** fazer a rota sair pela lateral externa da imagem ou permanecer sobre a fotografia até alinhar com o botão. Manter a caixa do cursor fora da caixa de texto, com uma folga de16–24 px durante o deslocamento.

**Critério de fechamento:** verificar uma janela de movimento, não apenas o still10.7; nenhum glifo é encoberto na rota até o CTA.

## P2 — repetição de composição e copy pouco específica nos três looks

**Evidência:** primeiros três stills repetem header, título central em duas linhas, foto central820 ×1025 e legenda inferior. Os vestidos mudam, mas a construção gráfica é praticamente um template idêntico. “Para noites inesquecíveis.”, “O brilho da sua presença.” e “Seu momento. Seu vestido.” não acrescentam uma diferença concreta entre as peças.

**Correção proposta:** conservar continuidade do conjunto, mas variar uma das poses de leitura: Lumière pode ganhar título curto lateral ou uma frase de uma linha, com o midi inteiro ainda dominante; Prune pode antecipar o drapeado assimétrico que será mostrado no detalhe. Trocar ao menos um slogan por conteúdo realmente ligado ao que se vê, sem afirmar atributos de produto não confirmados. Não acrescentar mais copy.

**Nota de escopo:** o código mostra deriva de apenas8 px nos dois primeiros quadros editoriais, isto é, cerca de2.7 px em360. Isso indica risco de longas poses quase estáticas, mas não é uma reprovação de movimento baseada nos stills. O responsável por motion deve verificar o trecho em reprodução.

## P2 — fechamento divide protagonismo entre duas marcas

**Evidência:** marca18.5 s. A assinatura AURÉA ocupa o topo, enquanto um A geométrico monolinear grande ocupa a metade esquerda e a foto fica à direita. O A não compartilha o contraste de espessura da Bodoni e parece uma segunda identidade. Há uma faixa vazia grande entre a categoria e os elementos centrais.

**Correção proposta:** reduzir o monograma e aproximá-lo da assinatura ou do gesto que o origina, para funcionar como acento. Outra opção é derivar sua forma da própria letra A da marca. Recuperar espaço para a peça ou para conectar melhor foto e chamada; evitar simplesmente adicionar decoração no vazio.

**Critério de fechamento:** um foco de marca, um foco de produto e uma ação clara; o monograma não compete com o nome e não parece um asset de outra linguagem.

## Conteúdo e integridade observados

Os três vestidos são distinguíveis por cor e comprimento; o midi mostra pernas/calçados e os longos preservam a barra. O detalhe corresponde à mesma peça Prune. Não encontrei inconsistência anatômica ou de construção bloqueante nos seis stills inspecionados. Preto sobre ameixa mantém silhueta; champanhe e Prune também se separam dos respectivos fundos.

O rascunho está claramente identificado e a foto selecionada aparece; não há estado visual de mensagem enviada no still. O texto implementado pede tamanhos disponíveis e não afirma estoque. A seta dentro da bolha, embora cinza, sugere um controle de envio: removê-la ou substituí-la por um tratamento de rascunho seria mais inequívoco, sem necessidade de acrescentar explicação longa.

O verde no título “WhatsApp” é uma exceção ao token “verde apenas no CTA” do spec; não é um defeito visual bloqueante. Se for manter, documentar a exceção conscientemente. “Peça pelo WhatsApp” tem intenção um pouco mais forte que “Consultar pelo WhatsApp”, mas o rascunho permanece uma consulta; escolher uma redação consistente em todos os CTAs.

## Próxima aprovação

Corrigir P1, revisar tipografia em tamanho de celular e submeter os seis stills novamente. Depois, verificar as janelas de transição e o loop no vídeo antes de considerar o filme pronto. Este parecer não substitui auditoria de seek, pixels de loop, sincronismo ou vídeo codificado.


---

## Revisão final do MP4 codificado — APROVADO

Revisor: `astra_art_review`. Data: 2026-10-05T00:59:23.107Z. **Aprovação visual de arte e legibilidade do arquivo final, sem P1/P2 residual no escopo inspecionado.**

Arquivo: [aurea-1080x1920-60.mp4](aurea-1080x1920-60.mp4).

SHA-256 do MP4 verificado diretamente: `6af92781a033615a523dff3b3686d14beab2ea662def588e621048d308555aa3`.

SHA combinado da fonte, conforme manifesto final: `743164e5d35bb07ea40b94be3278906cedf687e6eaab9f9fc65f13a70724c6d7`. Todos os 15 arquivos listados nesse manifesto foram verificados individualmente contra seus hashes nesta revisão. O engine congelado é `10be386d72dde0639f7b4f50a3f162c605a9db50fc9c2c8a91f3224aa3cfa1c5`.

### Inspeção executada

Inspecionei [encoded-contact.png](encoded-contact.png), incluindo o retorno em 21,35 s. Decodifiquei diretamente do MP4 os quadros de 0,8; 4,7; 7,2; 10,7; 14,5 e 18,5 s; cada quadro foi reduzido em memória para 360 × 640 e comparado lado a lado com o still correspondente da fonte na mesma escala. Nenhum arquivo de imagem intermediário foi gravado. Os pares incluem os três vestidos, o detalhe, o compositor de consulta e a assinatura/CTA.

### Resultado concreto

- Bodoni500/opsz12: títulos, assinatura e acentos permanecem reconhecíveis e os filetes não apresentam degradação visível que comprometa a leitura em360 ×640.
- Noir: silhueta preta e pregas principais continuam separadas do fundo ameixa; a codificação não apaga o caimento.
- Lumière: tom champanhe, reflexos do tecido e comprimento midi permanecem distinguíveis; os reflexos não viram manchas brancas sem detalhe.
- Prune: ameixa se mantém distinto do fundo creme e o drapeado corresponde ao mesmo vestido do detalhe e da miniatura.
- Detalhe10.7 s: respiro do título permanece correto; as legendas Cetim/Drapeado continuam livres, com o cursor na lateral da imagem.
- Compositor14.5 s: nome, comprimento, cor, mensagem, “Rascunho” e CTA são legíveis. A separação do cartão e do botão sobrevive à redução e à compressão; não há apresentação de estado enviado nesse quadro.
- Marca18.5 s: assinatura, fotografia e CTA conservam a hierarquia aprovada; verde e creme mantêm contraste.
- Retorno21.35 s no contato codificado: fotografia de Noir, título e CTA em contorno estão presentes, sem placa duplicada ou resíduo de preenchimento verde perceptível no quadro inspecionado.

Não identifiquei diferença de composição, alteração relevante de cor, perda de informação comercial ou artefato de compressão que exija nova edição. O microtexto de categoria permanece secundário e discreto, conforme a revisão anterior; os nomes das peças e informações essenciais continuam legíveis.

Esta aprovação encerra o escopo de direção de arte e legibilidade codificada. Não afirmo ter reproduzido continuamente os22 segundos nem refeito as auditorias de movimento, áudio ou loop; essas verificações são cobertas pelos responsáveis e relatórios próprios. Engine, fontes, imagens e MP4 permaneceram intactos. Apenas este documento recebeu o parecer final.
