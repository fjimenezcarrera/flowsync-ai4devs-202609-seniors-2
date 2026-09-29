import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormFieldProps = ComponentProps<typeof Input> & {
  id: string
  label: string
  error?: string
  hint?: string
}

/** Label + Input + mensaje de error accesible (aria-invalid / aria-describedby). */
export function FormField({
  id,
  label,
  error,
  hint,
  ...props
}: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
