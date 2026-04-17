import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar useNavigate
import MainLayout from "../layouts/MainLayout.jsx";
import StarRating from "../components/StarRating.jsx";
import { api } from "../services/api.js";

function MatchPage() {
  const navigate = useNavigate(); // 2. Inicializar o hook
  const [matchName, setMatchName] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [teamsCount, setTeamsCount] = useState("2");
  const [location, setLocation] = useState("");

  const [players, setPlayers] = useState([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);

  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Para feedback no botão

  useEffect(() => {
    api.getPlayers()
      .then(data => {
        const sorted = [...data].sort((a, b) =>
          a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
        );
        setPlayers(sorted);
      })
      .catch(err => console.error("Falha ao buscar jogadores:", err));
  }, []);

  const togglePlayerSelection = (playerId) => {
    setFormError(""); // Limpa o erro ao interagir
    setSelectedPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setIsLoading(true);

    // Validações do formulário
    if (!matchName.trim()) {
      setFormError("O nome da partida é obrigatório");
      setIsLoading(false);
      return;
    }
    if (!matchDate) {
      setFormError("A data da partida é obrigatória");
      setIsLoading(false);
      return;
    }
    if (selectedPlayerIds.length < Number(teamsCount)) {
      setFormError(`Você precisa de pelo menos ${teamsCount} jogadores para formar ${teamsCount} times.`);
      setIsLoading(false);
      return;
    }

    try {
      const teams = await api.drawTeams({
        playerIds: selectedPlayerIds,
        teamsCount: Number(teamsCount),
      });

      // Navega para a página de resultados, passando os dados via state
      navigate("/teams-result", {
        state: {
          teams: teams,
          matchInfo: {
            name: matchName,
            date: matchDate,
            location: location,
          },
        },
      });

    } catch (error) {
      // Exibe o erro da API para o usuário
      setFormError(error.message || "Ocorreu um erro ao sortear os times.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center py-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Criar Partida
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Campos do formulário (Nome, Data, etc.) - sem alteração */}
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Selecione os Jogadores
                  </h2>
                  <span className="text-xs text-gray-500">
                    {selectedPlayerIds.length} selecionado(s)
                  </span>
                </div>

                <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                  {players.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      Nenhum jogador cadastrado.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {players.map((player) => {
                        const isSelected = selectedPlayerIds.includes(
                          player.id
                        );
                        return (
                          <li
                            key={player.id}
                            className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer ${
                              isSelected ? "bg-red-50" : "hover:bg-gray-50"
                            }`}
                            onClick={() => togglePlayerSelection(player.id)}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                              />
                              <span className="font-medium text-gray-800">
                                {player.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <StarRating value={player.ability} />
                              <span className={`${player.position === 'GoalKeeper' ? 'font-bold text-yellow-600' : ''}`}>
                                •{" "}
                                {player.position === "GoalKeeper"
                                  ? "Goleiro"
                                  : "Linha"}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1 mt-4">
                <div className="min-h-[1.25rem]">
                  {formError && (
                    <p className="text-sm text-red-600">{formError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-red-400 hover:bg-red-500 text-white text-sm font-semibold px-6 py-2.5 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sorteando..." : "Sortear Times"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default MatchPage;