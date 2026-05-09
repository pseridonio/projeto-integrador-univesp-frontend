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

export async function getCurrentUser<T = any>(): Promise<T> {
  const res = await api.get<T>("/users/me");
  const data: any = res.data;
  if (data && typeof data === "object") return (data.data ?? data) as T;
  return data as T;
}

export async function getComandas<T = any>(): Promise<T> {
  const res = await api.get<T>("/comandas");
  const data: any = res.data;
  if (typeof data === "string") {
    // dev server fallback returned index.html — treat as empty list
    if (data.toLowerCase().includes("<!doctype html>")) return ([] as unknown) as T;
  }
  if (Array.isArray(data)) return data as unknown as T;
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data as unknown as T;
  return data as T;
}

export async function createComanda<T = any>(payload: any): Promise<T> {
  const res = await api.post<T>("/comandas", payload);
  return res.data as T;
}

export async function updateComanda<T = any>(id: number | string, payload: any): Promise<T> {
  const res = await api.put<T>(`/comandas/${id}`, payload);
  return res.data as T;
}

export async function getProducts<T = any>(): Promise<T> {
  const res = await api.get<T>("/products");
  const data: any = res.data;
  if (typeof data === "string") {
    if (data.toLowerCase().includes("<!doctype html>")) return ([] as unknown) as T;
  }
  if (Array.isArray(data)) return data as unknown as T;
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data as unknown as T;
  return data as T;
}

export async function getCategories<T = any>(): Promise<T> {
  const res = await api.get<T>("/categories");
  const data: any = res.data;
  if (typeof data === "string") {
    if (data.toLowerCase().includes("<!doctype html>")) return ([] as unknown) as T;
  }
  // If backend returns array of strings, convert to objects
  if (Array.isArray(data)) {
    if (data.length === 0) return data as unknown as T;
    if (typeof data[0] === 'string') {
      return data.map((name: string) => ({ name, subcategories: [] })) as unknown as T;
    }
    return data as unknown as T;
  }
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data as unknown as T;
  return data as T;
}

export async function createProduct<T = any>(payload: any): Promise<T> {
  const res = await api.post<T>("/products", payload);
  return res.data as T;
}

export async function updateProduct<T = any>(id: number | string, payload: any): Promise<T> {
  const res = await api.put<T>(`/products/${id}`, payload);
  return res.data as T;
}

export async function deleteProduct<T = any>(id: number | string): Promise<T> {
  const res = await api.delete<T>(`/products/${id}`);
  return res.data as T;
}

export default api;
