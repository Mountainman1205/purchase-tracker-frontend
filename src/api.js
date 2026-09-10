import { getInitData } from "./telegram";

// В проде задайте адрес бэкенда через .env: VITE_API_URL=https://your-api.com
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": getInitData(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function uploadReceipt(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/purchases/from-receipt`, {
    method: "POST",
    headers: {
      "X-Telegram-Init-Data": getInitData(),
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  getCategories: () => request("/api/categories"),
  createCategory: (data) =>
    request("/api/categories", { method: "POST", body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: "DELETE" }),

  getPurchases: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/purchases${qs ? `?${qs}` : ""}`);
  },
  createPurchase: (data) =>
    request("/api/purchases", { method: "POST", body: JSON.stringify(data) }),
  deletePurchase: (id) => request(`/api/purchases/${id}`, { method: "DELETE" }),

  getBudgets: () => request("/api/budgets"),
  getBudgetsStatus: () => request("/api/budgets/status"),
  createBudget: (data) =>
    request("/api/budgets", { method: "POST", body: JSON.stringify(data) }),
  deleteBudget: (id) => request(`/api/budgets/${id}`, { method: "DELETE" }),

  getStatsSummary: () => request("/api/stats/summary"),

  uploadReceipt,
};
