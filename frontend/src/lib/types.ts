/** Usuario tal y como lo devuelve `UserTransformer` en el backend. */
export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
  createdAt: string
  updatedAt: string | null
}

export type AuthResponse = {
  user: User
  token: string
}

export type SignupPayload = {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginPayload = {
  email: string
  password: string
}

/** Error individual del cuerpo `{ errors: [...] }` (VineJS y excepciones de AdonisJS). */
export type ApiErrorItem = {
  message: string
  field?: string
  rule?: string
  code?: string
}
