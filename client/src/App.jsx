import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MatchPage from "./pages/MatchPage.jsx";
import PlayersPage from "./pages/PlayersPage.jsx";
import TeamsResultPage from "./pages/TeamsResultPage.jsx"; // 1. Importar a nova página

function App() {
  return (
    <Routes>
      {/* Tela inicial (logo + botão) */}
      <Route path="/" element={<Home />} />

      {/* Tela de partida (com navbar) */}
      <Route path="/match" element={<MatchPage />} />

      {/* Tela de jogadores (com navbar) */}
      <Route path="/players" element={<PlayersPage />} />

      {/* Tela de resultado do sorteio (com navbar) */}
      <Route path="/teams-result" element={<TeamsResultPage />} />
    </Routes>
  );
}

export default App;