import { API_CONFIG } from '../config/api'

const createUrl = (path) => `${API_CONFIG.baseUrl}${path}`

const parseApiError = async (response) => {
  let message = `Error API (${response.status})`

  try {
    const data = await response.json()

    if (typeof data === 'string') {
      return data
    }

    if (data.detail) {
      return data.detail
    }

    const firstEntry = Object.entries(data || {})[0]
    if (!firstEntry) {
      return message
    }

    const [, value] = firstEntry
    if (Array.isArray(value)) {
      return String(value[0])
    }

    if (typeof value === 'string') {
      return value
    }

    return message
  } catch {
    return message
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
      const message = await parseApiError(response)
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
const apiPatch = async (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body })
const apiDelete = async (path, options = {}) => request(path, { ...options, method: 'DELETE' })

export { apiDelete, apiGet, apiPatch, apiPost }
