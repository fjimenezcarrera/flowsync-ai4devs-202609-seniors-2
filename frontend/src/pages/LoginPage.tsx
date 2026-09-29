import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/auth/context'
import { AuthLayout } from '@/components/AuthLayout'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { toFormErrors, validateEmail, type FormErrors } from '@/lib/errors'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)
  // El estado no se refleja hasta el siguiente render: el ref evita un doble envío.
  const inFlight = useRef(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return

    const fields = {
      email: validateEmail(email),
      password: password ? undefined : 'Introduce tu contraseña.',
    }
    if (fields.email || fields.password) {
      setErrors({ fields })
      return
    }

    setErrors({ fields: {} })
    inFlight.current = true
    setSubmitting(true)
    try {
      // Al guardarse el token, <GuestOnly> redirige a la vista protegida.
      await login({ email: email.trim(), password })
    } catch (error) {
      setErrors(toFormErrors(error))
      inFlight.current = false
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Inicia sesión"
      description="Accede con tu email y contraseña."
      error={errors.form}
      footer={
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="font-medium text-foreground underline">
            Regístrate
          </Link>
        </p>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.fields.email}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.fields.password}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
