import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import PlayerCard from "../components/players/PlayerCard.jsx";
import AddPlayerModal from "../components/players/AddPlayerModal.jsx";
import DeletePlayerModal from "../components/players/DeletePlayerModal.jsx";
import { api } from "../services/api.js";

const SORT_OPTIONS = {
  NAME: "name",
  ABILITY: "ability",
  POSITION: "position",
};

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NAME);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);

  // Carrega jogadores da API ao montar
  useEffect(() => {
    api.getPlayers()
      .then(setPlayers)
      .catch(err => console.error("Falha ao buscar jogadores:", err));
  }, []);

  const sortedPlayers = useMemo(() => {
    const copy = [...players];
    switch (sortBy) {
      case SORT_OPTIONS.ABILITY:
        return copy.sort((a, b) => {
          if (b.ability !== a.ability) {
            return b.ability - a.ability;
          }
          return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
        });
      case SORT_OPTIONS.POSITION:
        return copy.sort((a, b) => {
          if (a.position !== b.position) {
            if (a.position === "GoalKeeper") return -1;
            if (b.position === "GoalKeeper") return 1;
          }
          return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
        });
      case SORT_OPTIONS.NAME:
      default:
        return copy.sort((a, b) =>
          a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
        );
    }
  }, [players, sortBy]);

  const handleAddPlayer = async (playerData) => {
    try {
      const newPlayer = await api.createPlayer({
        name: playerData.name,
        ability: playerData.ability,
        position: playerData.position,
      });
      setPlayers((current) => [...current, newPlayer]);
    } catch (err) {
      console.error("Falha ao criar jogador:", err);
      // Aqui você poderia mostrar um erro na UI
    }
  };

  const handleConfirmDelete = async () => {
    if (!playerToDelete) return;
    try {
      await api.deletePlayer(playerToDelete.id);
      setPlayers((current) =>
        current.filter((p) => p.id !== playerToDelete.id)
      );
      setPlayerToDelete(null);
    } catch (err) {
      console.error("Falha ao deletar jogador:", err);
      // Aqui você poderia mostrar um erro na UI
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Jogadores</h1>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
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
          Habilidade (★)
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
      {players.length === 0 ? (
        <p className="text-sm text-gray-600">
          Nenhum jogador cadastrado.
        </p>
      ) : (
        <div className="space-y-2">
          {sortedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onDeleteClick={() => setPlayerToDelete(player)}
            />
          ))}
        </div>
      )}

      {/* Modal de adicionar jogador */}
      <AddPlayerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPlayer}
      />

      {/* Modal de exclusão de jogador */}
      <DeletePlayerModal
        isOpen={!!playerToDelete}
        player={playerToDelete}
        onClose={() => setPlayerToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </MainLayout>
  );
}

export default PlayersPage;