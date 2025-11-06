// services/employee.js

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// Get all employees for a retailer
export const getLcoEmployees = async (retailerId) => {
  const res = await fetch(`${BASE_URL}/lco/employee/${retailerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
};



export const addLcoEmployee = async (retailerId, employeeData) => {
  const res = await fetch(`${BASE_URL}/lco/addEmployee/${retailerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ employee: employeeData }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add employee");
  return data;
};
// Get employee details
export const getLcoEmployeeDetails = async (retailerId, employeeId) => {
  const res = await fetch(`${BASE_URL}/lco/employee/${retailerId}/${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch employee details");
  return res.json();
};
// Update employee
export const updateLcoEmployee = async (retailerId, employeeId, employeeData) => {
  const res = await fetch(`${BASE_URL}/lco/update/employee/${retailerId}/${employeeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(employeeData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update employee");
  return data;
};
// Delete employee
export const deleteLcoEmployee = async (retailerId, employeeId) => {
  const res = await fetch(`${BASE_URL}/lco/delete/employee/${retailerId}/${employeeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete employee");
  return data;
};


