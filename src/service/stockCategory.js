const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Helper to get auth token
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Utility: parse response with graceful error messages
 */
async function parseResponse(res, defaultErrMsg) {
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      throw new Error(data?.message || data?.error || text || defaultErrMsg || `Request failed with ${res.status}`);
    }
    return data ?? text;
  } catch (err) {
    if (!res.ok) throw new Error(text || defaultErrMsg || `Request failed with ${res.status}`);
    return text;
  }
}

/* Stock Category APIs */

export async function createStockCategory(payload) {
  const res = await fetch(`${BASE_URL}/stockCategory/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to create stock category");
}

export async function getStockCategories(queryParams = "") {
  const res = await fetch(`${BASE_URL}/stockCategory/list${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return parseResponse(res, "Failed to fetch stock categories");
}

export async function updateStockCategory(id, payload) {
  const res = await fetch(`${BASE_URL}/stockCategory/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to update stock category");
}

export async function deleteStockCategory(id) {
  const res = await fetch(`${BASE_URL}/stockCategory/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return parseResponse(res, "Failed to delete stock category");
}

export async function bulkUploadStockCategory(formData) {
  const res = await fetch(`${BASE_URL}/stockCategory/bulk-upload`, {
    method: "POST",
    headers: {
      // Don't set Content-Type for FormData, browser sets it with boundary
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  return parseResponse(res, "Failed to bulk upload stock categories");
}

export async function assignStockToEngineer(id, payload) {
  const res = await fetch(`${BASE_URL}/stockCategory/assign/engineer/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to assign to engineer");
}

export async function assignStockToUser(id, payload) {
  const res = await fetch(`${BASE_URL}/stockCategory/assign/user/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to assign to user");
}

export async function reassignStockToEngineer(id, payload) {
  const res = await fetch(`${BASE_URL}/stockCategory/reassign/engineer/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to reassign to engineer");
}

export async function reassignStockToUser(id, payload) {
  const res = await fetch(`${BASE_URL}/stockCategory/reassign/user/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to reassign to user");
}
