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

export const getLcoActiveUserList = async (resellerId, page = 1, limit = 10, search = "") => {
  const url = new URL(`${BASE_URL}/lcoWise/active/userList/${resellerId}`);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  if (search) url.searchParams.append("search", search);
  return fetchJson(url);
};

export const getLcoRegisterUserList = async (resellerId, page = 1, limit = 10, search = "") => {
  const url = new URL(`${BASE_URL}/lcoWise/register/userList/${resellerId}`);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  if (search) url.searchParams.append("search", search);
  return fetchJson(url);
};

export const getLcoInActiveUserList = async (resellerId, page = 1, limit = 10, search = "") => {
  const url = new URL(`${BASE_URL}/lcoWise/inActive/userList/${resellerId}`);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  if (search) url.searchParams.append("search", search);
  return fetchJson(url);
};

export const getLcoRenewalUserList = async (resellerId, page = 1, limit = 10, search = "") => {
  const url = new URL(`${BASE_URL}/lcoWise/renewal/userList/${resellerId}`);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  if (search) url.searchParams.append("search", search);
  return fetchJson(url);
};

export const getLcoUpcomingRenewalUserList = async (resellerId, page = 1, limit = 10, search = "") => {
  const url = new URL(`${BASE_URL}/lcoWise/upcomingRenewal/userList/${resellerId}`);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  if (search) url.searchParams.append("search", search);
  return fetchJson(url);
};