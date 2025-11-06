
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create zone
export async function createZone(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/zone/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.message || data?.error || text || `Request failed with ${res.status}`);
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || `Request failed with ${res.status}`);
    // parsing failed but status ok - return raw text
    return text;
  }
}

// List zones
export async function getZones() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/zone/list`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.message || data?.error || text || `Failed to fetch zones`);
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || `Failed to fetch zones`);
    return text;
  }
}

// Update zone
export async function updateZone(id, payload) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/zone/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.message || data?.error || text || `Failed to update zone`);
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || `Failed to update zone`);
    return text;
  }
}

// Delete zone
export async function deleteZone(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/zone/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.message || data?.error || text || `Failed to delete zone`);
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || `Failed to delete zone`);
    return text;
  }
}
