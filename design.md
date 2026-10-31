# Contrato del sistema de diseño

Reglas obligatorias para cualquier cambio en este repositorio. No son
sugerencias de estilo: son lo que mantiene coherentes a todos los sistemas que
consumen el kit. Si una regla impide resolver algo, dilo y propón cambiarla; no
la rodees en silencio.

Este repositorio **es** el kit (`@hrl/core-ui`), no una aplicación. Las
aplicaciones lo instalan fijado a un tag y tienen su propio contrato, que
completa a este con sus reglas de uso.

El catálogo de lo que existe está en [`UI_CATALOG.md`](UI_CATALOG.md) y, para
verlo en pantalla, en el catálogo visual (`npm run ladle:serve`). Léelo antes de
crear un componente.

---

## 0. Stack real

React ≥ 19 (dependencia par, no se empaqueta) y CSS con custom properties.
**Sin Tailwind, sin Radix, sin CVA, sin TanStack Table, sin lucide, sin
TypeScript.** El kit no tiene ninguna dependencia de ejecución, y esa es una
propiedad que se conserva a propósito: quien lo instala no hereda nada más.

Las dependencias de desarrollo son las justas: `esbuild` (compila `src/` a
`dist/`), `@ladle/react` (catálogo) y `react`. No añadas una dependencia sin
pedirlo explícitamente y explicar qué problema concreto resuelve que no se
pueda resolver con lo que ya hay.

`dist/` se versiona a propósito: así una instalación por URL de Git funciona sin
que el consumidor compile nada. Nunca se edita a mano; sale de `npm run build`.

---

## 1. Estructura y fronteras

```
src/            Componentes, hooks y utilidades. Es lo que se publica.
tokens.json     ÚNICA fuente de los tokens (colores, escalas, movimiento).
tokens.css      Estilos del kit. Los bloques de tokens se GENERAN de tokens.json.
fonts/          Fuentes (woff2) que tokens.css declara con @font-face, y su licencia.
assets/         Identidad del hospital que el kit incluye: logo, escudo y las seis
                fachadas del login (WebP optimizado). tokens.css las referencia con url().
                Ningún recurso del kit se pide a internet: `npm run fuentes` lo impide.
dist/           Salida compilada de src/. Generada.
stories/        Catálogo visual (Ladle). No se publica en el paquete.
.ladle/         Configuración y estilos del catálogo, no del kit.
scripts/        Generación de tokens, comprobaciones y prueba de humo.
bin/            Herramienta `hrl-core-ui` (init, doctor, upgrade). Se publica en el
                paquete y usa solo módulos de Node.
```

- **`src/` no importa nada de fuera de `src/`.** Ni alias, ni rutas de otros
  proyectos. Sus imports son relativos: el kit debe funcionar copiado a otro
  proyecto sin depender de nada del anfitrión.
- **La identidad del hospital sí es del kit.** El logo, el escudo y las fachadas del
  login son del Hospital Regional de Loreto, no de un sistema: todos los sistemas del
  hospital los comparten, y por eso viajan en el paquete en vez de copiarse (y
  desactualizarse) proyecto por proyecto. Lo que sigue prohibido es lo de abajo.
- **El kit no sabe de ningún sistema concreto.** Ni de pacientes, ni de
  indicadores, ni del HIS, ni del nombre de una aplicación. Si un componente
  necesita datos, los recibe por props; si un texto nombra un dominio, no
  pertenece al kit. Los datos de ejemplo de `stories/` también son genéricos.
- Un componente del kit no hace `fetch` ni consulta un endpoint. Nunca.
- Lo que sea específico de un sistema vive en ese sistema, aunque parezca
  genérico. «Genérico y reutilizable de verdad» es una propuesta para el kit;
  «lo necesito aquí por si acaso» no lo es.

**Qué entra en el kit:** lo que le sirve a más de un sistema o a cualquier
sistema futuro —un componente, un token, un icono, una animación—. **Qué se queda
en la aplicación:** sus paneles, su vocabulario, sus datos, y los ajustes de un
componente dentro de su propio contexto (`.hrl-login__tarjeta .hrl-btn`). Al
revés no: el kit nunca sabe de la aplicación.

