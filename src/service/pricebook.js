const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// Get all price books
export const getPriceBookList = async (page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/priceBook/list?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch price books");
  return res.json();
};
// Get price book details
export const getPriceBookDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/priceBook/list/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch price book details");
  return res.json();
};
// Create price book
export const createPriceBook = async (priceBookData) => {
  const res = await fetch(`${BASE_URL}/priceBook/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(priceBookData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create price book");
  return data;
};

// Update price book
export const updatePriceBook = async (id, priceBookData) => {
  const res = await fetch(`${BASE_URL}/priceBook/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(priceBookData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update price book");
  return data;
};
// Delete price book
export const deletePriceBook = async (id) => {
  const res = await fetch(`${BASE_URL}/priceBook/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete price book");
  return res.json();
};

// Get package list
export const getPackageList = async (page = 1, limit = 100, search = "") => {
  const res = await fetch(`${BASE_URL}/package/list?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
};

// Get retailer list
export const getRetailerList = async (page = 1, limit = 100, search = "") => {
  const res = await fetch(`${BASE_URL}/retailer/list?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch retailers");
  return res.json();
};

// Get LCO list
export const getLcoList = async (page = 1, limit = 100, search = "") => {
  const res = await fetch(`${BASE_URL}/lco/list?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch LCOs");
  return res.json();
};

// Get LCO list by reseller
export const getLcoListByReseller = async (resellerId) => {
  const res = await fetch(`${BASE_URL}/retailer/lcoList?resellerId=${resellerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch LCOs for reseller");
  return res.json();
};