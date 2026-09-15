import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://160.187.87.138:3435';

const apiHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
};

// Get reseller-wise user list for a specific type
export const getResellerWiseUserList = async (type) => {
  const res = await fetch(`${BASE_URL}/resellerWise/${type}/userList`, {
    method: "GET",
    headers: apiHeaders,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Failed to fetch reseller-wise ${type} user list`);
  return data;
};