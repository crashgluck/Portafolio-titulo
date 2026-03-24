import { API_CONFIG } from '../config/api'

const createUrl = (path) => `${API_CONFIG.baseUrl}${path}`

const request = async (path, options = {}) => {
  // Timeout defensivo para evitar requests colgadas en UI.
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs)

  try {
    const response = await fetch(createUrl(path), {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })

    if (!response.ok) {
      // Se centraliza el error para manejarlo desde features/pages.
      let message = `Error API (${response.status})`
      try {
        const data = await response.json()
        message = data.detail || data.message || message
      } catch {
        // Si no viene JSON, conservamos el mensaje default.
      }
      throw new Error(message)
    }

    if (response.status === 204) {
      return null
    }

    return await response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

const apiGet = async (path, options = {}) => request(path, { ...options, method: 'GET' })
const apiPost = async (path, body, options = {}) => request(path, { ...options, method: 'POST', body })

export { apiGet, apiPost }
