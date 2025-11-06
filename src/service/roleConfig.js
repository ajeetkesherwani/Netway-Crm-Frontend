import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const getAllConfigList = async () => {
  const res = await fetch(`${BASE_URL}/resellerConfig/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch configs");
  return data;
};

export const getConfigDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/config/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch config details");
  return data;
}

export const createConfig = async (configData) => {
  const res = await fetch(`${BASE_URL}/resellerConfig/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(configData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create config");
  return data;
};

export const updateConfig = async (id, configData) => {
  const res = await fetch(`${BASE_URL}/config/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(configData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update config");
  return data;
};

export const deleteConfig = async (id) => {
  const res = await fetch(`${BASE_URL}/config/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete config");
  return data;
};

export const updateConfigStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/config/update-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update config status");
  return data;
};

export const getRoleConfigDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/resellerConfig/list/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch role config details");
  return data.data;
};

export const updateRoleConfig = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/resellerConfig/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update role config");
  return data;
};
