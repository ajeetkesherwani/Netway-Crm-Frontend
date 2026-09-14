const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const getExpensesCategories = async (search = "") => {
  const res = await fetch(`${BASE_URL}/admin/expensesCategory/list?search=${encodeURIComponent(search)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
  return data;
};

export const createExpensesCategory = async (payload) => {
  const res = await fetch(`${BASE_URL}/admin/expensesCategory/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create category");
  return data;
};

export const updateExpensesCategory = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/admin/expensesCategory/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update category");
  return data;
};

export const deleteExpensesCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/expensesCategory/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete category");
  return data;
};
