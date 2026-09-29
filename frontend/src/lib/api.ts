import type {
  ApiErrorItem,
  AuthResponse,
  LoginPayload,
  SignupPayload,
  User,
} from '@/lib/types'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3333'
).replace(/\/$/, '')

/** El backend respondió con un estado no 2xx. */
export class ApiError extends Error {
  readonly status: number
  readonly errors: ApiErrorItem[]

  constructor(status: number, errors: ApiErrorItem[]) {
    super(errors[0]?.message ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

/** No se pudo llegar al backend (caído, sin red, CORS…). */
export class NetworkError extends Error {
  constructor() {
    super('Network request failed')
    this.name = 'NetworkError'
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
}

async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new NetworkError()
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const errors = Array.isArray(payload?.errors) ? payload.errors : []
    throw new ApiError(response.status, errors)
  }

  return payload?.data as T
}

export function signup(payload: SignupPayload) {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: payload,
  })
}

export function login(payload: LoginPayload) {
  return request<AuthResponse>('/auth/login', { method: 'POST', body: payload })
}

export function getProfile(token: string) {
  return request<User>('/account/profile', { token })
}

export function logout(token: string) {
  return request<unknown>('/account/logout', { method: 'POST', token })
}
