const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

//get all package list
export const getAllUserList = async () => {
  const res = await fetch(`${BASE_URL}/user/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
 
};

// Create package
export const createUser = async (packages) => {
  const res = await fetch(`${BASE_URL}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(packages),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create user");
  return data;
};

// get UserDetails
export const getUserDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user Details");
  return res.json();
};

