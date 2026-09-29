import { useEffect, useState } from 'react'
import { AlertCircle, LogOut } from 'lucide-react'
import { useAuth } from '@/auth/context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiError, getProfile, NetworkError } from '@/lib/api'
import type { User } from '@/lib/types'

type ProfileState =
  | { status: 'loading' }
  | { status: 'ready'; user: User }
  | { status: 'error'; message: string }

const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' })

export function ProfilePage() {
  const { token, logout, clearSession } = useAuth()
  const [state, setState] = useState<ProfileState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!token) return
    let cancelled = false

    getProfile(token)
      .then((user) => {
        if (!cancelled) setState({ status: 'ready', user })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 401) {
          // Token caducado o revocado: <RequireAuth> redirige a /login.
          clearSession()
          return
        }
        setState({
          status: 'error',
          message:
            error instanceof NetworkError
              ? 'No se pudo conectar con el servidor.'
              : 'No se pudo cargar tu perfil.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [token, attempt, clearSession])

  function retry() {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <p className="text-sm font-semibold tracking-tight text-muted-foreground">
            FlowSync
          </p>
          <CardTitle className="text-xl">Tu perfil</CardTitle>
          <CardDescription>Has iniciado sesión correctamente.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {state.status === 'loading' ? (
            <p className="text-sm text-muted-foreground" role="status">
              Cargando perfil…
            </p>
          ) : state.status === 'error' ? (
            <>
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
              <Button variant="outline" onClick={retry}>
                Reintentar
              </Button>
            </>
          ) : (
            <ProfileDetails user={state.user} />
          )}
          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut />
            {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

function ProfileDetails({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground"
      >
        {user.initials}
      </div>
      <dl className="grid min-w-0 gap-0.5">
        <dt className="sr-only">Nombre</dt>
        <dd className="truncate font-medium">
          {user.fullName ?? 'Sin nombre'}
        </dd>
        <dt className="sr-only">Email</dt>
        <dd className="truncate text-muted-foreground">{user.email}</dd>
        <dt className="sr-only">Alta</dt>
        <dd className="text-xs text-muted-foreground">
          Miembro desde {dateFormatter.format(new Date(user.createdAt))}
        </dd>
      </dl>
    </div>
  )
}
