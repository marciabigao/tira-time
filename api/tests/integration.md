Este documento detalha a arquitetura e a implementação dos testes de integração desenvolvidos para a API do projeto Tira-Time. O objetivo principal foi garantir a integridade das rotas, a comunicação correta com o banco de dados (SQLite via Prisma) e a validação das regras de negócio do sorteio.

🛠️ Ferramentas Utilizadas
Optamos por uma stack moderna e aderente ao padrão de módulos (ESM) do projeto:

Vitest: Framework de testes principal. Rápido, com suporte nativo a ES Modules e ferramentas de cobertura integradas.

Supertest: Biblioteca para simular requisições HTTP (GET, POST, PUT, DELETE) diretamente no app Express, sem a necessidade de alocar uma porta de rede.

V8 (Coverage): Motor nativo para geração dos relatórios de cobertura de código.

⚙️ Configuração da Infraestrutura
Para viabilizar os testes sem "prender" a porta 3000 e sem rodar o servidor real acidentalmente, isolamos a inicialização do Express no arquivo app.js:

O objeto app passou a ser exportado (export { app }).

O bloco app.listen() foi encapsulado em uma verificação de ambiente (if (process.env.NODE_ENV !== 'test')).

Utilizamos as tags /* v8 ignore start */ e /* v8 ignore stop */ para que o relatório de cobertura não penalizasse códigos de inicialização que, por design, não devem rodar em ambiente de teste.

🧪 Casos de Teste Cobertos
A suite de testes foi dividida modularmente em três frentes principais dentro de tests/integration/:

1. CRUD de Jogadores (player.test.js)
Garante a persistência e consistência dos dados dos atletas no banco.

POST /players: Sucesso na criação e bloqueio de dados inválidos (ex: habilidade > 5, nome curto, posição inexistente).

GET /players e GET /players/:id: Listagem geral e busca específica, incluindo erro 404 para IDs falsos.

PUT /players/:id: Atualização de atributos e validação contra payload malformado.

DELETE /players/:id: Remoção do banco e verificação do status 404 em entidades inexistentes.

2. Regras de Negócio do Sorteio (draw-teams.test.js)
Testa o núcleo do sistema (o Algoritmo de Balanceamento).

Validação de Entrada: Bloqueio de sorteios com menos de 2 times ou listas vazias de jogadores.

Regra dos Goleiros (Escassez): Interrupção do sorteio com erro explicativo caso o número de goleiros seja inferior ao número de times.

Regra dos Goleiros (Excedente): Verificação do ajuste automático que "rebaixa" goleiros com menor habilidade para jogadores de linha.

Integridade da Distribuição: Garantia de que cada time retornado possua exatamente um (1) goleiro.

3. Geração de PDF (generate-pdf.test.js)
Valida o endpoint que utiliza o pdfkit.

Validação de Payload: Erro 400 caso falte o array de times ou as informações da partida.

Integridade do Arquivo: Verificação do status 200, da presença dos headers application/pdf e attachment, e da constatação de que o Buffer retornado não está vazio.

📊 Cobertura de Código (Code Coverage)
Os testes foram desenhados para exercitar não apenas os "caminhos felizes", mas todas as travas de segurança e blocos de catch.

Com isso, a cobertura de código atingida no arquivo principal da API (app.js) foi de ~89.25%, superando a métrica de 80% estabelecida como requisito da disciplina.

🚀 Como Executar
Para rodar os testes localmente, certifique-se de estar dentro da pasta api/ e instale as dependências (caso seja a primeira vez):

Bash
# Rodar os testes uma única vez
npm run test

# Rodar os testes e gerar a tabela do relatório de cobertura
npm run test:coverage