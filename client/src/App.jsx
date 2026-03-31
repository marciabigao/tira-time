import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MatchPage from "./pages/MatchPage.jsx";
import PlayersPage from "./pages/PlayersPage.jsx";

function App() {
  return (
    <Routes>
      {/* Tela inicial (logo + botão) */}
      <Route path="/" element={<Home />} />

      {/* Tela de partida (com navbar) */}
      <Route path="/match" element={<MatchPage />} />

      {/* Tela de jogadores (com navbar) */}
      <Route path="/players" element={<PlayersPage />} />
    </Routes>
  );
}

export default App;