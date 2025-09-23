const BASE_URL = import.meta.env.VITE_BASE_URL;

// token
const getToken = () => localStorage.getItem("token");

// ✅ Get all roles
export const getRoles = async () => {
  const res = await fetch(`${BASE_URL}/role/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
};

// ✅ Get single role by ID
export const getRoleDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/role/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch role details");
  return res.json();
};

// ✅ Create role
export const createRole = async (role) => {
  const res = await fetch(`${BASE_URL}/role/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(role),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create role");
  return data;
};

// ✅ Update role
export const updateRole = async (id, role) => {
  const res = await fetch(`${BASE_URL}/role/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(role),
  });

  if (!res.ok) throw new Error("Failed to update role");
  return res.json();
};

// ✅ Delete role
export const deleteRole = async (id) => {
  const res = await fetch(`${BASE_URL}/role/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete role");
  return res.json();
};
