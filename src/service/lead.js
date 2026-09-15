const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// ── Create Lead (multipart/form-data with file uploads) ─────────────────────
export const createLead = async (formData) => {
  const res = await fetch(`${BASE_URL}/lead/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      // Do NOT set Content-Type — browser sets it with boundary for FormData
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create lead");
  return data;
};

// ── Get Paginated Lead List ──────────────────────────────────────────────────
export const getLeads = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/lead/list?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch leads");
  return data;
};

// ── Get Single Lead Details ──────────────────────────────────────────────────
export const getLeadDetails = async (leadId) => {
  const res = await fetch(`${BASE_URL}/lead/view/${leadId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch lead details");
  return data;
};

// ── Update Lead (multipart/form-data) ────────────────────────────────────────
export const updateLead = async (leadId, formData) => {
  const res = await fetch(`${BASE_URL}/lead/update/${leadId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update lead");
  return data;
};

// ── Delete Lead ───────────────────────────────────────────────────────────────
export const deleteLead = async (leadId) => {
  const res = await fetch(`${BASE_URL}/lead/delete/${leadId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete lead");
  return data;
};
