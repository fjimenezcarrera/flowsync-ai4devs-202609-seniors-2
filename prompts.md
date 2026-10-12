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

**Modelo:** Haiku 5.5 Medium
**Herramienta:** Claude Code

```
En fjc.md créame una tabla con 7 filas más encabezado. La tabla tiene 8 columnas. Cuyos encabezados son "Num", "Regla" "Se cumple" "Qué pide" "Revisado" "Veredicto" Evidencia" "Qué hacer"
```

## Prompt 2

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
En @docs/auditoria/fjc.md he generado una tabla para que me hagas una auditoría sobre las reglas
  definidas en @CLAUDE.md en el apartado "Reglas de proceso".

  La tabla tiene 7 reglas definidas que corresponden con ese apartado, aunque en el documento son 5
  puntos. En la tabla he subdibidido un poco más las reglas.

  Las 4 primeras columnas de la tabla no las tienes que editar:
   - "Num": Número de regla
   - "Regla": Nombre que le he dado a la regla
   - "Creo que se cumple": Es simplemente mi intuición para saber si se cumple. No hagas caso a este
  campo
   - "Qué pide": Resumen de lo que pide la regla.

  Quiero ver si se han cumplido esas reglas en los últimos 15 commits.
  Para ello quiero que hagas una auditoría de esos últimos 15 commits. No modifiques nada. No hay nada
  que corregir. Esto es sólo un análisis.

  De momento vamos a ir rellenando las columnas:
   - "Revisado: Qué se revisó para comprobarla. Indica el comando ejecutado o el archivo consultado.
  Sin esta información no hay forma de saber en qué se apoya el veredicto.
   - "Veredicto": Indica si se cumple la regla. Su valor puede "ser se cumple", "no se cumple" o "no
  se puede comprobar" (no se puede comprobar con la con la información disponible.)
   - "Evidencia" Escríbela en una línea. Si la regla no se cumple, indica dónde se incumple. Si no se
  puede comprobar, explica qué información falta.

  Sólo puedes modificar @docs/auditoria/fjc.md rellenando las celdas vacías, no modificando las que ya
  existen.

  De momento vamos a revisar las reglas 1 y 2.
  Para ello hay que mirar en los últimos commits sobre qué rama se hicieron, ver que no fue sobre main
  o sN/*, salvo que sea un merge desde una rama feat/* Tambien hay que comprobar que el mensaje del
  commit cumple con los criterios del comando /commit. Si no peude que se haya hecho manualmente.
```

**Salida:**
```
Las reglas 1 y 2 no se cumplen en los últimos 15 commits (b955a72..eff1686). Ya he rellenado Revisado, Veredicto y Evidencia de las filas 1 y 2 en docs/auditoria/fjc.md.

Ojo con el fichero: en disco, las columnas Regla y Qué pide están vacías y el encabezado sigue siendo «Se cumple», no «Creo que se cumple». Seguramente tienes esos cambios sin guardar en el IDE. Si guardas tu versión tal cual, sobrescribirá lo que he escrito; lo más seguro es guardar primero, decírmelo y vuelvo a rellenar las celdas.

Regla 1 (rama): no se cumple
- Los 15 commits van en línea recta y solo están en s4/end y s5/start. No hay ningún merge, ninguna rama feat/* los contiene y ninguno tiene un PR asociado en GitHub.
- Además, la historia se reconstruyó al llevarla a la sN/*: el committer pasa a ser «LIDR Academy» manteniendo las fechas, y b955a72 (28-ago) es el padre de 4427afc (20-ago).
- Matices:
  - No se puede saber en qué rama se escribieron originalmente, porque git no guarda ese dato y la reescritura lo borra.
  - Cuando se escribieron b955a72 y 4427afc, la regla solo prohibía main y s1/start. La versión actual entró en 0e56705.

Regla 2 (commit con /commit): no se cumple
- La skill pide tipo(scope): descripción con tipo feat/fix/refactor/docs/test/chore. Lo cumplen 12 de 15, y esos 12 llevan Co-Authored-By de Claude.
- eff1686 (docs: …) no lleva scope.
- eff1686, afc4b74 y b955a72 no tienen coautor Claude y los firman LIDR-AI4Devs o LIDR Academy. afc4b74 y b955a72 tienen la misma marca de tiempo al segundo, así que parecen hechos a mano o con un script. Que falte el coautor es un indicio, no una prueba: la skill no lo exige.
- Que haya un commit por petición no se puede comprobar: no queda registro de las peticiones, y prompts.md es solo la plantilla vacía.

No he modificado nada más.
```
❯ 


## Prompt 3

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
Comprueba ahora igual que antes las reglas 3 y 4, si en un commit ves que se han cambiado los ficheros indicados, comprueba que se ha actualizado @backend/.adonisjs/ para el openapi y algun README.MD dentro de la capability y confirma que el cambio tiene que ver con el cambio en código
```

**Salida:**

```
He rellenado Revisado, Veredicto y Evidencia de las filas 3 y 4 en docs/auditoria/fjc.md. Las dos reglas se cumplen. Solo tres de los 15 commits tocan rutas, controladores, validadores o transformers: ea5db1f, 4e03d1f y cbe9617.

Regla 3 (OpenAPI y .adonisjs/): se cumple
- ea5db1f añade tres rutas (/api, /api.json, /api.yaml) y su diff de .adonisjs/ refleja exactamente esas tres rutas.
- 4e03d1f (cambio en un transformer) y cbe9617 (cambios en controladores) no tocan .adonisjs/, y es correcto:
  - schema.d.ts describe las respuestas apuntando al controlador (ReturnType<import('#controllers/…')>), no copiándolas. Por eso solo cambia si cambian las rutas o los validadores.
  - cbe9617 solo añade decoradores e imports, y ese cambio es precisamente la actualización del OpenAPI.

Regla 4 (README de la capability): se cumple
- cbe9617 es el único commit posterior a la regla (160fbc7) que toca código de una capability. Actualiza docs/capabilities/tasks/README.md en el mismo commit, y el cambio tiene que ver con el código: añade la sección «El contrato, servido» y corrige la fila del filtro por estado.

Un matiz que he anotado en la Evidencia: 4e03d1f cambia el transformer de tasks sin actualizar ni OpenAPI ni README. No cuenta como incumplimiento porque en ese momento no existían el OpenAPI (entra en ea5db1f), el README (se crea en 7662fb1) ni la propia regla (160fbc7). Si lo prefieres más estricto, ese commit sería el único caso de «no se cumple».

No he modificado nada más.
```