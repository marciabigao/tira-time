import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const linkBaseClasses =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-red-500 text-white";
  const inactiveClasses = "text-gray-700 hover:bg-gray-100";

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14">
        <img
            src="/public/assets/logo-removebg-preview.png"
            alt="Tira-Time"
            className="w-28 h-auto"
        />

        <div className="flex items-center gap-2">
          <NavLink
            to="/match"
            className={({ isActive }) =>
              `${linkBaseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            Partida
          </NavLink>

          <NavLink
            to="/players"
            className={({ isActive }) =>
              `${linkBaseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            Jogadores
          </NavLink>

          <button
            type="button"
            onClick={() => navigate("/")}
            className={`${linkBaseClasses} ${inactiveClasses}`}
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;