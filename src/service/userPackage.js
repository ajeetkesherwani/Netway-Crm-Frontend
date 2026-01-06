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

export const getAvailablePackagesForUser = async (
  userId,
  { search, page, limit }
) => {
  let url = `${BASE_URL}/userPackage/package/list/${userId}?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url, {
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

// ---------------------- GET USER PACKAGE update ----------------------
export const updateAssignedPackage = async (
  assignedPackageId,
  data
) => {
  const res = await fetch(
    `${BASE_URL}/userPackage/assignPackage/update/${assignedPackageId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        ...(data.customPrice !== undefined && { customPrice: data.customPrice }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.hasOtt !== undefined && { hasOtt: data.hasOtt }),
        ...(data.hasIptv !== undefined && { hasIptv: data.hasIptv }),
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update assigned package");
  }

  return res.json();
};
