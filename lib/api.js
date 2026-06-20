import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // env variable
console.log("API Base:", API_BASE);

export const register = async (data) => {
  const res = await axios.post(`${API_BASE}/register`, data);

  // Store token in localStorage if returned
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_BASE}/login`, data);

  // Store token in localStorage
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API_BASE}/logout`);

  // Remove token from localStorage
  localStorage.removeItem("token");

  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await axios.post(`${API_BASE}/forgot-password`, data);
  return res.data;
};

// Helper function to get token
export const getToken = () => localStorage.getItem("token");

// Helper function to check if user is logged in
export const isLoggedIn = () => !!getToken();
