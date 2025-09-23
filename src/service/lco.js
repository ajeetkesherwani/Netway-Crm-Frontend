const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

//get all lco
export const getAllLco = async () => {
  const res = await fetch(`${BASE_URL}/lco/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch lco");
  return res.json();
 
};

// get lcoDetails
export const getLcoDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/lco/list/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch lco");
  return res.json();
};

// Create Retailer
export const createLco = async (lco) => {
  const res = await fetch(`${BASE_URL}/lco/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(lco),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create lco");
  return data;
};