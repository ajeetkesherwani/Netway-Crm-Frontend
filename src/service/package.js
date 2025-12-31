const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

//get all package list
export const getAllPackageList = async () => {
  const res = await fetch(`${BASE_URL}/package/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch package");
  return res.json();
 
};

// Create package
export const createPackage = async (packages) => {
  const res = await fetch(`${BASE_URL}/package/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(packages),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create package");
  return data;
};

// get packageDetails
export const getPackageDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/package/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch package Details");
  return res.json();
};

// Update package
export const updatePackage = async (id, packageData) => {
  const res = await fetch(`${BASE_URL}/package/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(packageData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update package");
  return data;
};


//get ott package list
export const getOttPackageList = async () => {
  const res = await fetch(`${BASE_URL}/common/filterPackage/list?type=ott`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch OTT packages");
  }

  return res.json();
};


//get iptv package list
export const getIptvPackageList = async () => {
  const res = await fetch(`${BASE_URL}/common/filterPackage/list?type=iptv`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch IPTV packages");
  }

  return res.json();
};