import { API_CONFIG } from '../config/api'

const createUrl = (path) => `${API_CONFIG.baseUrl}${path}`

const apiGet = async (path) => {
  // Timeout defensivo para evitar requests colgadas en UI.
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs)

  try {
    const response = await fetch(createUrl(path), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      // Se centraliza el error para manejarlo desde features/pages.
      throw new Error(`Error API (${response.status})`)
    }

    return await response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

export { apiGet }
