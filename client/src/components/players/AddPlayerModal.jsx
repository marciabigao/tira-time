import { useState } from "react";

function AddPlayerModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [ability, setAbility] = useState("3");
  const [position, setPosition] = useState("FieldPlayer");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }
    const abilityNumber = Number(ability);
    if (
      Number.isNaN(abilityNumber) ||
      abilityNumber < 1 ||
      abilityNumber > 5
    ) {
      setError("A habilidade deve ser um número entre 1 e 5.");
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      ability: abilityNumber,
      position,
    });

    setName("");
    setAbility("3");
    setPosition("FieldPlayer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Adicionar Jogador
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="playerName"
              className="mb-1 block text-xs font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Nome do jogador"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="playerAbility"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                Habilidade (1 a 5)
              </label>
              <select
                id="playerAbility"
                value={ability}
                onChange={(e) => setAbility(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
+                <option value="1">★☆☆☆☆ (1)</option>
+                <option value="2">★★☆☆☆ (2)</option>
+                <option value="3">★★★☆☆ (3)</option>
+                <option value="4">★★★★☆ (4)</option>
+                <option value="5">★★★★★ (5)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="playerPosition"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                Posição
              </label>
              <select
                id="playerPosition"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="GoalKeeper">Goleiro</option>
                <option value="FieldPlayer">Linha</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-red-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPlayerModal;