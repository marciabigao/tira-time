import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/match");
    };
  
    return (
      <div className="min-h-screen bg-white flex justify-center">
        <div className="max-w-md w-full flex flex-col items-center gap-8 px-4 mt-48">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <img
              src="/public/assets/logo-removebg-preview.png"
              alt="Tira-Time"
              className="w-220 h-auto"
            />
          </div>
  
          {/* Botão de começar */}
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3 rounded-md bg-red-400 hover:bg-red-500 text-white font-semibold text-lg transition-colors shadow-sm"
          >
            Começar
          </button>
        </div>
      </div>
    );
  }
  
  export default Home;