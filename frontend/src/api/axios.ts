import axios from "axios";
import { getToken } from "./auth";

console.log("AXIOS FILE LOADED");

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  console.log("INTERCEPTOR RUNNING. TOKEN:", token);

  if (token) {
    config.headers.Authorization = `bearer ${token}`;
  }

  return config;
});