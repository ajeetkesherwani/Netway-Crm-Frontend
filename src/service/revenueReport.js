const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

async function fetchJson(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export const getNewRegistrationPlanReport = async (page = 1, limit = 10, search = "") => {
  try {
    const url = new URL(`${BASE_URL}/revenueReport/newRegistrationPlanReport`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);
    return await fetchJson(url);
  } catch (err) {
    console.error("Error newRegistrationPlanReport:", err);
    throw err;
  }
};

export const getPaymentReport = async (page = 1, limit = 10, search = "") => {
  try {
    const url = new URL(`${BASE_URL}/revenueReport/payemntReport`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);
    return await fetchJson(url);
  } catch (err) {
    console.error("Error payemntReport:", err);
    throw err;
  }
};

export const getRecentPurchasedOrRenewReport = async (page = 1, limit = 10, search = "") => {
  try {
    const url = new URL(`${BASE_URL}/revenueReport/recentPurchasedOrRenewReport`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);
    return await fetchJson(url);
  } catch (err) {
    console.error("Error recentPurchasedOrRenewReport:", err);
    throw err;
  }
};