// src/api/auth.js
import axios from "./axiosInstance";

export const login = (email, password) =>
  axios.post("/auth/login", { email, password });

export const register = (userData) => axios.post("/auth/register", userData);

export const getProfile = () => axios.get("/auth/profile");

export const logout = () => {
  localStorage.removeItem("token");
};
