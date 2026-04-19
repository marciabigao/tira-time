const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, options = {}, isBlob = false) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json() : null;
    const message = data?.error || `Erro na requisição: ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (isBlob) {
    return response.blob();
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  return isJson ? await response.json() : null;
}

export const api = {
    getPlayers: () => request("/players"),
    createPlayer: (payload) =>
      request("/players", { method: "POST", body: JSON.stringify(payload) }),
    updatePlayer: (id, payload) =>
      request(`/players/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    deletePlayer: (id) => request(`/players/${id}`, { method: "DELETE" }),
    drawTeams: (payload) =>
      request('/draw-teams', { method: 'POST', body: JSON.stringify(payload) }),
    generatePdf: (payload) =>
      request('/generate-pdf', { method: 'POST', body: JSON.stringify(payload) }, true),
  };