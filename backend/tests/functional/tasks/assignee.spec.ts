import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable se identifica por nombre e
 * iniciales, no se filtra ningún otro dato de su cuenta, y una cuenta sin
 * nombre sigue llegando con iniciales.
 *
 * Las tareas se crean directamente con el modelo y no por `POST /tasks`: lo que
 * se prueba aquí es cómo sale el responsable, y que una creación rota tumbe
 * también estos tests solo enturbiaría el diagnóstico.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  /**
   * El día de referencia que exigen la consulta de una tarea suelta y el cambio
   * de fecha. Su valor no importa aquí: lo que se mira es el responsable, y la
   * única fecha que se fija es este mismo día, para no depender de ninguna
   * regla sobre fechas pasadas o futuras.
   */
  const today = '2026-10-08'

  async function sesion(client: any, email: string, fullName: string | null) {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  async function tareaDe(user: User) {
    return Task.create({ title: 'Revisar el informe', status: 'pending', assigneeId: user.id })
  }

  /**
   * La tarea `id` dentro del cuerpo de `GET /tasks`. El registro generado tipa
   * `data` como objeto o array, así que se fija aquí la forma de la lista. Que
   * la tarea no esté ya es un fallo en sí mismo.
   */
  function enLaLista(body: { data: unknown }, id: number) {
    const tasks = body.data as Array<{ id: number; assignee: Record<string, unknown> }>
    const task = tasks.find((t) => t.id === id)
    if (!task) throw new Error(`la tarea ${id} no aparece en la lista`)
    return task
  }

  test('el responsable se identifica por su nombre y sus iniciales', async ({ client, assert }) => {
    const ada = await sesion(client, 'ada@example.com', 'Ada Lovelace')
    // Quien mira es otra cuenta: el responsable tiene que ser el de la tarea,
    // no el de la sesión.
    const alan = await sesion(client, 'alan@example.com', 'Alan Turing')
    const task = await tareaDe(ada.user)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${alan.token}`)
    lista.assertStatus(200)

    const enLista = enLaLista(lista.body(), task.id)
    assert.equal(enLista.assignee.fullName, 'Ada Lovelace')
    assert.equal(enLista.assignee.initials, 'AL')

    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today })
      .header('Authorization', `Bearer ${alan.token}`)
    suelta.assertStatus(200)

    assert.equal(suelta.body().data.assignee.fullName, 'Ada Lovelace')
    assert.equal(suelta.body().data.assignee.initials, 'AL')
  })

  test('la tarea no filtra el email ni otros datos de la cuenta del responsable', async ({
    client,
    assert,
  }) => {
    const ada = await sesion(client, 'ada@example.com', 'Ada Lovelace')
    const task = await tareaDe(ada.user)
    const auth = `Bearer ${ada.token}`

    // «Cualquier tarea, suelta o dentro de la lista»: se recorre toda respuesta
    // que devuelve una tarea, porque basta con que una sola se escape.
    const lista = await client.get('/api/v1/tasks').header('Authorization', auth)
    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today })
      .header('Authorization', auth)
    const creada = await client
      .post('/api/v1/tasks')
      .json({ title: 'Otra tarea' })
      .header('Authorization', auth)
    const conEstado = await client
      .patch(`/api/v1/tasks/${task.id}/status`)
      .json({ status: 'in_progress' })
      .header('Authorization', auth)
    const conFecha = await client
      .put(`/api/v1/tasks/${task.id}/due-date`)
      .json({ today, dueDate: today })
      .header('Authorization', auth)

    const respuestas = {
      'GET /tasks': lista,
      'GET /tasks/:id': suelta,
      'POST /tasks': creada,
      'PATCH /tasks/:id/status': conEstado,
      'PUT /tasks/:id/due-date': conFecha,
    }

    for (const [ruta, response] of Object.entries(respuestas)) {
      assert.oneOf(response.status(), [200, 201], `${ruta} no respondió con éxito`)
    }

    const assigneeDe = (body: any) =>
      Array.isArray(body.data) ? enLaLista(body, task.id).assignee : body.data.assignee

    // Una sola comparación con todas las rutas a la vez: si falla, el diff dice
    // de golpe cuáles se escapan, en vez de pararse en la primera.
    const camposPorRuta = Object.fromEntries(
      Object.entries(respuestas).map(([ruta, response]) => [
        ruta,
        Object.keys(assigneeDe(response.body())).sort(),
      ])
    )
    // La spec pide «el nombre y las iniciales» y ningún otro dato de la cuenta:
    // el `id` de la cuenta también es otro dato, así que tampoco se admite.
    const permitidos = ['fullName', 'initials']

    assert.deepEqual(
      camposPorRuta,
      Object.fromEntries(Object.keys(respuestas).map((ruta) => [ruta, permitidos]))
    )

    // Y por si el email se cuela con otro nombre de campo.
    for (const [ruta, response] of Object.entries(respuestas)) {
      const serialized = JSON.stringify(assigneeDe(response.body()))
      assert.notInclude(serialized, 'ada@example.com', `${ruta} expone el email`)
      assert.notInclude(serialized, 'secreto123', `${ruta} expone la contraseña`)
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const anonima = await sesion(client, 'ada@example.com', null)
    const task = await tareaDe(anonima.user)
    const auth = `Bearer ${anonima.token}`

    const lista = await client.get('/api/v1/tasks').header('Authorization', auth)
    lista.assertStatus(200)

    const enLista = enLaLista(lista.body(), task.id)
    assert.isNull(enLista.assignee.fullName)
    // La spec solo pide que las iniciales sigan llegando; cómo se derivan ya lo
    // cubre `tests/functional/auth/initials.spec.ts`.
    assert.isString(enLista.assignee.initials)
    assert.isNotEmpty(enLista.assignee.initials)

    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today })
      .header('Authorization', auth)
    suelta.assertStatus(200)

    assert.isNull(suelta.body().data.assignee.fullName)
    assert.isString(suelta.body().data.assignee.initials)
    assert.isNotEmpty(suelta.body().data.assignee.initials)
  })
})
