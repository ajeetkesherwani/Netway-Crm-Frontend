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

async function callEndpoint(path, page = 1, limit = 10, searchField = "", searchValue = "") {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  if (searchField) url.searchParams.append("searchField", searchField);
  if (searchValue) url.searchParams.append("searchValue", searchValue);
  return fetchJson(url);
}

export const getOpenTicket = (page, limit, searchField, searchValue) =>
  callEndpoint("/ticketReport/openTicket", page, limit, searchField, searchValue);

export const getCloseTicket = (page, limit, searchField, searchValue) =>
  callEndpoint("/ticketReport/closeTicket", page, limit, searchField, searchValue);

export const getFixedTicket = (page, limit, searchField, searchValue) =>
  callEndpoint("/ticketReport/fixedTicket", page, limit, searchField, searchValue);

export const getAssignedTicket = (page, limit, searchField, searchValue) =>
  callEndpoint("/ticketReport/assignedTicket", page, limit, searchField, searchValue);

export const getNonAssignedTicket = (page, limit, searchField, searchValue) =>
  callEndpoint("/ticketReport/nonAssignedTicket", page, limit, searchField, searchValue);

export const getResolvedTicket = (page, limit, searchField, searchValue) =>
  callEndpoint("/ticketReport/resolvedTicket", page, limit, searchField, searchValue);