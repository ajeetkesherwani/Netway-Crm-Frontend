const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

async function parseResponse(res) {
  const text = await res.text().catch(() => null);
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        text ||
        `Request failed with ${res.status}`
    );
  }
  return data ?? text;
}

export async function getSmsTemplatelist() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/common/sms-templates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return await parseResponse(res);
}

export async function getMonitoringLogs(filters, { signal } = {}) {
  const token = getToken();
  if (!token) throw new Error("An admin token is required to fetch monitoring logs.");

  const query = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value).trim());
    }
  });

  if (!query.has("filter")) {
    throw new Error("A monitoring log filter is required.");
  }

  const res = await fetch(
    `${BASE_URL}/monitoring/logs?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    }
  );
  return parseResponse(res);
}

