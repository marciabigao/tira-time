# Documentação de Testes End-to-End (E2E) - Cypress

Este documento descreve as suítes de testes automatizados E2E desenvolvidas com Cypress para a aplicação de Sorteio de Times. Os testes garantem o funcionamento correto dos fluxos principais da aplicação, desde a gestão de jogadores até a geração do sorteio e exportação de resultados.

---

## Estrutura das Suítes de Teste

Abaixo estão detalhados os quatro arquivos principais de testes, seus objetivos e as requisições de rede interceptadas.

### 1. Gestão de Jogadores (CRUD)
**Arquivo:** `player-management.cy.js`

Garante que o usuário consegue criar, visualizar, editar e excluir jogadores com sucesso.

*   **Cenário Testado:** O teste realiza o fluxo completo em sequência. Ele cria um jogador com nome dinâmico, verifica se ele aparece na lista, edita as informações (nome e habilidade) aguardando a atualização, e por fim o exclui, validando que o item não existe mais no DOM.
*   **Interceptações de Rede:**
    *   `POST **/players` (Criação)
    *   `PUT **/players/*` (Edição)
    *   `DELETE **/players/*` (Exclusão)

### 2. Sorteio de Times - Caminho Feliz
**Arquivo:** `team-draw-happy-path.cy.js`

Verifica o fluxo ideal de criação de uma partida, selecionando jogadores válidos e gerando os times.

*   **Cenário Testado:** Preenche os dados básicos da partida (nome, data, local), seleciona a quantidade exata de jogadores necessários (2 goleiros e 8 jogadores de linha) e submete o formulário. O teste valida se o sorteio foi processado e se a aplicação redirecionou o usuário corretamente para a página de resultados (`/teams-result`) contendo os times renderizados.
*   **Interceptações de Rede:**
    *   `POST **/draw-teams` (Sorteio)

### 3. Sorteio de Times - Validação
**Arquivo:** `team-draw-validation.cy.js`

Garante que o sistema previne a geração de times quando as regras de negócio não são cumpridas.

*   **Cenário Testado:** Preenche as informações da partida, mas seleciona uma quantidade inválida de jogadores (apenas 1 goleiro e 9 de linha). Tenta realizar o sorteio e valida se a URL permaneceu a mesma e se a mensagem de erro apropriada foi exibida na interface do usuário.
*   **Interceptações de Rede:** Nenhuma (o bloqueio ocorre antes ou a partir da resposta tratada de erro, sem necessidade de aguardar um estado de sucesso).

### 4. Download de PDF
**Arquivo:** `pdf-download-cy.js`

Valida a integração da tela de resultados com o endpoint de geração de relatórios em PDF.

*   **Cenário Testado:** Executa um sorteio válido para chegar à tela de resultados. Na tela de resultados, aciona a ação de baixar PDF e verifica se a requisição correspondente foi disparada e retornou um status HTTP 200 (Sucesso).
*   **Interceptações de Rede:**
    *   `POST **/draw-teams` (Sorteio pré-requisito)
    *   `POST **/generate-pdf` (Geração do arquivo)

---

## Mapeamento de Seletores (`data-cy`)

Para garantir a resiliência dos testes contra mudanças de layout, utilizamos atributos `data-cy` diretamente nos componentes React. A tabela abaixo lista os seletores mapeados:

| Seletor `data-cy` | Componente/Página | Descrição |
| :--- | :--- | :--- |
| `add-player-button` | Lista de Jogadores | Botão para abrir o modal de adicionar |
| `player-name-input` | Modais de Jogador | Input de texto para o nome do jogador |
| `player-ability-input` | Modais de Jogador | Select para a nota de habilidade |
| `player-position-input` | Modais de Jogador | Select para a posição (Goleiro/Linha) |
| `submit-player-button` | Modais de Jogador | Botão para salvar (adicionar ou editar) |
| `player-list-item` | Card do Jogador | Container principal de cada jogador na lista |
| `edit-player-button` | Card do Jogador | Botão de edição (ícone de lápis) |
| `delete-player-button` | Card do Jogador | Botão de exclusão (ícone de lixeira) |
| `confirm-delete-button`| Modal de Exclusão | Botão de confirmação final da exclusão |
| `match-name-input` | Criação de Partida | Input de texto para o nome do jogo |
| `match-date-input` | Criação de Partida | Input de data do jogo |
| `match-location-input` | Criação de Partida | Input de texto para o local do jogo |
| `player-select-goleiro`| Criação de Partida | Linha (checkbox) de um jogador goleiro |
| `player-select-linha` | Criação de Partida | Linha (checkbox) de um jogador de linha |
| `submit-draw-button` | Criação de Partida | Botão para acionar o sorteio dos times |
| `form-error` | Criação de Partida | Parágrafo que exibe validações de erro |
| `team-card` | Resultado da Partida | Container de exibição de um time sorteado |
| `download-pdf-button` | Resultado da Partida | Botão para solicitar o download do PDF |

---

## Notas de Manutenção

*   **Padrão de Interceptações:** As rotas interceptadas (`cy.intercept`) utilizam o curinga `**/rota` para corresponder exatamente ao caminho consumido pelo `services/api.js`. Caso a API mude de subdomínio ou adicione um prefixo (como `/api/v1/`), as strings de interceptação nos arquivos de teste deverão ser atualizadas.
*   **Seletores Dinâmicos:** A listagem de jogadores para o sorteio utiliza seletores condicionais baseados na posição da entidade (`player-select-goleiro` e `player-select-linha`). Isso evita buscar elementos por texto solto, o que torna os testes imunes a alterações superficiais na UI.