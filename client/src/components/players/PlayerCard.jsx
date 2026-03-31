function PlayerCard({ player }) {
    const positionLabel =
      player.position === "GoalKeeper" ? "Goleiro" : "Linha";
  
    return (
      <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm">
            {player.name}
          </span>
          <span className="text-xs text-gray-500">
            {positionLabel} • Habilidade: {player.ability}
          </span>
        </div>
      </div>
    );
  }
  
  export default PlayerCard;