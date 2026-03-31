import StarRating from "../StarRating.jsx";

function PlayerCard({ player, onDeleteClick }) {
  const positionLabel =
    player.position === "GoalKeeper" ? "Goleiro" : "Linha";

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 text-sm">
          {player.name}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          {positionLabel} • <StarRating value={player.ability} />
        </span>
      </div>

      <button
        type="button"
        onClick={onDeleteClick}
        className="ml-2 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
        aria-label={`Excluir ${player.name}`}
      >
        ×
      </button>
    </div>
  );
}

export default PlayerCard;