const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

async function fetchJson(url) {
  const res = await fetch(String(url), {
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
 * Fetch LCO wise details.
 * type: 'active'|'register'|'inActive'|'renewal'|'upcomingRenewal'|'details' (or undefined)
 * resellerId: string
 * opts: { filter, month, year, page, limit }
 */
export async function getLcoWiseDetail(type, resellerId, opts = {}) {
    console.log(type, resellerId, opts, 'getLcoWiseDetail params');
  const { filter, month, year, page = 1, limit = 1000 } = opts;
  if (!resellerId) throw new Error("resellerId is required");

  // build path with correct api prefix
  const base = "/api/admin/lcoWise";
  let path;
  if (type && (String(type).toLowerCase() !== "details" && String(type).toLowerCase() !== "register")) {
    const t = String(type).trim();
    path = `${base}/${t}/userList/details/${resellerId}`;
    console.log(path, 'constructed path with type');
  } else {
    path = `${base}/userList/details/${resellerId}`;
  }
  const url = new URL(path, BASE_URL);
  if (filter) url.searchParams.append("filter", filter);
  if (month !== undefined && month !== null) url.searchParams.append("month", String(month));
  if (year !== undefined && year !== null) url.searchParams.append("year", String(year));
  url.searchParams.append("page", String(page));
  url.searchParams.append("limit", String(limit));
  return fetchJson(url);
}
export default { getLcoWiseDetail };