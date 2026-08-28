import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const hadToken = !!error.config?.headers?.Authorization
    if ((status === 401 || status === 403) && hadToken) {
      useAuthStore.getState().expireSession()
    }
    return Promise.reject(error)
  }
)

export interface BackendError {
  timestamp: string
  status: number
  error: string
  message: string
  details?: string[]
}

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError<BackendError>(err)) {
    const data = err.response?.data
    if (data?.message) return data.message
    if (err.message) return err.message
  }
  if (err instanceof Error) return err.message
  return 'Ismeretlen hiba történt'
}
