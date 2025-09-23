const BASE_URL = import.meta.env.VITE_BASE_URL;

// token
const getToken = () => localStorage.getItem("token");

// Get all Retailer
export const getRetailer = async () => {
  const res = await fetch(`${BASE_URL}/retailer/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch retailer");
  return res.json();
 
};

// ✅ Get single retailer by ID
export const getRetailerDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/retailer/list/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch retailer");
  return res.json();
};

// Create Retailer
export const createRetailer = async (retailer) => {
  const res = await fetch(`${BASE_URL}/retailer/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(retailer),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create retailer");
  return data;
};

// Update Retailer
export const updateRetailer = async (id, retailer) => {
  const res = await fetch(`${BASE_URL}/retailer/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(retailer),
  });

  if (!res.ok) throw new Error("Failed to update retailer");
  return res.json();
};

// Delete Retailer
export const deleteRetailer = async (id) => {
  const res = await fetch(`${BASE_URL}/retailer/delete${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete retailer");
  return res.json();
};
