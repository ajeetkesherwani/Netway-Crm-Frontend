const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getCustomerBalanceReport = async (page = 1, limit = 10, searchTerm = "") => {
  try {
    const url = new URL(`${BASE_URL}/api/admin/misReport/customerBalanceReport`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (searchTerm) url.searchParams.append("search", searchTerm);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch customer balance report");
    return await res.json();
  } catch (error) {
    console.error("Error fetching customer balance report:", error);
    throw error;
  }
};

export const getCustomerUpdateHistory = async (page = 1, limit = 10, searchTerm = "") => {
  try {
    const url = new URL(`${BASE_URL}/customerUpdateHistory`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (searchTerm) url.searchParams.append("search", searchTerm);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch customer update history");
    return await res.json();
  } catch (error) {
    console.error("Error fetching customer update history:", error);
    throw error;
  }
};

export const getUpcomingRenewalByDays = async (page = 1, limit = 50, searchTerm = "") => {
  try {
    const url = new URL(`${BASE_URL}/misReport/upcomingRenewalByDays`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (searchTerm) url.searchParams.append("search", searchTerm);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch upcoming renewals");
    return await res.json();
  } catch (error) {
    console.error("Error fetching upcoming renewals:", error);
    throw error;
  }
};

export const getUpcomingRenewalByMonth = async (searchTerm = "") => {
  try {
    const url = new URL(`${BASE_URL}/misReport/upcomingRenewalByMonth`);
    if (searchTerm) url.searchParams.append("search", searchTerm);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch upcoming renewals by month");
    return await res.json();
  } catch (error) {
    console.error("Error fetching upcoming renewals by month:", error);
    throw error;
  }
};