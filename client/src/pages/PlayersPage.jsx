import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { playersMock } from "../mocks/playersMock.js";
import PlayerCard from "../components/players/PlayerCard.jsx";
import AddPlayerModal from "../components/players/AddPlayerModal.jsx";

const SORT_OPTIONS = {
  NAME: "name",
  ABILITY: "ability",
  POSITION: "position",
};

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NAME);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Carrega mock ao montar
  useEffect(() => {
    setPlayers(playersMock);
  }, []);

  const sortedPlayers = useMemo(() => {
    const copy = [...players];
    switch (sortBy) {
      case SORT_OPTIONS.ABILITY:
        // habilidade desc, depois nome
        return copy.sort((a, b) => {
          if (b.ability !== a.ability) {
            return b.ability - a.ability;
          }
          return a.name.localeCompare(b.name, "pt-BR", {
            sensitivity: "base",
          });
        });
      case SORT_OPTIONS.POSITION:
        // Goleiro antes, depois linha, e dentro de cada grupo por nome
        return copy.sort((a, b) => {
          if (a.position !== b.position) {
            if (a.position === "GoalKeeper") return -1;
            if (b.position === "GoalKeeper") return 1;
          }
          return a.name.localeCompare(b.name, "pt-BR", {
            sensitivity: "base",
          });
        });
      case SORT_OPTIONS.NAME:
      default:
        return copy.sort((a, b) =>
          a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
        );
    }
  }, [players, sortBy]);

  const handleAddPlayer = (newPlayer) => {
    setPlayers((current) => [...current, newPlayer]);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Jogadores</h1>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          + Adicionar jogador
        </button>
      </div>

      {/* Controles de ordenação */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-600">Ordenar por:</span>
        <button
          type="button"
          onClick={() => setSortBy(SORT_OPTIONS.NAME)}
          className={`rounded-full px-3 py-1 ${
            sortBy === SORT_OPTIONS.NAME
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Nome (A-Z)
        </button>
        <button
          type="button"
          onClick={() => setSortBy(SORT_OPTIONS.ABILITY)}
          className={`rounded-full px-3 py-1 ${
            sortBy === SORT_OPTIONS.ABILITY
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Habilidade
        </button>
        <button
          type="button"
          onClick={() => setSortBy(SORT_OPTIONS.POSITION)}
          className={`rounded-full px-3 py-1 ${
            sortBy === SORT_OPTIONS.POSITION
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Posição
        </button>
      </div>

      {/* Lista de jogadores */}
      {sortedPlayers.length === 0 ? (
        <p className="text-sm text-gray-600">
          Nenhum jogador cadastrado ainda.
        </p>
      ) : (
        <div className="space-y-2">
          {sortedPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}

      {/* Modal de adicionar jogador */}
      <AddPlayerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPlayer}
      />
    </MainLayout>
  );
}

export default PlayersPage;