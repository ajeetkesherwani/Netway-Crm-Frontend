const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Helper to get auth token
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Utility: parse response with graceful error messages (api intelligence)
 */
async function parseResponse(res, defaultErrMsg) {
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      // Prefer API message if available
      throw new Error(data?.message || data?.error || text || defaultErrMsg || `Request failed with ${res.status}`);
    }
    // If parsing succeeded return data, otherwise return raw text
    return data ?? text;
  } catch (err) {
    if (!res.ok) throw new Error(text || defaultErrMsg || `Request failed with ${res.status}`);
    // OK but parsing failed — return raw text
    return text;
  }
}

/* Hardware APIs */

// Create hardware
export async function createHardware(payload) {
  const res = await fetch(`${BASE_URL}/hardware/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to create hardware");
}

// List all hardware
export async function getHardwareList() {
  const res = await fetch(`${BASE_URL}/hardware/list`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return parseResponse(res, "Failed to fetch hardware list");
}
// Get hardware by id
export async function getHardwareById(id) {
  const res = await fetch(`${BASE_URL}/hardware/list/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return parseResponse(res, "Failed to fetch hardware");
}

// Delete hardware
export async function deleteHardware(id) {
  const res = await fetch(`${BASE_URL}/hardware/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return parseResponse(res, "Failed to delete hardware");
}

// Update hardware
export async function updateHardware(id, payload) {
  const res = await fetch(`${BASE_URL}/hardware/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to update hardware");
}

// Assign hardware to user
export async function assignHardware(payload) {
  const res = await fetch(`${BASE_URL}/hardware/assign-hardware`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(res, "Failed to assign hardware");
}

/* User listing (for assign dropdowns) */
export async function getAllUserList() {
  const res = await fetch(`${BASE_URL}/user/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Get assigned hardware for a user
export async function getAssignedHardwareByUserId(userId) {
  const res = await fetch(`${BASE_URL}/common/user/hardware/${userId}`, { 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return parseResponse(res, "Failed to fetch assigned hardware");
}

