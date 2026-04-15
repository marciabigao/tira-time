# Algoritmo de Balanceamento de Times

Este documento descreve o processo utilizado para dividir um grupo de jogadores em times equilibrados, com base em sua habilidade e posição.

## 1. Objetivos

- **Equilíbrio de Habilidade**: A soma total das habilidades de cada time deve ser a mais próxima possível.
- **Distribuição de Goleiros**: Cada time deve ter exatamente um goleiro.
- **Tamanhos de Time Uniformes**: Os times devem ter o mesmo número de jogadores, ou uma diferença de no máximo 1.

## 2. Pré-condições e Validações

Antes de iniciar o sorteio, o sistema valida as seguintes regras:
1.  O número de jogadores selecionados deve ser suficiente para formar os times (mínimo de 1 jogador por time).
2.  O número de goleiros selecionados deve ser **maior ou igual** ao número de times a serem formados. Se for menor, o sorteio é interrompido com uma mensagem de erro clara.

## 3. Passo a Passo do Algoritmo

O algoritmo segue uma abordagem "Greedy" (gulosa) com ordenação, focada em distribuir os melhores jogadores primeiro para garantir o equilíbrio.

### Passo 3.1: Preparação e Tratamento dos Goleiros

Esta é a etapa mais crítica para garantir a regra de "um goleiro por time".

1.  **Separação Inicial**: Os jogadores selecionados são divididos em duas listas: `goleiros` e `jogadoresDeLinha`.
2.  **Validação de Goleiros**:
    - Se `número de goleiros` < `número de times`, o processo falha.
    - Se `número de goleiros` > `número de times`, o sistema executa um ajuste automático:
        a. Os goleiros são ordenados pela **menor habilidade** (do pior para o melhor).
        b. Os goleiros com as piores notas, na quantidade exata do excedente, são "rebaixados": eles são movidos da lista `goleiros` para a lista `jogadoresDeLinha` para o restante do sorteio.
3.  **Distribuição dos Goleiros**: Após o ajuste, o número de goleiros é exatamente igual ao número de times. Cada time recebe um goleiro aleatoriamente. A habilidade de cada goleiro já contribui para a soma total de habilidade do seu time.

### Passo 3.2: Ordenação dos Jogadores de Linha

- A lista `jogadoresDeLinha` (que agora pode conter ex-goleiros) é ordenada em **ordem decrescente** de habilidade. Os jogadores mais habilidosos ficam no início da lista.

### Passo 3.3: Distribuição dos Jogadores de Linha (O "Sorteio da Cobra")

Este é o núcleo do balanceamento. O algoritmo itera sobre a lista ordenada de jogadores de linha e os distribui um a um.

1.  **Seleção do Próximo Time**: Para cada jogador a ser distribuído, o algoritmo identifica qual time tem, no momento, a **menor soma de habilidades**. Este é o time que receberá o próximo jogador.
    - Em caso de empate (dois ou mais times com a mesma soma mínima), o time que tiver o menor número de jogadores é escolhido.
    - Se o empate persistir, a escolha é aleatória entre os empatados.

2.  **Atribuição**: O jogador do topo da lista (o mais habilidoso disponível) é adicionado ao time selecionado no passo anterior. A soma de habilidade do time é atualizada.

3.  **Repetição**: O processo se repete até que todos os jogadores de linha tenham sido distribuídos.

## 4. Resultado

Ao final, o sistema retorna uma estrutura de dados contendo os times formados, a soma de habilidade de cada um e a lista de jogadores que os compõem. Essa abordagem garante que a diferença de habilidade entre os times seja minimizada, pois os jogadores mais fortes são contrabalanceados pelas distribuições subsequentes.