---

## 2. Prohibiciones de implementación

### 2.1 HTML nativo

Dentro de `src/` el HTML nativo es la implementación —aquí se construyen los
primitivos—, no un atajo. Pero un componente del kit tampoco debe reinventar a
otro: un tooltip es `Tooltip`, nunca `title="..."` (el del navegador tarda un
segundo en salir, no se lee con teclado y no respeta la tipografía del sistema);
un menú es `DropdownMenu`; un icono sale de `Icon`.

Las aplicaciones sí tienen prohibido el HTML nativo con contraparte en el kit
(`<button>`, `<input>`, `<table>`, modales a mano…). Eso se exige en su contrato,
no aquí; lo que sí se exige aquí es que exista la contraparte.

### 2.2 Nada de valores arbitrarios

Un color, un radio, una sombra, un tamaño de fuente o una duración salen de un
token, tanto en CSS como en estilos en línea:

```jsx
// NO
<span style={{ color: '#00544A', borderRadius: 12, fontSize: 13.5 }} />
// SÍ
<span style={{ color: 'var(--success-text)', borderRadius: 'var(--radius)', fontSize: 'var(--text-base)' }} />
```

- **El único sitio donde puede aparecer un literal de color es la definición del
  token** en `tokens.json` (y el `tokens.css` / `src/preset.js` que se generan
  de él). Introducir un color nuevo es añadirlo ahí primero.
- El valor original puede repetirse como respaldo dentro de un `var()`
  (`var(--text-sm, 12.5px)`): así un componente montado fuera de `.hrl-nuevo`,
  donde los tokens no existen, no pierde su tamaño.
- `npm run literales` falla si un `font-size` vuelve a escribirse como literal.
  Los radios y las duraciones de algunas animaciones todavía tienen literales que
  no coinciden con la escala: son deuda anotada en el `CHANGELOG.md`, no un
  permiso para añadir más.

Corolario del modo oscuro: un color de texto pensado para fondo claro es
ilegible sobre fondo oscuro. Por eso existen `--success-text`,
`--destructive-text`, `--warning-fg`, `--info-fg`, `--neutral-text`: se invierten
con el tema. Úsalos, nunca el hex.

### 2.3 Nada de iconos sueltos

Todo icono sale de `src/icons.jsx` vía `<Icon name="..." />`. **Solo iconos de relleno** (desde
1.11.0): formas llenas en una rejilla de 24, sin `stroke`, con los huecos recortados por
`fill-rule="evenodd"`; la prueba de humo falla si el sprite tiene un trazo. Añadir uno es
dibujar su `<symbol>` **dentro de `IconSprite`** (nunca dentro de `Icon`, que se
repite en cada uso) y declarar su nombre en `src/icon-catalog.js`. La prueba de
humo falla si un nombre del registro no tiene su símbolo.

Los nombres van **en inglés, en minúsculas, con guiones y con el prefijo `sh-`**,
según lo que dibujan (`sh-pill`, `sh-sidebar-collapse`), no según dónde se usan
hoy. Renombrar uno es un cambio de API: el nombre anterior pasa a
`ICON_ALIASES` y sigue funcionando hasta la próxima versión mayor (ver § 8).

---

## 3. Reglas de interacción

### 3.1 Capas flotantes

- Todo modal, cajón, menú y tooltip **cierra con `Esc` y con clic exterior**.
- Todo lo que use `position: fixed` se monta con `createPortal` en
  `document.body`. Motivo real: una animación con `transform` y `fill-mode: both`
  en un contenedor lo convierte en bloque contenedor y el `fixed` pasa a
  resolverse contra él; el diálogo aparece fuera de la vista.
- El cierre se anima antes de desmontar: `useExitAnimation`, no desmontar de golpe.
- Al cerrar un menú, el foco vuelve al elemento que lo abrió.
- **Un tooltip sale al costado del cursor**, centrado en vertical, y pasa al otro
  costado cerca de un borde. Nunca arriba ni debajo (el puntero lo tapa), y sin
  transición de posición: con retardo llega tarde y cruza bajo el cursor. Por
  teclado se ancla al costado del propio elemento.
