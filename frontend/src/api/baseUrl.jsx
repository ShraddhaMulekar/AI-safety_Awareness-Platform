export const API_URL = "http://localhost:5000" || "https://ai-safety-awareness-platform.onrender.com"


export const fetchAPI = async (url, Options = {}) => {
  const token = localStorage.getItem("token")
  const headers = {
    ...(Options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(API_URL + url, {
    ...Options,
    headers,
  })
  const data = await res.json().catch(() => ({}));
  return { ...data, status: res.status, ok: data?.ok ?? res.ok };
}