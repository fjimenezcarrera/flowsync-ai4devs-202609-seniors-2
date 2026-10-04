import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que una tarea enseña de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: nombre e iniciales para identificarlo, nada
 * de datos de acceso, y la cuenta sin nombre, que sigue teniendo iniciales.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesion(client: any, fullName: string | null, email = 'ada@example.com') {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace')
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('ni la tarea suelta ni la lista exponen el email del responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace')
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })

    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    // El scenario dice «suelta o dentro de la lista»: son dos respuestas y dos
    // transformers distintos, y cualquiera de los dos puede ser el que filtre.
    const enLista = lista.body().data.find((t: { id: number }) => t.id === task.id)
    for (const assignee of [suelta.body().data.assignee, enLista.assignee]) {
      const serialized = JSON.stringify(assignee)
      assert.notProperty(assignee, 'email')
      assert.notInclude(serialized, 'ada@example.com')
      assert.notInclude(serialized, 'password')
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null)
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.isNull(assignee.fullName)
    assert.equal(assignee.initials, 'AE')
  })
})
