import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '@/auth/context'

/** Solo deja pasar con sesión; si no, manda a /login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

/** Login y registro: si ya hay sesión, no tiene sentido mostrarlos. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  return token ? <Navigate to="/" replace /> : children
}
