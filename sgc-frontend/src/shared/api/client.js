import { API_CONFIG } from '../config/api'

const createUrl = (path) => `${API_CONFIG.baseUrl}${path}`

// NUEVO: Ahora parseApiError devuelve el texto simple Y el objeto completo (rawData)
const parseApiError = async (response) => {
  let message = `Error API (${response.status})`
  let rawData = {}

  try {
    const data = await response.json()
    rawData = data // Guardamos la respuesta intacta de Django aquí

    if (typeof data === 'string') {
      return { message: data, rawData }
    }

    if (data.detail) {
      return { message: data.detail, rawData }
    }

    const firstEntry = Object.entries(data || {})[0]
    if (!firstEntry) {
      return { message, rawData }
    }

    const [, value] = firstEntry
    if (Array.isArray(value)) {
      return { message: String(value[0]), rawData }
    }

    if (typeof value === 'string') {
      return { message: value, rawData }
    }

    return { message, rawData }
  } catch {
    return { message, rawData }
  }
}

const request = async (path, options = {}) => {
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
      // NUEVO: manejar error para sginarlo a su textarea especifco
      const { message, rawData } = await parseApiError(response)
      const error = new Error(message)
      error.fieldErrors = rawData 
      throw error
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
const apiPatch = async (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body })
const apiDelete = async (path, options = {}) => request(path, { ...options, method: 'DELETE' })

export { apiDelete, apiGet, apiPatch, apiPost }