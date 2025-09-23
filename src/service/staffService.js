const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = () => localStorage.getItem("token");
console.log(token,"token");

// Get all staff
export const getStaff = async () => {
  const res = await fetch(`${BASE_URL}/staff/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch staff");
  console.log("res", res);
  return res.json();
};

// Create staff
export const createStaff = async (staff) => {
  const res = await fetch(`${BASE_URL}/staff/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(staff),
  });

    const data = await res.json();

  if (!res.ok) throw new Error("Failed to create staff");
  return data();
};

// Update staff
export const updateStaff = async (id, staff) => {
  const res = await fetch(`${BASE_URL}/staff/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(staff),
  });
  if (!res.ok) throw new Error("Failed to update staff");
  return res.json();
};

// Delete staff
export const deleteStaff = async (id) => {
  const res = await fetch(`${BASE_URL}/staff/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token()}` },
  });
  if (!res.ok) throw new Error("Failed to delete staff");
  return res.json();
};
