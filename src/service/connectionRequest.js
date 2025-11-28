
const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// Get all connection requests
export const getConnectionRequests = async () => {
  const res = await fetch(`${BASE_URL}/connectRequest/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch connection requests");
  return res.json();
};
