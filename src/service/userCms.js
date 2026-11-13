const BASE_URL = import.meta.env.VITE_BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseResponse = async (response, fallbackMessage) => {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    if (!response.ok) {
      throw new Error(text || `${fallbackMessage} (${response.status})`);
    }
    throw new Error("The server returned an invalid response");
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
};

export const getUserCmsList = async () => {
  const response = await fetch(`${BASE_URL}/cms/list`, {
    method: "GET",
    headers: getHeaders(),
  });
  return parseResponse(response, "Failed to fetch CMS content");
};

export const updateUserCms = async (id, payload) => {
  const response = await fetch(`${BASE_URL}/cms/update/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response, "Failed to update CMS content");
};