- **Un menú se abre hacia donde quepa** (debajo del disparador o, si no, encima) y
  se acota a la ventana en los dos ejes; si no cabe entero, se desplaza.
- El espacio disponible se mide con `anchoVisible()` (`src/viewport.js`), no con
  `window.innerWidth`: este cuenta el hueco de `scrollbar-gutter` y deja las
  capas hasta 15 px fuera del área visible.
- Cada capa flotante tiene **sus propios `@keyframes`**. Reutilizar los de otra
  deja su estado final aplicado para siempre por el `fill-mode: both`: así el
  menú heredó el `translate(-50%, -100%)` del tooltip y salía fuera de pantalla.

### 3.2 Acciones destructivas

`Dialog` y `Button tone="danger"` existen para que las aplicaciones confirmen
toda acción que borre o sea irreversible. El kit no decide cuándo; su trabajo es
que el diálogo diga qué se borra y qué consecuencia tiene.

### 3.3 Avisos

`Toast` confirma que algo ocurrió (3600 ms por defecto; no lo cambies sin
motivo), `Alert` explica una condición que persiste en la página y `Dialog` solo
detiene al usuario cuando hace falta.

### 3.4 Tablas

La convención que el kit muestra y las aplicaciones aplican:

- La **columna del identificador principal es el enlace** que abre el registro.
- Además, un **botón de acción explícito al final de la fila** con su
  `aria-label`.
- Nunca la fila entera clicable como único camino: rompe la selección de texto y
  no se alcanza con teclado.
- Diez filas por página (`ROWS_PER_PAGE`) y contador de registros siempre visible.
- Estado vacío con `EmptyState` que explique por qué está vacío; estado de carga
  con `loading` (esqueleto), no con la tabla vacía.

### 3.5 Objetivos táctiles

Mínimo **40 px** de alto en cualquier control interactivo (`--touch-target`);
44 px (`--touch-target-lg`) en acciones principales o de uso frecuente.

### 3.6 Accesibilidad mínima

- Todo control sin texto visible lleva `aria-label`.
- El color nunca es la única señal: se acompaña de icono o de texto.
- Los tooltips se abren con `mouseenter` **y** con `focus`.
- `prefers-reduced-motion` está resuelto de forma global en `tokens.css`; no lo
  anules con animaciones en línea.
- Contraste WCAG 2.1 AA: `npm run contrast` mide cada combinación real de
  texto y fondo, en los dos temas. Por debajo de 3:1 el CI falla; entre 3:1 y
  4.5:1 solo sirve para iconografía y texto grande, y así se documenta.

---

## 4. Datos y honestidad de la interfaz

Los componentes tienen que poder decir la verdad:

- **Denominador cero no es 0 %.** Se muestra «Sin datos» (`StatCard
  severity="nodata"`, `GaugeArc value={null}`). Un 0 % afirma que se midió y dio
  cero.
- **Meta no registrada no es meta 0.**
- **Los meses sin datos no se dibujan como ceros.** `SeriesBars` recorta la serie
  en el último mes con datos y rotula el bloque vacío (`emptyTail`).
- Si una cifra puede leerse de dos maneras (personas o atenciones, suma por
  categoría o total único), el componente ofrece dónde decirlo: tooltip o leyenda.
- Todo KPI, botón, icono y abreviatura lleva su `Tooltip`.

---

## 5. Tokens

`tokens.json` es la única fuente. Para cambiar un color, un radio, un tamaño o
una duración se edita ahí y se corre `npm run tokens`, que regenera los bloques de
`tokens.css` y `src/preset.js`. Nunca se edita a mano un bloque generado: el CI
falla si `tokens.css` o `preset.js` no coinciden con lo que produce el script.

Las escalas que un componente debe usar en vez de un valor suelto:

