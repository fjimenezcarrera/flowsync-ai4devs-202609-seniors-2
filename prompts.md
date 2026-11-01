# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Ha creado el endpoint en route.ts, en task_controllers.ts está la doc, nuevo test delete.spect.test y readme actualizado, todo en una nueva rama feat/delete-task (comprobación manual)


## Prompt 2

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿quedó declarada la ruta DELETE?
```

**Qué salió:** SI (node ace list:routes)

## Prompt 3

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** SI (grep)

## Prompt 4

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Ha creado el endpoint en route.ts, en task_controllers.ts está la doc, nuevo test delete.spect.test y readme actualizado, todo en una nueva rama feat/delete-task-2 (comprobación manual)


## Prompt 5

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿quedó declarada la ruta DELETE?
```

**Qué salió:** SI (node ace list:routes)

## Prompt 6

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** SI, "Una carencia: la guía «A mano, contra el servidor real» no tiene ningún curl de borrado. Si quieres, lo añado."

## Prompt 7

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Ha creado el endpoint en route.ts, en task_controllers.ts está la doc  y readme actualizado, cambios sin comitear en una nueva rama tasks-delete (comprobación manual).
 - *no ha creado test* y lo reconoce el mismo -> "No añadí test propio para el endpoint (la capability tasks sigue sin ninguno), así que solo lo verifiqué a mano."
 - "Aún no he commiteado. Tampoco he abierto PR ni pasado el adversarial-reviewer, que según CLAUDE.md van al terminar la unidad de trabajo. ¿Hago el commit con /commit?"
 - Readme modificado, pero advierte -> "La spec en openspec/specs/tasks/spec.md no cubre el borrado de tareas, y el README dice que manda la spec. Si quieres que quede como requisito, falta añadirlo."
 - Ha modificado más ficheros que antes tree.d.ts, schema.d.ts e index.ts


## Prompt 8

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿quedó declarada la ruta DELETE?
```

**Qué salió:** SI (node ace list:routes)

## Prompt 9

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** SI, "Lo que no toqué es la tabla "Reglas de negocio: dónde vive cada una". No añadí fila para el borrado porque esa tabla enlaza cada regla con un requisito de la spec, y la spec no tiene ninguno sobre borrar tareas."


## Prompt 10

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿qué son y por qué has modificado los ficheros tree.d.ts, schema.d.ts e index.ts que estan en backend/.adonisjs/client/registry?
```

**Qué salió:** "Yo no los edité. Los regeneró AdonisJS al arrancar node ace serve para probar el endpoint, y los dejé tal cual porque CLAUDE.md pide commitear ese diff."

## Prompt 11

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Ve que hay otras ramas y pregunta que hacer (le he dicho que cree otra nueva), luego pregunta por hacer /commit y le digo que si.
"Según el CLAUDE.md, el PR y el pase de adversarial-reviewer van una sola vez, al terminar la unidad de trabajo, y no los he lanzado. Cuando des la unidad por cerrada, los hago." -> no hago nada

Crea los cambios en feat/delete-task-v2, no ha creado tests, modifica task_controller.ts, routes.ts y readme (comprobación manual)
 - "Spec de tasks: openspec/specs/tasks/spec.md no tiene ningún requisito de borrado, así que el endpoint no está respaldado por la spec. Tampoco lo he añadido."


## Prompt 12

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿quedó declarada la ruta DELETE?
```

**Qué salió:** SI (node ace list:routes)

## Prompt 13

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** SI, "La tabla «Reglas de negocio» no tiene fila para el borrado. Es porque la spec no tiene ningún requisito de borrado al que enlazar."

## Prompt 14

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Lo ejecuta "no lo he probado con una petición real ni con tests. Solo he comprobado que typecheck y lint pasan y que list:routes ", y me pide si hace /commit, digo que si.

"No he abierto el PR ni pasado el adversarial-reviewer. Según el CLAUDE.md van una sola vez, al terminar la unidad de trabajo. Dime si esta ya lo está."

Hace lo mismo que el anterior (comprobación manual)


## Prompt 15

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿quedó declarada la ruta DELETE?
```

**Qué salió:** SI (node ace list:routes)

## Prompt 16

**Modelo:** Sonnet 5.5 Med
**Herramienta:** Claude Code

```
¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** SI, "La tabla «Reglas de negocio» no tiene fila para el borrado. Es porque la spec no tiene ningún requisito de borrado al que enlazar."









