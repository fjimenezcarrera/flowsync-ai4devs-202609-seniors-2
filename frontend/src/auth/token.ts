const TOKEN_KEY = 'flowsync.token'

// localStorage puede lanzar (modo privado, almacenamiento bloqueado): en ese
// caso la sesión simplemente no persiste entre recargas.

export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function writeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Ignorado: ver comentario superior.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Ignorado: ver comentario superior.
  }
}
