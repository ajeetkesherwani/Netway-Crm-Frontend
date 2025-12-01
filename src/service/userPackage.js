const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");


// ---------------------- ASSIGN PACKAGE ----------------------
export const assignPackageToUser = async (userId, payload) => {
  const res = await fetch(`${BASE_URL}/userPackage/assign/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to assign package");
  return res.json();
};

// ---------------------- GET ASSIGNED PACKAGE LIST ----------------------
export const getAssignedPackageList = async (userId) => {
  const res = await fetch(`${BASE_URL}/userPackage/assign/list/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch assigned packages");
  return res.json();
};

// ---------------------- UPDATE PACKAGE STATUS ----------------------
export const updateUserPackageStatus = async (packageId, status) => {
  const res = await fetch(`${BASE_URL}/userPackage/update/${packageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status }), // status string directly
  });

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

// ---------------------- GET ALL PACKAGES LIST ----------------------

export const getAvailablePackagesForUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/userPackage/package/list/${userId}`, {
   
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch available packages");
  return res.json();
};

// ---------------------- DELETE ASSIGNED PACKAGE ----------------------
export const deleteAssignedPackage = async (packageId) => {
  const res = await fetch(`${BASE_URL}/userPackage/delete/${packageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete assigned package");
  return res.json();
};