const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error || `Erro na requisição: ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
    getPlayers: () => request("/players"),
    createPlayer: (payload) =>
      request("/players", { method: "POST", body: JSON.stringify(payload) }),
    updatePlayer: (id, payload) => // Adicionar esta linha
      request(`/players/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    deletePlayer: (id) => request(`/players/${id}`, { method: "DELETE" }),
  };