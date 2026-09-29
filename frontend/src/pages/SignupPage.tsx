import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/auth/context'
import { AuthLayout } from '@/components/AuthLayout'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  toFormErrors,
  validateEmail,
  validateNewPassword,
  type FormErrors,
} from '@/lib/errors'

export function SignupPage() {
  const { signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)
  // El estado no se refleja hasta el siguiente render: el ref evita un doble envío.
  const inFlight = useRef(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return

    const fields = {
      email: validateEmail(email),
      password: validateNewPassword(password),
      passwordConfirmation:
        password === passwordConfirmation
          ? undefined
          : 'Las contraseñas no coinciden.',
    }
    if (Object.values(fields).some(Boolean)) {
      setErrors({ fields })
      return
    }

    setErrors({ fields: {} })
    inFlight.current = true
    setSubmitting(true)
    try {
      // Al guardarse el token, <GuestOnly> redirige a la vista protegida.
      await signup({
        fullName: fullName.trim() || null,
        email: email.trim(),
        password,
        passwordConfirmation,
      })
    } catch (error) {
      setErrors(toFormErrors(error))
      inFlight.current = false
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Regístrate para empezar a usar FlowSync."
      error={errors.form}
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-foreground underline">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="fullName"
          label="Nombre (opcional)"
          autoComplete="name"
          autoFocus
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fields.fullName}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.fields.email}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.fields.password}
          hint={`Entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`}
        />
        <FormField
          id="passwordConfirmation"
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          error={errors.fields.passwordConfirmation}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
