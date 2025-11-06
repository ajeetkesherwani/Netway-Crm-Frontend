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

/**
 * type: one of 'register' | 'active' | 'inActive' | 'renewal' | 'upcomingRenewal'
 * resellerId: string
 * filter: 'day' | 'week' | 'month'
 * month: number (1-12) optional
 * year: number optional
 * page, limit, search: optional
 */
export const getResellerWiseUserList = async (
  type,
  resellerId,
  { filter = "day", month, year, page = 1, limit = 50, search = "" } = {}
) => {
  const endpoint = `${BASE_URL}/resellerWise/${type}/userList/${resellerId}`;
  const url = new URL(endpoint);
  url.searchParams.append("filter", filter);
  if (month) url.searchParams.append("month", month);
  if (year) url.searchParams.append("year", year);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  if (search) url.searchParams.append("search", search);
  return fetchJson(url);
};