import StarRating from "../StarRating.jsx";

function PlayerCard({ player, onDeleteClick, onEditClick }) {
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

      <div className="flex items-center">
        <button
          type="button"
          onClick={onEditClick}
          className="rounded-full p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-500"
          aria-label={`Editar ${player.name}`}
        >
          {/* Ícone de lápis (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDeleteClick}
          className="ml-1 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
          aria-label={`Excluir ${player.name}`}
        >
          {/* Ícone de lixeira (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PlayerCard;