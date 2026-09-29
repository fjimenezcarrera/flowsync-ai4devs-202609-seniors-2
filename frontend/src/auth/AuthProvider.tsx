import { useCallback, useMemo, useState, type ReactNode } from 'react'
import * as api from '@/lib/api'
import type { LoginPayload, SignupPayload } from '@/lib/types'
import { AuthContext } from '@/auth/context'
import { clearToken, readToken, writeToken } from '@/auth/token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)

  const startSession = useCallback((newToken: string) => {
    writeToken(newToken)
    setToken(newToken)
  }, [])

  const clearSession = useCallback(() => {
    clearToken()
    setToken(null)
  }, [])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { token: newToken } = await api.login(payload)
      startSession(newToken)
    },
    [startSession],
  )

  const signup = useCallback(
    async (payload: SignupPayload) => {
      const { token: newToken } = await api.signup(payload)
      startSession(newToken)
    },
    [startSession],
  )

  const logout = useCallback(async () => {
    if (token) {
      try {
        await api.logout(token)
      } catch {
        // Aunque el backend no responda, la sesión local se cierra igual.
      }
    }
    clearSession()
  }, [token, clearSession])

  const value = useMemo(
    () => ({ token, login, signup, logout, clearSession }),
    [token, login, signup, logout, clearSession],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
