const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

async function parseResponse(res) {
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok)
      throw new Error(
        data?.message ||
          data?.error ||
          text ||
          `Request failed with ${res.status}`
      );
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || `Request failed with ${res.status}`);
    return text;
  }
}

// Create a new category
export async function createCategory(payload) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/category/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return await parseResponse(res);
}

// Get list of categories
export async function getCategoryList() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/category/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return await parseResponse(res);
}

// Update a category by ID
export async function updateCategory(id, payload) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/category/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return await parseResponse(res);
}

// Delete a category by ID
export async function deleteCategory(id) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/category/delete/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return await parseResponse(res);
}
