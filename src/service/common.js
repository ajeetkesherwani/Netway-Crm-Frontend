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

