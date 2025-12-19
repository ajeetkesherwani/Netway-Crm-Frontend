const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");
// Get all staff
export const getStaff = async () => {
  const res = await fetch(`${BASE_URL}/staff/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch staff");
  return data;
};
// Get staff details by ID
export const getStaffDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/staff/list/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch staff details");
  return data;
};
// Create staff
export const createStaff = async (staff) => {
  const res = await fetch(`${BASE_URL}/staff/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(staff),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create staff");
  return data;
};
// Update staff
export const updateStaff = async (id, staff) => {
  const res = await fetch(`${BASE_URL}/staff/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(staff),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update staff");
  return data;
};

// Delete staff
export const deleteStaff = async (id) => {
  const res = await fetch(`${BASE_URL}/staff/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete staff");
  return data;
};

export const getAllZoneList = async () => {
  const res = await fetch(`${BASE_URL}/zone/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch Area");
  return res.json();

};

//get activity logs
export const getActivityLogs = async (role, id) => {
  const res = await fetch(`${BASE_URL}/common/logList/${role}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch activity logs");
  }

  return res.json();
};