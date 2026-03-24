import { AUTH_STORAGE_KEY } from './auth.constants'

const loadAuthSession = () => {
  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

const saveAuthSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export { clearAuthSession, loadAuthSession, saveAuthSession }
