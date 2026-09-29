import { createContext, useContext } from 'react'
import type { LoginPayload, SignupPayload } from '@/lib/types'

export type AuthContextValue = {
  /** Token opaco del backend; `null` si no hay sesión. */
  token: string | null
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  /** Revoca el token en el backend (si puede) y cierra la sesión local. */
  logout: () => Promise<void>
  /** Cierra la sesión local sin llamar al backend (p. ej. tras un 401). */
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return value
}
