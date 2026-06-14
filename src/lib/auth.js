import { apiCall } from "./api"

export const authService = {
  login: (phone_number) => apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone_number })
  }),
  
  register: (userData) => apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  }),
  
  verify: (phone_number, otp) => apiCall("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ phone_number, otp })
  }),
  
  logout: () => apiCall("/auth/logout", {
    method: "POST"
  })
}
