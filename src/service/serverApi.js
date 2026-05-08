const BASE_URL = import.meta.env.VITE_BASE_URL;

// token
const getToken = () => localStorage.getItem("token");


// ✅ Get all servers (with search + pagination)
export const getServers = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const query = new URLSearchParams({
    page,
    limit,
    search,
  }).toString();

  const res = await fetch(`${BASE_URL}/server/get?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch servers");
  return res.json();
};


// ✅ Get server by ID
export const getServerById = async (id) => {
  const res = await fetch(`${BASE_URL}/server/view/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch server details");
  return res.json();
};


// ✅ Create server
export const createServer = async (server) => {
  const res = await fetch(`${BASE_URL}/server/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(server),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create server");
  return data;
};


// ✅ Update server
export const updateServer = async (id, server) => {
  const res = await fetch(`${BASE_URL}/server/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(server),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update server");
  return data;
};


// ✅ Delete server
export const deleteServer = async (id) => {
  const res = await fetch(`${BASE_URL}/server/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete server");
  return data;
};