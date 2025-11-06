// src/api/dashboardApi.js
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://192.168.1.13:5004';

const apiHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};
export const getUserList = async (type, filter, month, year) => {
  let url = `${BASE_URL}/dashboard/${type}/userList?filter=${filter}&year=${year}`;
  if (month) url += `&month=${month}`;
  const res = await fetch(url, {
    method: "GET",
    headers: apiHeaders,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Failed to fetch ${type} user list for ${filter}`);
  return data;
};
export const getAllType = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/allType/userList`, {
    method: "GET",
    headers: apiHeaders,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch all type user list");
  return data;
};

// this is for the use list details
export const getUserListDetails = async (type, filter, month, year) => {
  let url = `${BASE_URL}/dashboard/${type}/userList/details?filter=${filter}&year=${year}`;
  if (month) url += `&month=${month}`;
  const res = await fetch(url, {
    method: "GET",
    headers: apiHeaders,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Failed to fetch ${type} user list for ${filter}`);
  return data;
};