import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";

const API_BASE_URL = "http://localhost:3000";

function MatchPage() {
  const [matchName, setMatchName] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [teamsCount, setTeamsCount] = useState("2");
  const [location, setLocation] = useState("");

  const [players, setPlayers] = useState([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [playersError, setPlayersError] = useState("");

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Carregar jogadores da API ao montar a página
  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoadingPlayers(true);
      setPlayersError("");
      try {
        const response = await fetch(`${API_BASE_URL}/players`);
        if (!response.ok) {
          throw new Error("Falha ao carregar jogadores");
        }
        const data = await response.json();

        // Ordenar alfabeticamente por nome (garantia extra além do backend)
        const sorted = [...data].sort((a, b) =>
          a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
        );
        setPlayers(sorted);
      } catch (err) {
        console.error(err);
        setPlayersError(
          "Não foi possível carregar a lista de jogadores. Tente novamente mais tarde."
        );
      } finally {
        setIsLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  const togglePlayerSelection = (playerId) => {
    setSelectedPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    // Validações simples
    if (!matchName.trim()) {
      setFormError("O nome da partida é obrigatório.");
      return;
    }
    if (!matchDate) {
      setFormError("A data da partida é obrigatória.");
      return;
    }
    if (!location.trim()) {
      setFormError("O local da partida é obrigatório.");
      return;
    }
    if (!teamsCount || Number(teamsCount) < 2 || Number(teamsCount) > 4) {
      setFormError("A quantidade de times deve ser entre 2 e 4.");
      return;
    }
    if (selectedPlayerIds.length === 0) {
      setFormError("Selecione pelo menos um jogador para a partida.");
      return;
    }

    // Por enquanto só simulamos a criação da partida (UI)
    const selectedPlayers = players.filter((p) =>
      selectedPlayerIds.includes(p.id)
    );

    console.log("Partida criada (UI):", {
      matchName,
      matchDate,
      teamsCount: Number(teamsCount),
      location,
      players: selectedPlayers,
    });

    setSuccessMessage("Partida configurada com sucesso (apenas UI por enquanto).");

    // Opcional: limpar o formulário
    // setMatchName("");
    // setMatchDate("");
    // setTeamsCount("2");
    // setLocation("");
    // setSelectedPlayerIds([]);
  };

  return (
    <MainLayout>
      {/* Container que centraliza o card na tela, inclusive em desktop */}
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Criar Partida
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campos básicos da partida */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="matchName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome da partida
                  </label>
                  <input
                    id="matchName"
                    type="text"
                    value={matchName}
                    onChange={(e) => setMatchName(e.target.value)}
                    placeholder="Ex.: Pelada de sexta"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="matchDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Data
                    </label>
                    <input
                      id="matchDate"
                      type="date"
                      value={matchDate}
                      onChange={(e) => setMatchDate(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="teamsCount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantidade de times
                    </label>
                    <select
                      id="teamsCount"
                      value={teamsCount}
                      onChange={(e) => setTeamsCount(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    >
                      <option value="2">2 times</option>
                      <option value="3">3 times</option>
                      <option value="4">4 times</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Local
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex.: Quadra da UFMG"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  />
                </div>
              </div>

              {/* Seção de seleção de jogadores */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Jogadores da partida
                  </h2>
                  <span className="text-xs text-gray-500">
                    {selectedPlayerIds.length} selecionado(s)
                  </span>
                </div>

                {playersError && (
                  <p className="text-xs text-red-600">{playersError}</p>
                )}

                <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                  {isLoadingPlayers ? (
                    <div className="p-3 text-sm text-gray-500">
                      Carregando jogadores...
                    </div>
                  ) : players.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      Nenhum jogador cadastrado ainda.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {players.map((player) => {
                        const isSelected = selectedPlayerIds.includes(player.id);
                        return (
                          <li
                            key={player.id}
                            className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer ${
                              isSelected ? "bg-red-50" : "bg-white"
                            }`}
                            onClick={() => togglePlayerSelection(player.id)}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  togglePlayerSelection(player.id)
                                }
                                className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="font-medium text-gray-800">
                                {player.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              Habilidade: {player.ability} •{" "}
                              {player.position === "GoalKeeper"
                                ? "Goleiro"
                                : "Linha"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Mensagens de erro/sucesso */}
              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}
              {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
              )}

              {/* Botão principal */}
              <button
                type="submit"
                className="w-full sm:w-auto mt-2 inline-flex items-center justify-center rounded-md bg-red-400 hover:bg-red-500 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
              >
                Criar partida (UI)
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default MatchPage;