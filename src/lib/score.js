import { apiCall } from "./api"

export const scoreService = {
  getHistory: () => apiCall("/score/history", { method: "GET" }),
  getLatest: () => apiCall("/score/me", { method: "GET" }),
  upload: (file) => {
    const formData = new FormData()
    formData.append("file", file)
    return apiCall("/score/upload", {
      method: "POST",
      body: formData,
    })
  }
}
