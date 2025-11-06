
const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");
export const getLcoBalanceTransferReport = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/franchiseeReport/lcoBalanceTransfer?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch LCO balance transfer report");
  return data;
};

export const getLcoTransactionHistoryReport = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/franchiseeReport/lcoTransactionHistory?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch LCO transaction history report");
  return data;
};

export const getOnlineTransactionReport = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/franchiseeReport/onlineTransaction?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch online transaction report");
  return data;
};

export const getResellerTransferBalanceReport = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/franchiseeReport/resellerTransferBalance?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch reseller transfer balance report");
  return data;
};