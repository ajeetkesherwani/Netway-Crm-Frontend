// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const getToken = () => localStorage.getItem("token");

// // =========================
// // 📌 GET CURRENT PLAN
// // =========================
// export const getCurrentPlan = async (userId) => {
//   const res = await fetch(`${BASE_URL}/user/currentPlan/${userId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch current plan");
//   return res.json();
// };

// // =========================
// // 📌 CREATE NEW PLAN
// // =========================
// export const createPurchasedPlan = async (data) => {
//   const res = await fetch(`${BASE_URL}/purchasedPlan/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });

//   const json = await res.json();
//   if (!res.ok) throw new Error(json.message || "Failed to create purchased plan");
//   return json;
// };

// // =========================
// // 📌 RENEW PLAN
// // =========================
// export const renewPurchasedPlan = async (planId, data) => {
//   const res = await fetch(`${BASE_URL}/purchasedPlan/renew/${planId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(data),
//   });

//   const json = await res.json();
//   if (!res.ok) throw new Error(json.message || "Failed to renew plan");
//   return json;
// };

// src/service/recharge.js

const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// GET CURRENT PLAN
export const getCurrentPlan = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/currentPlan/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch current plan");
  return res.json();
};

// CREATE NEW PURCHASED PLAN
export const createPurchasedPlan = async (data) => {
  const res = await fetch(`${BASE_URL}/purchasedPlan/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create purchased plan");
  return json;
};

// RENEW PLAN
export const renewPurchasedPlan = async (planId, data) => {
  const res = await fetch(`${BASE_URL}/purchasedPlan/renew/${planId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to renew plan");
  return json;
};

// GET ASSIGNED PACKAGES (for dropdown)
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