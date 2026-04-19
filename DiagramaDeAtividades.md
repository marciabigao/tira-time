%% Diagrama de Atividades do Sistema Tira-Time
%% Representa o fluxo de execução das atividades do sistema.

flowchart TD
    %% Nodo inicial
    start([Inicio]) --> login[Realizar Login]

    %% Decisão: Login bem-sucedido
    login -->|Login bem-sucedido| home[Exibir Página Inicial]
    login -->|Falha no Login| error[Exibir Mensagem de Erro]

    %% Fluxo principal após login
    home --> escolha[Escolher Página]
    escolha -->|Página de Jogadores| jogadores[Exibir Página de Jogadores]
    escolha -->|Página de Partidas| partidas[Exibir Página de Partidas]
    escolha -->|Página de Resultados| resultados[Exibir Página de Resultados]

    %% Fluxo de gerenciamento de jogadores
    jogadores --> adicionar[Adicionar Jogador]
    adicionar --> salvarJogador[Salvar Jogador no Banco de Dados]
    salvarJogador --> jogadores

    jogadores --> editar[Editar Jogador]
    editar --> atualizarJogador[Atualizar Dados no Banco de Dados]
    atualizarJogador --> jogadores

    jogadores --> excluir[Excluir Jogador]
    excluir --> removerJogador[Remover Jogador do Banco de Dados]
    removerJogador --> jogadores

    %% Fluxo de gerenciamento de partidas
    partidas --> criarPartida[Criar Nova Partida]
    criarPartida --> salvarPartida[Salvar Partida no Banco de Dados]
    salvarPartida --> partidas

    partidas --> editarPartida[Editar Partida]
    editarPartida --> atualizarPartida[Atualizar Dados da Partida no Banco de Dados]
    atualizarPartida --> partidas

    partidas --> excluirPartida[Excluir Partida]
    excluirPartida --> removerPartida[Remover Partida do Banco de Dados]
    removerPartida --> partidas

    %% Fluxo de visualização de resultados
    resultados --> visualizarResultados[Visualizar Resultados de Partidas]
    visualizarResultados --> resultados

    %% Nodo final
    home --> logout[Realizar Logout]
    logout --> end([Fim])