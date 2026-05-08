const BASE_URL = import.meta.env.VITE_BASE_URL;

// token
const getToken = () => localStorage.getItem("token");


// Get all pools
export const getPools = async () => {
  const res = await fetch(`${BASE_URL}/pool/allPool`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch pools");
  return res.json();
};


// Get pool by ID
export const getPoolById = async (id) => {
  const res = await fetch(`${BASE_URL}/pool/pool/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch pool details");
  return res.json();
};


//  Create pool
export const createPool = async (pool) => {
  const res = await fetch(`${BASE_URL}/pool/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(pool),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create pool");
  return data;
};


// Update pool
export const updatePool = async (id, pool) => {
  const res = await fetch(`${BASE_URL}/pool/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(pool),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update pool");
  return data;
};


// Delete pool
export const deletePool = async (id) => {
  const res = await fetch(`${BASE_URL}/pool/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete pool");
  return data;
};