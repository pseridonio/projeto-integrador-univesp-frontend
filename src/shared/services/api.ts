import axios, { AxiosInstance } from "axios";

const base = import.meta.env.VITE_API_BASE_URL ?? "";

const api: AxiosInstance = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function apiGet<T = any>(url: string): Promise<T> {
  const res = await api.get(url);
  return res.data as T;
}

export default api;
