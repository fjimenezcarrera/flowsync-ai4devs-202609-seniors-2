import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AuthLayoutProps = {
  title: string
  description: string
  /** Error general del formulario (credenciales, red, servidor…). */
  error?: string
  footer: ReactNode
  children: ReactNode
}

export function AuthLayout({
  title,
  description,
  error,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <p className="text-sm font-semibold tracking-tight text-muted-foreground">
            FlowSync
          </p>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          {children}
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      </Card>
    </main>
  )
}
