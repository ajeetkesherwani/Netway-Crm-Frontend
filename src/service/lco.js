const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// Get all role list
export const getAllRoleList = async () => {
  const res = await fetch(`${BASE_URL}/role/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
};

// Create role
export const createRole = async (roleData) => {
  const res = await fetch(`${BASE_URL}/role/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(roleData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create role");
  return data;
};

// Get role details
export const getRoleDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/role/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch role details");
  return res.json();
};

// Update role
export const updateRole = async (id, roleData) => {
  const res = await fetch(`${BASE_URL}/role/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(roleData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update role");
  return data;
};

// Get all package list
export const getAllPackageList = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/assignPackage/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
};

// Assign package to reseller
export const assignPackageToReseller = async (packageData) => {
  const res = await fetch(`${BASE_URL}/api/admin/assignPackage/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(packageData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to assign packages");
  return data;
};

// Get assigned package list for a reseller
export const getAssignedPackageList = async (resellerId) => {
  const res = await fetch(`${BASE_URL}/api/admin/assignPackage/list/${resellerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch assigned packages");
  return res.json();
};

// Get assigned package details
export const getAssignedPackageDetails = async (resellerId, packageId) => {
  const res = await fetch(`${BASE_URL}/api/admin/assignPackage/${resellerId}/${packageId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch assigned package details");
  return res.json();
};

// Get all LCOs
export const getAllLco = async () => {
  const res = await fetch(`${BASE_URL}/lco/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch LCOs");
  return res.json();
};

// Get LCO details
export const getLcoDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/lco/list/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch LCO details");
  return res.json();
};

// Create LCO
export const createLco = async (lco) => {
  const res = await fetch(`${BASE_URL}/lco/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(lco),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create LCO");
  return data;
};

// Update Lco
export const updateLco = async (id, lco) => {
  const res = await fetch(`${BASE_URL}/lco/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(lco),
  });
  if (!res.ok) throw new Error("Failed to update retailer");
  return res.json();
};
// Delete Lco
export const deleteLco = async (id) => {
  const res = await fetch(`${BASE_URL}/lco/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete retailer");
  return res.json();
};


// Get all resellers
export const getAllResellers = async () => {
  const res = await fetch(`${BASE_URL}/reseller/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch resellers");
  return res.json();
};

// Get LCO wallet transactions list
export const getLcoWalletList = async (lcoId, page = 1, limit = 10, search = "") => {
  const res = await fetch(`${BASE_URL}/lcoWallet/list/${lcoId}?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch wallet transactions");
  return res.json();
};

// Create LCO wallet transaction
export const createLcoWalletTransaction = async (transactionData) => {
  const res = await fetch(`${BASE_URL}/lcoWallet/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(transactionData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create transaction");
  return data;
};

// Get LCO wallet transaction details
export const getLcoWalletDetails = async (lcoId, transactionId) => {
  const res = await fetch(`${BASE_URL}/lcoWallet/list/${lcoId}/${transactionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch transaction details");
  return res.json();
};

// Update LCO wallet transaction
export const updateLcoWalletTransaction = async (transactionId, transactionData) => {
  const res = await fetch(`${BASE_URL}/lcoWallet/${transactionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(transactionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update transaction");
  return data;
};