| Qué | Tokens |
|---|---|
| Tamaño de fuente | `--text-xs` 11 · `sm` 12.5 · `base` 13.5 · `md` 14 · `lg` 17 · `xl` 22 · `2xl` 32 · `3xl` 36 |
| Familia | `--font-sans`, `--font-mono` |
| Radio | `--radius-xs/sm/md`, `--radius` (12), `--radius-nav` (13), `--radius-lg` (14), `--radius-xl` (18), `--radius-tile` (18), `--radius-card` (22), `--radius-full` |
| Movimiento | `--duration-fast/base/slow`, `--ease`, `--transition-fast/base/slow` |

El tema oscuro solo redefine lo que cambia; el resto se resuelve por cascada. Un
mismo valor no puede servir a los dos temas cuando cada uno necesita un contraste
distinto: en ese caso el oscuro lleva su propio override, documentado en
`tokens.json`.

---

## 6. Importaciones

- Dentro de `src/`, imports **relativos**.
- Los consumidores importan solo el punto de entrada público —`@hrl/core-ui` y
  `@hrl/core-ui/tokens.css`—, nunca un archivo suelto por ruta. Todo lo que el kit
  expone sale de `src/index.js`; si algo debe ser público, se exporta ahí.

---

## 7. Idioma

La frontera es la API, no el archivo:

- **En inglés, toda la API pública**: nombres de componente, props y valores de
  prop (`<Button tone="danger" size="sm" loading>`), y nombres de icono. Es el
  vocabulario del sistema de diseño y se comparte entre proyectos.
- **En español, todo lo demás**: comentarios, textos de ejemplo, documentación y
  variables internas.

Los comentarios explican **por qué**, no qué. Un comentario que repite lo que
dice la línea siguiente sobra.

---

## 8. Versiones y publicación

La versión es semántica:

- **Mayor**: quitar o renombrar una prop, un valor de prop o un icono sin dejar
  alias.
- **Menor**: añadir algo, o un cambio de aspecto deliberado (se anota qué cambió
  y cuánto).
- **Parche**: corregir sin cambiar la API ni el aspecto.

Un nombre que se renombra no desaparece: queda como alias con aviso en
desarrollo (`src/deprecated.js`: `ICON_ALIASES` y `PROP_ALIASES`) hasta la siguiente
versión mayor. Esas tablas son también la fuente de `hrl-core-ui doctor --fix`, que
reescribe el nombre viejo en los proyectos: si renombras algo, se añade ahí.

Para publicar:

1. Cambia lo que haga falta en `src/`, `tokens.json` o `tokens.css`.
2. Anota el cambio en `CHANGELOG.md`: qué cambió y por qué.
3. `npm run verificar`, `npm run contrast` y, si tocaste el catálogo,
   `npm run ladle:build`.
4. Sube la versión en `package.json` y crea el tag `vX.Y.Z`.
5. `git push` y `git push --tags`. El tag regenera la rama `catalogo` (el sitio
   público) y ninguna aplicación cambia sola.

Cada aplicación actualiza cuando decide, con `npx hrl-core-ui upgrade vX.Y.Z`: cambia
el tag, instala sin subir otras dependencias, muestra el CHANGELOG y verifica. Por eso
un cambio del kit nunca rompe a un sistema en producción sin aviso.

---

## 9. Antes de dar algo por terminado

```bash
npm run verificar     # tokens, fin de línea, literales, build, humo y prueba de la herramienta
npm run contrast      # WCAG AA de los tokens
npm run ladle:build   # el catálogo compila
```

`verificar` incluye la prueba de la herramienta `bin/` (`npm run cli`), que monta un
proyecto de ejemplo y comprueba `init`, `doctor` y `upgrade`. Si cambias lo que
`doctor` comprueba —orden de estilos, imports, nombres obsoletos—, actualiza esa prueba.

Ni el build ni las pruebas de humo dicen que algo *se vea bien*. Eso solo se
comprueba mirándolo: `npm run ladle:serve`, en claro y en oscuro. Lo que no
puedas verificar sin abrir el navegador, dilo explícitamente en lugar de
afirmarlo.
