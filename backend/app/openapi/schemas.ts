import { TASK_STATUSES } from '#models/task'
import { ApiProperty, ApiPropertyOptional } from '@foadonis/openapi/decorators'

/**
 * Esquemas OpenAPI de la capability `tasks`.
 *
 * Cada clase se publica una sola vez en `components.schemas`, con su nombre, y
 * las operaciones la referencian con `$ref`. Describen lo que el código ya
 * devuelve —los transformers de `app/transformers/` y los errores del framework—,
 * no lo que debería devolver: si un día difieren, manda el código y hay que
 * corregir esto.
 *
 * Son solo forma: nadie las instancia ni valida con ellas. La validación vive en
 * `app/validators/task.ts`.
 */

const dateTime = { type: 'string', format: 'date-time' } as const
const calendarDay = { type: 'string', format: 'date', example: '2026-10-08' } as const

/**
 * El responsable tal y como sale junto a una tarea (`TaskAssigneeTransformer`):
 * nombre e iniciales, y ningún otro dato de la cuenta.
 */
export class TaskAssignee {
  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Nulo si la cuenta se registró sin nombre.',
  })
  declare fullName: string | null

  @ApiProperty({ type: 'string', example: 'AL' })
  declare initials: string
}

/**
 * Una tarea tal y como sale en la lista, en la creación y en el cambio de estado
 * (`TaskTransformer`). No lleva vencimiento, a propósito.
 */
export class Task {
  @ApiProperty({ type: 'integer' })
  declare id: number

  @ApiProperty({ type: 'string', minLength: 1, maxLength: 200 })
  declare title: string

  @ApiProperty({ enum: [...TASK_STATUSES] })
  declare status: string

  @ApiProperty({ type: TaskAssignee })
  declare assignee: TaskAssignee

  @ApiProperty({ schema: dateTime })
  declare createdAt: string

  @ApiProperty({ schema: dateTime, nullable: true })
  declare updatedAt: string | null
}

/**
 * Una tarea suelta (`TaskDetailTransformer`): lo mismo que `Task`, más su fecha
 * de vencimiento y su condición de vencida resuelta contra el `today` de la
 * petición.
 */
export class TaskDetail extends Task {
  @ApiProperty({
    schema: calendarDay,
    nullable: true,
    description: 'Día del calendario, sin hora. Nulo si la tarea no tiene fecha.',
  })
  declare dueDate: string | null

  @ApiProperty({
    type: 'boolean',
    description:
      'Verdadero si hay fecha, es anterior al `today` de la petición y la tarea no está hecha.',
  })
  declare isOverdue: boolean
}

/** `{ data }` con una tarea, como la envuelve `serialize()`. */
export class TaskResponse {
  @ApiProperty({ type: Task })
  declare data: Task
}

/** `{ data }` con la lista entera, sin paginar. */
export class TaskListResponse {
  @ApiProperty({ type: [Task] })
  declare data: Task[]
}

/** `{ data }` con una tarea suelta. */
export class TaskDetailResponse {
  @ApiProperty({ type: TaskDetail })
  declare data: TaskDetail
}

/** Cuerpo de `POST /tasks`. Cualquier otro campo se ignora. */
export class CreateTaskBody {
  @ApiProperty({
    type: 'string',
    minLength: 1,
    maxLength: 200,
    description:
      'Se recortan los espacios de los extremos antes de validar la longitud. Responsable, estado y fecha no se aceptan: los pone el sistema.',
  })
  declare title: string
}

/** Cuerpo de `PATCH /tasks/:id/status`. */
export class UpdateTaskStatusBody {
  @ApiProperty({ enum: [...TASK_STATUSES] })
  declare status: string
}

/** Cuerpo de `PUT /tasks/:id/due-date`. */
export class SetTaskDueDateBody {
  @ApiProperty({
    schema: calendarDay,
    description: 'Día de referencia de quien pide, para resolver `isOverdue` en la respuesta.',
  })
  declare today: string

  @ApiProperty({
    schema: calendarDay,
    nullable: true,
    description: '`null` retira la fecha.',
  })
  declare dueDate: string | null
}

/** Un error de validación de VineJS. */
export class ValidationError {
  @ApiProperty({ type: 'string' })
  declare message: string

  @ApiProperty({ type: 'string', example: 'required' })
  declare rule: string

  @ApiProperty({ type: 'string', example: 'title' })
  declare field: string

  @ApiPropertyOptional({ type: 'object', description: 'Datos extra de la regla, como `choices`.' })
  declare meta?: Record<string, unknown>
}

/** `422`: los errores de validación, uno por regla incumplida. */
export class ValidationErrorResponse {
  @ApiProperty({ type: [ValidationError] })
  declare errors: ValidationError[]
}

/** Un error sin campo asociado. */
export class ErrorMessage {
  @ApiProperty({ type: 'string', example: 'Unauthorized access' })
  declare message: string
}

/** `401`: falta el token o no es válido. */
export class UnauthorizedResponse {
  @ApiProperty({ type: [ErrorMessage] })
  declare errors: ErrorMessage[]
}

/**
 * `404`: la tarea no existe. Fuera de producción el framework añade al cuerpo
 * la traza del error; `message` está siempre.
 */
export class NotFoundResponse {
  @ApiProperty({ type: 'string', example: 'Row not found' })
  declare message: string
}
