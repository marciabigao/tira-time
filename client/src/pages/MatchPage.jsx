import MainLayout from "../layouts/MainLayout.jsx";

function MatchPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Criar Partida</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-xl">
        <form className="space-y-4">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                defaultValue="2"
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
              placeholder="Ex.: Quadra da UFMG"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            />
          </div>

          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-red-400 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 transition-colors"
          >
            Salvar partida (UI)
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

export default MatchPage;