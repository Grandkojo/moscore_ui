// API Base URL - In dev, this should point to the FastAPI backend
const API_BASE = import.meta.env.VITE_API_BASE_URL

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("moscore_token")
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "Something went wrong")
  }

  return response.json()
}
