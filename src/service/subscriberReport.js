const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getAllUsersReport = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/subscriberReport/allUsers?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch users report");
  return data;
};

export const getAllInactiveUsersReport = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/subscriberReport/allInactiveUsers?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch inactive users report");
  return data;
};

export const getAllSuspendedUsersReport = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/subscriberReport/allSuspendedUsers?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch suspended users report");
  return data;
};