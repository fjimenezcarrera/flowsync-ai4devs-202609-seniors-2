import { ApiError, NetworkError } from '@/lib/api'

export type FieldErrors = Partial<Record<string, string>>

/** Errores listos para pintar: uno general y otros asociados a cada campo. */
export type FormErrors = {
  form?: string
  fields: FieldErrors
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Reglas de `backend/app/validators/user.ts`. */
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 32

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Introduce tu email.'
  if (!EMAIL_PATTERN.test(email.trim()) || email.length > 254) {
    return 'Introduce un email válido.'
  }
}

export function validateNewPassword(password: string): string | undefined {
  if (password.length < PASSWORD_MIN) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`
  }
  if (password.length > PASSWORD_MAX) {
    return `La contraseña no puede superar los ${PASSWORD_MAX} caracteres.`
  }
}

const FIELD_MESSAGES: Record<string, string> = {
  'email.database.unique': 'Ya existe una cuenta con este email.',
  'email.email': 'Introduce un email válido.',
  'email.required': 'Introduce tu email.',
  'password.required': 'Introduce tu contraseña.',
  'password.minLength': `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`,
  'password.maxLength': `La contraseña no puede superar los ${PASSWORD_MAX} caracteres.`,
  'passwordConfirmation.sameAs': 'Las contraseñas no coinciden.',
}

/** Traduce cualquier error de la capa de API a mensajes en español. */
export function toFormErrors(error: unknown): FormErrors {
  if (error instanceof NetworkError) {
    return {
      form: 'No se pudo conectar con el servidor. Inténtalo de nuevo.',
      fields: {},
    }
  }

  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 401) {
      return { form: 'Email o contraseña incorrectos.', fields: {} }
    }

    if (error.status === 422) {
      const fields: FieldErrors = {}
      for (const item of error.errors) {
        if (!item.field || fields[item.field]) continue
        fields[item.field] =
          FIELD_MESSAGES[`${item.field}.${item.rule}`] ?? item.message
      }
      return Object.keys(fields).length
        ? { fields }
        : { form: 'Revisa los datos del formulario.', fields }
    }

    if (error.status === 429) {
      return {
        form: 'Demasiados intentos. Espera un momento y vuelve a probar.',
        fields: {},
      }
    }
  }

  return {
    form: 'Ha ocurrido un error inesperado. Inténtalo de nuevo.',
    fields: {},
  }
}
