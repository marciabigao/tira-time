import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StarRating from "../components/StarRating";
import { api } from "../services/api";

function TeamsResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teams, matchInfo } = location.state || {};
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!teams || !matchInfo) return;
    setIsDownloading(true);
    try {
      const pdfBlob = await api.generatePdf({ teams, matchInfo });
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `times-${matchInfo.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Falha ao baixar PDF:", error);
      // Opcional: mostrar um erro para o usuário
    } finally {
      setIsDownloading(false);
    }
  };

  if (!teams || !matchInfo) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <h1 className="text-xl font-bold text-gray-800">Erro</h1>
          <p className="text-gray-600 mt-2">
            Nenhuma informação da partida foi encontrada.
          </p>
          <button
            onClick={() => navigate("/match")}
            className="mt-4 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Voltar para a criação de partida
          </button>
        </div>
      </MainLayout>
    );
  }

  const teamColors = ["bg-red-100", "bg-blue-100", "bg-green-100", "bg-yellow-100"];
  const teamTextColors = ["text-red-800", "text-blue-800", "text-green-800", "text-yellow-800"];
  const teamNames = ["Time Vermelho", "Time Azul", "Time Verde", "Time Amarelo"];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{matchInfo.name}</h1>
          <p className="text-md text-gray-500">{matchInfo.location} - {new Date(matchInfo.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <div key={index} className={`rounded-lg shadow-md overflow-hidden ${teamColors[index % teamColors.length]}`}>
              <div className={`p-3 ${teamTextColors[index % teamTextColors.length]}`}>
                <h2 className="text-xl font-bold">{teamNames[index % teamNames.length]}</h2>
                <p className="text-sm font-medium">Habilidade Total: {team.totalAbility}</p>
              </div>
              <ul className="bg-white">
                {team.players.map((player) => (
                  <li
                    key={player.id}
                    className={`flex items-center justify-between p-3 border-b border-gray-200 ${player.position === 'GoalKeeper' ? 'bg-yellow-50 font-bold' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-800">{player.name}</span>
                      <span className="text-xs text-gray-500">
                        {player.position === 'GoalKeeper' ? 'Goleiro' : 'Linha'}
                      </span>
                    </div>
                    <StarRating value={player.ability} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={() => navigate("/match")}
                className="w-full sm:w-auto rounded-md bg-gray-600 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
                Sortear Nova Partida
            </button>
            <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isDownloading ? "Baixando..." : "Baixar PDF"}
            </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default TeamsResultPage;