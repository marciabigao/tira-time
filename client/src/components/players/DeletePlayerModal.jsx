function DeletePlayerModal({ isOpen, onClose, onConfirm, player }) {
    if (!isOpen || !player) return null;
  
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Excluir jogador
            </h2>
          </div>
  
          <p className="mb-4 text-sm text-gray-700">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold">{player.name}</span>?
          </p>
  
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default DeletePlayerModal;