const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

async function requestLeadStage(path = "", options = {}) {
  const response = await fetch(`${BASE_URL}/leadStage${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || data?.status === false || data?.success === false) {
    throw new Error(
      data?.message || `Lead stage request failed with status ${response.status}.`
    );
  }
  return data;
}

export async function getLeadStages() {
  const response = await requestLeadStage("/list");
  const stages = [response?.data, response?.data?.leadStages, response?.leadStages]
    .find(Array.isArray);
  if (!stages) {
    throw new Error("The lead stage response did not contain a list.");
  }
  return stages;
}

export function createLeadStage(payload) {
  return requestLeadStage("/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateLeadStage(id, payload) {
  return requestLeadStage(`/update/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteLeadStage(id) {
  return requestLeadStage(`/delete/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
