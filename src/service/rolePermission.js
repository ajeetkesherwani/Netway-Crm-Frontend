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
  console.log("roleData", roleData);
  const res = await fetch(`${BASE_URL}/role/permission/${id}`, {
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

export const deleteRoleById = async (roleId) => {
  const res = await fetch(`${BASE_URL}/role/delete/${roleId}`, {
    method: "DELETE", // ✅ DELETE method
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete role");
  }
  return res.json(); // ✅ Return server response (success message, etc.)
};
// Get all package list
export const getAllPackageList = async () => {
  const res = await fetch(`${BASE_URL}/assignPackage/list`, {
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
  const res = await fetch(`${BASE_URL}/assignPackage/create`, {
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
  const res = await fetch(`${BASE_URL}/assignPackage/packageList/${resellerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch assigned packages");
  return res.json();
};

export const updateAssignedPackageStatus = async (packageId, status) => {
  try {
    const res = await fetch(
      `${BASE_URL}/assignPackage/update/status/${packageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!res.ok) throw new Error("Failed to update package status");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating package status:", error);
    throw error;
  }
};
// Get assigned package details
export const getAssignedPackageDetails = async (resellerId, packageId) => {
  const res = await fetch(`${BASE_URL}/assignPackage/packageList/${resellerId}/${packageId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch assigned package details");
  return res.json();
};