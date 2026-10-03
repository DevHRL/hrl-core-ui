# Registro de cambios

Formato: qué cambió y por qué. Las versiones siguen el criterio semántico —
quitar o renombrar una prop es un cambio mayor, porque rompe a quien ya la usa.

## 1.10.0-redesign.8 — 03/10/2026 (prelanzamiento, rama `redesign`)

- **`PageBanner` respeta el borde de la página.** Iba pegada al menú lateral y quedaba más ancha que las
  tarjetas de debajo, que llevan 32 px a cada lado. Ahora tiene ese mismo margen (12 px por debajo de
  720 px), configurable con `--hrl-banda-borde` para un sistema con otro borde.

## 1.10.0-redesign.7 — 03/10/2026 (prelanzamiento, rama `redesign`)

La cabecera en banda, elegida en el laboratorio de cabeceras de Reporte Estadístico (la variante «Ondas»).

- **`PageBanner` (nuevo).** La vista en una tarjeta con degradado del verde profundo al de la marca y ondas
  verde agua en la base. A un lado, migas, título y descripción; con `clock`, la hora tras la descripción
  («Sábado, 3 de octubre de 2026 | 5:36 p. m.»), que se actualiza sola. Al otro, el estado dicho una sola
  vez (`status`: icono, etiqueta y detalle; `tone="warning"` pone la etiqueta sobre amarillo), la mascota
  si se quiere (`mascot`) y las acciones: `Button tone="cta"` sale en blanco y `ghost` con borde claro.
- **`AppShell banner`.** Con `banner={{ status, mascot, actions, clock }}` la vista se presenta con
  `PageBanner` al principio del contenido, con el mismo `title`, `subtitle` y `breadcrumbs`. No va en la
  barra superior fija: es alta y fija se comería la pantalla. Sin `banner`, todo sigue igual.
- **Tokens `--banda-desde`, `--banda-hasta` y `--banda-texto`**, fijos en los dos temas: en oscuro `--brand`
  se aclara y el texto blanco dejaría de leerse. `npm run contrast` mide ahora la banda (4.61:1 en el
  extremo más claro) y la etiqueta de aviso.

## 1.10.0-redesign.6 — 03/10/2026 (prelanzamiento, rama `redesign`)

La mascota del hospital entra al kit: es identidad, como el logo, y la comparten todos los sistemas.

- **`Mascot` (nuevo): Dr. Mochi.** Un médico con forma de mochi —cuerpo redondo, bata blanca,
  estetoscopio y espejo frontal—, elegido en el laboratorio de mascotas de Reporte Estadístico.
  Estados `idle`, `thinking`, `done`, `problem` y `sleeping`; tamaños `sm` · `md` · `lg` · `xl` o px;
  `mouth={false}` la dibuja sin boca; con `interactive` responde al clic y al teclado (se aplasta,
  se aprieta y rebota, y con cinco clics seguidos se marea) y avisa por `onReact`.
- **No sigue el cursor**: tiene su propia mirada en cada estado (curiosa en reposo, lee de lado a lado
  al pensar, mira hacia abajo con un problema) y parpadea en todos. Un clic no suelta partículas.
- **Movimiento**: respira (inhala más rápido de lo que exhala) conservando el volumen, rebota como
  gelatina al aterrizar, se dobla al inclinarse y los accesorios se balancean con retraso. Con
  `prefers-reduced-motion` conserva la expresión, la mirada y el parpadeo, sin desplazamientos.
- **Tokens `--mascota-*`** (grupo de identidad, no cambian con el tema): el cuerpo es `#2fbfa0` y el
  resto se deriva de él. Sin contorno y sin brillo en los ojos, por decisión de diseño.

## 1.10.0-redesign.5 — 03/10/2026 (prelanzamiento, rama `redesign`)

Vuelve la medida de la tarjeta de antes; de redesign.4 queda la banda y el mosaico.

- **`Card` recupera su tamaño**: 24 px de relleno, `--radius-card` (16) y `--shadow-card`, sin borde. El
  título vuelve a `--text-lg`. Compacta se leía apretada.
- **Vuelve la barra de color (`accent`)**, y el icono se suma a ella: va en una baldosa teñida con el
  mismo color. Barra, icono, título, estado (`meta`) y acción (`actions`) siguen en una sola banda.
- **Borde de la página como antes**: 32 px a los lados en la cabecera y la barra, 28 px sobre el contenido.
- **`Mosaic stacked`** (nuevo): una sección debajo de otra, aunque quepan lado a lado.

## 1.10.0-redesign.4 — 03/10/2026 (prelanzamiento, rama `redesign`)

Rediseño de las tarjetas y del borde de la página, elegido en el laboratorio de variantes de Reporte
Estadístico (la «banda» con el icono de sección y la geometría de mosaico).

- **`Card`: la cabecera es una banda.** Icono (`icon`), título y descripción, estado (`meta`, nuevo) y
  acción (`actions`) a la misma altura; en una tarjeta angosta el estado y la acción bajan solos. Antes
  iban en filas propias y dejaban un hueco largo entre el estado y el botón.
- **Sin barra de color junto al título**: marcaba cada sección sin decir nada (verde en casi todas).
  `accent` se acepta pero ya no se dibuja; la sección se reconoce por su icono, y el color queda para el
  estado. Cambio de aspecto deliberado.
- **Un solo relleno**: 12 × 16 en lugar de 24, radio 10 (`--radius-md`) en lugar de 16, borde fino y
  sombra corta. El título baja a `--text-md`. Las aplicaciones no deben añadir relleno dentro.
- **`Card wide`**: siempre a lo ancho dentro de un `Mosaic`.
- **`Mosaic` (nuevo)**: las secciones de una página, acomodadas solas por su forma. Las tarjetas cortas
  seguidas comparten fila; las que traen tabla, calendario, pasos, tira u otra rejilla, y lo que no es
  tarjeta, ocupan la fila entera; si una fila queda incompleta, se reparte el ancho. Recalcula al cambiar
  el ancho o el contenido.
- **Borde de la página: 16 px.** La cabecera (`PageHeader`) y la barra superior pasan de 32 a 16 px a los
  lados, y el contenido arranca a 16 px de la barra (antes 28): la página quedaba metida hacia el centro.

## 1.10.0-redesign.3 — 02/10/2026 (prelanzamiento, rama `redesign`)

Salió de auditar Reporte Estadístico con la skill «impeccable» (técnica: accesibilidad, rendimiento,
adaptación, tema, integridad).

- **Movimiento reducido: una alternativa, no un apagado.** Todo se cortaba a 0,01 ms y solo dentro de
  `.hrl-nuevo`, así que los diálogos, avisos y tooltips (`.hrl-portal`) seguían animándose y el esqueleto
  de carga dejaba de decir «cargando». Ahora se redefinen los keyframes: entradas y salidas conservan el
  fundido sin desplazarse; spinner, barra indeterminada y esqueleto pulsan en el sitio; la campana y el
  anillo de alerta se quedan quietos. Va al final de `tokens.css`, porque gana el último `@keyframes`.
- **Superficies del navegador con el sistema**: selección de texto (`--selection`), cursor y casillas
  nativas en el color de marca, barras de desplazamiento con el tema, subrayado separado del texto y
  cifras tabulares en tablas, `NumberCell`, `StatCard` y `.hrl-mono`.
- **Anillo de foco del sistema** para todo lo enfocable (los botones y el menú mostraban el del navegador).
- **`--scrim`** para los velos de cajones y del menú en el teléfono: en oscuro el velo anterior casi no se veía.
- **`SeriesBars` ya no desborda en un teléfono**: el lienzo no tenía `min-width: 0` y el bloque de meses vacíos medía 90 px fijos.
- **`Button tone="link"`**: la acción que se lee como enlace dentro de una celda. Las aplicaciones la
  escribían con un `<button>` propio.

## 1.10.0-redesign.2 — 02/10/2026 (prelanzamiento, rama `redesign`)

- **`doctor` y `upgrade` aceptan tags de prelanzamiento** (`#v1.10.0-redesign.1`). `doctor` avisaba
  que npm «tomaría la rama por defecto», y no es así: un tag de prelanzamiento es tan fijo como
  cualquier otro. `comparar` ordena como semver (un prelanzamiento va antes de su versión final);
  `upgrade latest` sigue sin elegir prelanzamientos.
- Los mensajes de `doctor`/`upgrade`/`init` y `package.json` apuntan a `DevHRL/hrl-core-ui`, no al
  repositorio personal anterior.

## 1.10.0-redesign.1 — 02/10/2026 (prelanzamiento, rama `redesign`)

Salió de evaluar Reporte Estadístico con la skill de UI/UX «ui-ux-pro-max», midiendo en el navegador
(contraste real, objetivos, foco con Tab, títulos, movimiento reducido, 375 px). Sin cambios que rompan
la API: todo lo nuevo es opcional o cambia solo lo que no cumplía.

- **Contraste del texto secundario.** `--subtle-foreground` era un alias de `--text-disabled` (3,15:1
  en claro, 4,46:1 en oscuro) y el kit lo usaba —junto con `--text-disabled` a secas— como color de
  texto: notas de `StatCard`, pistas de campo, rótulos del menú, fechas del historial, etiquetas de
  `Field`. Ahora tiene valor propio que llega a 4,5:1 (`#667482` en claro, `#8696a2` en oscuro) y esos
  textos lo usan. `--text-disabled` queda solo para lo deshabilitado. `npm run contrast`: 0 fallos.
- **Borde de los campos a 3:1** (`--input-border`: `#8493a1` / `#66737f`). Medía 2,73:1, por debajo
  del mínimo para el contorno de un control, y los campos lo tenían escrito a mano en vez de usar el token.
- **Foco visible en los campos**: anillo de 2 px con `:focus-visible` (antes solo cambiaba el color del
  borde de 1 px). También en `NumberCell`.
- **`AppShell`**: el contenido es `<main id="contenido-principal" tabIndex=-1>` (`ID_CONTENIDO` exportado)
  y hay enlace «Saltar al contenido», que mueve el foco sin tocar la URL. **Ya no exige 1440 px de ancho**:
  por debajo de 900 px el menú es un cajón que se abre con el botón del menú y se cierra con Esc, con el
  velo o al elegir una opción. En un teléfono la aplicación se desplazaba de lado.
- **`Card` con `headingLevel`** (2 por defecto). Era `h3` fijo, y toda página saltaba de h1 a h3. Los
  títulos de `Dialog`, `DetailDialog` y del cajón de notificaciones pasan a `h2`. El aspecto no cambia.
- **Ingreso**: sin `autocomplete="off"`, con `username` / `current-password` / `new-password` — los
  gestores de contraseñas vuelven a funcionar. `Input kind="password"` trae botón para mostrar u ocultar
  (`aria-pressed`). Icono nuevo: `sh-eye-off`.
- **Errores de campo asociados**: `error` y `hint` llegan al control por `aria-describedby`, y con
  `error` el control lleva `aria-invalid`.
- **`--text-secondary` en claro: `#637381` → `#5f6f7c`.** Sobre los fondos tintados (días del
  calendario, chips, subtítulos de `SelectionStrip`, cabeceras) medía 4,25–4,47:1; ahora no baja de
  4,52:1. El cambio de tono apenas se nota.
- La tarjeta de `LoginScreen` es el `<main>` de la página de ingreso.
- **Objetivos de 24 px** (WCAG 2.5.8) en el texto con `Tooltip` enfocable y en las cabeceras que
  ordenan una tabla, sin mover el texto (relleno con margen negativo).

## 1.9.0 — 02/10/2026

Cambio de aspecto deliberado de `ProgressSteps`, recién salido en 1.8.0. Sin cambios de API.

- **El check del círculo ya no se ve de otro color.** Usaba `sh-ok`, que dibuja un disco al 18 %
  detrás del check: dentro del círculo verde se leía como un segundo círculo de otro tono. Ahora el
  paso hecho lleva `sh-check`, un solo trazo. El paso con errores lleva un «!» de texto en lugar de
  `sh-crit` (mismo motivo).
- **Más minimalista.** Círculo de 28 px (antes 36) con borde de 1,5 px, línea de 1 px, sin halo en
  el paso actual (lo marcan el contorno y el número en color de marca y el título en negrita) y
  notas sin icono, en `--text-xs`: el estado ya lo dicen el círculo y el texto.
- Las notas usan `--muted-foreground`, no `--subtle-foreground`: en `--text-xs` el gris de
  deshabilitado no llega al contraste de texto normal.

## 1.8.0 — 02/10/2026

Un componente nuevo. Sin cambios en los existentes.

- **`ProgressSteps`: círculos unidos por una línea, para un recorrido corto que va hacia
  adelante** (subir → revisar → enviar). Salió del módulo de carga de Excel de Reporte
  Estadístico, donde las fichas de `Steps` no se leían como pasos sucesivos. Misma forma de
  pasos y mismo vocabulario de estado que `Steps` (`empty`·`partial`·`ok`·`error`), así que
  cambiar de uno a otro es cambiar el nombre. **No se pulsa**: dice dónde se está; moverse lo
  hacen los botones de cada paso. El estado va con icono en el círculo y con la nota en texto;
  el paso activo lleva `aria-current="step"` y un halo. Respeta `prefers-reduced-motion`.
- `Steps` sigue siendo el de los formularios largos que se recorren en cualquier orden.
- Catálogo: historias `Primitivos / ProgressSteps`.

## 1.7.1 — 28/09/2026

- **`AppShell`: con el menú abierto se veían los dos logos, el extendido y el escudo, uno al lado del
  otro.** La regla que oculta el escudo tenía la misma especificidad que `.hrl-logo { display: block }`,
  que va más abajo en `tokens.css`, y perdía. Ahora va anidada en `.hrl-sidebar__logo`. Comprobado
  en el catálogo, abierto y plegado. Sin cambios de API.

## 1.7.0 — 28/09/2026

Correcciones del menú lateral plegado y de la pantalla de ingreso que dos sistemas
(Reporte Estadístico y Vigilancia Oncológica) estaban arreglando cada uno por su cuenta en
su `estilos.css`. Sin cambios de API. Es menor y no parche porque el menú plegado cambia de
aspecto a propósito.

- **`AppShell`: con el menú plegado, el logo por defecto es solo el escudo.** `HrlLogo` no
  es un `<img>` y la regla que reducía el logo al plegar solo alcanzaba a un `<img>`: el logo
  extendido (158 px) quedaba cortado en los 76 px del menú. Ahora `AppShell` monta los dos
  (`.hrl-sidebar__logo-completo` y `.hrl-sidebar__logo-escudo`) y el CSS muestra el que
  corresponde. Un `logo` propio sigue funcionando igual.
- **Los módulos del menú quedan a la misma altura abierto y plegado.** Al plegar subían: el
  bloque del logo perdía alto (ahora tiene `min-height` de 99 px, el del logo extendido con
  su relleno) y los rótulos de grupo se ocultaban y la separación entre grupos cambiaba de
  relleno. Ahora el rótulo conserva su alto, sin texto, con una línea punteada en su lugar;
  desaparece el borde superior que se ponía entre grupos. Un logo propio de más de 78 px de
  alto sí mueve el menú.
- **`LoginScreen` y `ChangePasswordScreen` ocupan exactamente la ventana, sin scroll.** El
  relleno se sumaba a `min-height: 100vh` (el `border-box` global no alcanzaba al propio
  `.hrl-nuevo`) y la página crecía 32 px. Si la ventana es más baja que la tarjeta, se desplaza
  la tarjeta y no la página; con menos de 600 px de alto la tarjeta se compacta (logo de
  190 px, menos relleno).
- Catálogo: historia `Layout / AppShell / Menú plegado`.

**Al actualizar:** borrar las copias locales de estos arreglos y dejar `AppShell` sin `logo`.
En Reporte Estadístico, `LOGO_MENU` en `App.jsx` y los bloques «logo del menú» e «ingreso» de
`estilos.css`; lo mismo en Vigilancia Oncológica (`AppNuevo.jsx`).

## 1.6.1 — 23/09/2026

Correcciones que salieron de usar 1.6.0 en `ficha_14`. Sin cambios de API.

- **`upgrade` borra la caché de dependencias de Vite** (`node_modules/.vite`). Con la caché de la
  versión anterior, la aplicación salía en blanco con «The requested module … does not provide
  an export named 'ChangePasswordScreen'» al usar un componente nuevo del kit. Es una caché: se
  regenera sola. Si el servidor de desarrollo está abierto hay que reiniciarlo (`upgrade` lo avisa).
- **`doctor`: la marca `hrl-nativo` también vale dentro de la etiqueta**
  (`<button /* hrl-nativo: motivo */ type="button">`). Antes solo se reconocía en la línea de la
  etiqueta o la anterior, y en un `return (` o un `.map()` la línea anterior no admite comentario.
- **`init`: el ejemplo de `AppShell` ya no lleva `logo`** (desde 1.6.0 lo pone el kit) y no
  recomienda pasar uno propio.
- `MIGRACION.md`: la página en blanco tras subir de versión, y que un `logo-icon.png` viejo en el
  proyecto (favicon, login o barra lateral) se sustituye por el del kit.

## 1.6.0 — 23/09/2026

**El kit deja de depender de internet y de que cada proyecto rehaga lo mismo.** Salió de
la primera migración completa a un proyecto real (`ficha_14`): el kit y `doctor` estaban
en verde y aun así la interfaz salía con otra tipografía, con el logo viejo y el icono de
Vite, sin los fondos del login, con 67 estilos en línea, 17 colores escritos a mano y el
login devolvía 502.

**Nuevo, en el kit**

- **Fuentes propias.** `tokens.css` pedía Public Sans e IBM Plex Mono a Google Fonts con un
  `@import`. En una red sin salida a internet (la de un hospital) el sistema caía en
  Helvetica o Arial sin ningún error. Ahora son archivos del paquete (`fonts/`, unos 75 kB,
  licencia OFL en `fonts/LICENSE.txt`) con `@font-face` y `font-display: swap`. La familia
  sigue llamándose `Public Sans`: ningún token cambia. El bundler del proyecto los empaqueta
  al importar `tokens.css`; comprobado compilando `ficha_14` con Vite (cuatro `.woff2` con
  hash, ninguna petición externa).
- **`HrlLogo`** y el logo del hospital en el paquete (`assets/`). `variant="full"` (escudo,
  nombre y hospital) o `"mark"` (solo el escudo). **`AppShell` lo dibuja solo** cuando no se le
  pasa `logo`; `logo={null}` deja la barra lateral sin marca. En el tema oscuro se asienta
  sobre una placa clara, porque sus verdes no se leen sobre fondo oscuro. Cambio de
  comportamiento: un proyecto que no pasaba `logo` verá ahora el del hospital.
- **`LoginScreen` y `ChangePasswordScreen`**: pantalla de ingreso y de cambio obligatorio de
  contraseña, con **la fachada del hospital según la hora** (seis tramos: amanecer, mañana,
  tarde, atardecer, noche iluminada, noche), como en el sistema anterior. No consultan nada:
  reciben `onSubmit` y muestran el mensaje si lanza. Las fachadas pasaron de 38 MB (PNG) a
  1,2 MB (WebP a 1600 px) para poder viajar en el paquete; solo se descarga la de la hora.
  `backdrop` = `auto` · `none` · o un tramo fijo. También se exportan `backdropForHour(h)` y
  `LOGIN_BACKDROPS`.
- **`Stack` y `Grid`**: filas, columnas y rejillas con separación de la escala nueva
  **`--space-1…6`** (4, 8, 12, 16, 24, 32 px; también en `preset.space`). Reemplazan al
  `style={{ display: 'flex', gap }}` suelto.
- **`Input` acepta `autoFocus`**. Antes la prop se ignoraba en silencio: la casilla de usuario
  del login de `ficha_14` nunca recibía el foco.
- La identidad del hospital (logo, escudo, fachadas) ya es del kit: `design.md` lo dice
  expresamente y sigue prohibido lo que es de un sistema concreto (pacientes, endpoints…).

**Nuevo, en la herramienta (`init` y `doctor`)**

- **`init` cambia el icono de pestaña de Vite** por el escudo del hospital: copia
  `assets/icono-hrl.png` a `public/` y enlaza `index.html`. Idempotente; `--dry-run` lo anuncia.
- **`doctor` avisa** de: recursos que se cargan de internet (CDN, Google Fonts) en
  `index.html`, CSS o código; icono de pestaña de la plantilla de Vite; clases `hrl-…` usadas
  sin definir (en el kit o en el proyecto); **colores escritos como literal**; y **HTML nativo
  con equivalente en el kit** (`<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`; no
  marca `<input type="file|hidden|radio">`). Una excepción justificada se anota con un
  comentario `hrl-nativo: motivo` en esa línea o la anterior. Son avisos, no errores; `init`
  los lista como pasos «manual» con su arreglo. Los comentarios no cuentan. Código en
  `bin/lib/revisiones.mjs`.
- **`MIGRACION.md`** (viaja en el paquete): recorrido, lo que falla con su arreglo, el ingreso,
  cómo probar de punta a punta (un proxy de desarrollo apuntando al puerto equivocado dio un 502
  que ninguna herramienta ve), equivalencias y lo que el kit aún no cubre.

**Comprobaciones**

- `npm run fuentes` (`scripts/check-fuentes.mjs`, en `verificar` y en el CI): falla si `tokens.css`
  carga algo por http(s), si falta un archivo que referencia (fuentes, logo, fachadas) o si
  `fonts/` o `assets/` dejan de publicarse.
- `npm run humo` monta `Stack`, `Grid`, `HrlLogo`, `LoginScreen` y `ChangePasswordScreen`, y comprueba
  los tramos horarios, el logo por defecto de `AppShell` y `logo={null}`.
- `npm run cli` pasa de 27 a 42 comprobaciones.
- Historias de Ladle: Layout, HrlLogo y Pantallas de acceso (con las seis fachadas).
- `build.mjs` ya no copia `tokens.css` a `dist/` (nada lo usaba: `exports` apunta a la raíz) y así el
  paquete no duplica fuentes e imágenes.

Subir desde 1.5.x: `npx hrl-core-ui upgrade v1.6.0`; después `npx hrl-core-ui init` para el icono
y la lista de pendientes.

## 1.5.0 — 21/09/2026

**Herramienta de integración: `npx hrl-core-ui`.** Integrar el kit en un proyecto eran
siete pasos manuales (instalar con el tag, cargar `tokens.css` antes que los estilos,
montar el sprite, importar solo del punto de entrada, escribir el contrato del
proyecto, añadir una prueba de humo, actualizar con el ciclo de tag). Es justo el tipo
de trabajo que falla cuando se hace a mano; ahora son dos comandos y una comprobación.
Sin dependencias nuevas: solo módulos de Node, dentro del paquete.

- **`init`** integra el proyecto: fija la versión, carga `tokens.css` antes que los
  estilos propios (estático o dinámico), escribe el contrato (`CLAUDE.md`, con un bloque
  del kit delimitado por marcas) y añade el script `kit:doctor`. Idempotente; `--dry-run`.
- **`doctor`** comprueba la integración: versión fija, instalada y coherente con el
  lockfile; orden de los estilos (un CSS de otra rama `if/else` no cuenta); imports por
  rutas internas; copia local del kit; sprite de iconos; **nombres obsoletos** (con
  `--fix` los reescribe); contrato; y que 10 componentes **se monten** con el React del
  proyecto. Código 1 si hay errores; `--strict` también con avisos (para CI).
- **`upgrade`** cambia el tag, instala, comprueba que **solo cambió el kit** en el
  lockfile (si no, lo restaura y reinstala), muestra el CHANGELOG entre versiones, refresca
  el bloque del contrato y corre `doctor`. Si `npm install` falla, deja `package.json` y
  el lockfile exactamente como estaban.
- `src/deprecated.js` exporta `DEPRECATED` (`icons` y `props`): una sola tabla de nombres
  obsoletos que leen los componentes y `doctor --fix`. Los alias ya existentes no cambian.
- `npm run cli` prueba la herramienta contra un proyecto de ejemplo (27 comprobaciones) y
  forma parte de `verificar` y del CI. `upgrade` se probó además con `npm install` real
  contra un repositorio git local con dos versiones etiquetadas, incluida la versión
  inexistente (restaura todo) y la repetida.
- Nuevos campos de `package.json`: `bin`, `repository`; `bin/` entra en `files`.

La herramienta viaja en el paquete desde esta versión: un proyecto anterior sube primero
a mano y desde ahí ya la tiene.

## 1.4.1 — 21/09/2026

Solo documentación. Corrige una afirmación **falsa** de 1.3.1.

1.3.1 decía que instalar con `git+https://` evitaba que el lockfile apuntara a
SSH. No es así: npm escribe `git+ssh://git@github.com/…` para cualquier repositorio
de GitHub, sea cual sea la forma de la dependencia. Tampoco obliga a tener una llave
SSH: probado con SSH desactivado, `npm ci` instala si hay credenciales https, y sin
ninguna credencial falla. El README lo explica ahora con lo comprobado y da la receta
para un CI (un token de solo lectura y `url.…insteadOf` para las dos direcciones).

## 1.4.0 — 21/09/2026

Los tooltips salen al costado del cursor y el menú desplegable queda dentro de la
ventana. Es un cambio de interacción deliberado (dónde aparecen), no de API.

**Tooltips.** Salían encima del cursor y, cerca del borde superior, se volteaban
hacia abajo arrancando a 6 px del puntero: lo tapaban. Además una transición de
0.12 s los dejaba atrás al mover el ratón y, al cambiar de lado, cruzaban por
debajo del cursor.
- Ahora salen **a la derecha del cursor** (20 px de separación, lo que libra la
  silueta del puntero), centrados en vertical, y pasan **a la izquierda** cuando
  no caben a la derecha. Siguen al cursor sin retardo.
- Con foco por teclado se anclan al costado del propio elemento, no encima.
- Pegados a un borde salían angostos y altos (157 px de ancho por 196 de alto):
  ahora llevan `width: max-content` y su ancho no depende del espacio libre.
- Comprobado con un navegador real en las cuatro esquinas, en una ventana de
  420 px, con `Calendar`, `SeriesBars` y `SelectionStrip`: ninguno tapa al
  cursor ni sale de la ventana.

**`DropdownMenu`.** Salía **fuera de pantalla**. Causa: `.hrl-menu` reutilizaba la
animación del tooltip, cuyo estado final es `translate(-50%, -100%)`, y el
`fill-mode: both` lo dejaba aplicado para siempre: el menú quedaba medio ancho a
la izquierda y todo su alto hacia arriba de donde debía (medido: `x -187…27`,
`y -71…78` para un botón en `x 32…149`). Además no miraba los bordes.
- Animación propia (`hrl-menuIn`).
- Mide su tamaño real al abrirse y se coloca **debajo del disparador o, si no cabe,
  encima**; se acota a la ventana en horizontal y, si no cabe entero por ningún
  lado, tiene desplazamiento propio (`max-height`).
- Con la flecha ↓ el foco sigue yendo al primer ítem.

**Interno.** `useFloatingTip` devuelve además `anchor(elemento, título, cuerpo)`
para el foco por teclado; `FloatingTip` acepta `gap` en el tip. Se retiran la
clase `hrl-tip--abajo` y sus keyframes. Nuevo `src/viewport.js`
(`anchoVisible()`): `window.innerWidth` cuenta el hueco de `scrollbar-gutter:
stable` (que `tokens.css` reserva en `<html>`) y el bloque contenedor de un
elemento fijo no, lo que dejaba las capas hasta 15 px fuera del área visible.

## 1.3.1 — 21/09/2026

Sin cambios de código ni de aspecto.

- `design.md` pasa a publicarse dentro del paquete: quien instala el kit puede
  leer el contrato en `node_modules/@hrl/core-ui/design.md` sin salir del proyecto.
- README: instalación con `git+https://` en lugar del atajo `github:` (que deja
  una dirección SSH en el lockfile y obliga a cada máquina a tener una llave con
  acceso), cómo autorizar un CI o servidor, el error `EALLOWSCRIPTS` y una guía
  paso a paso para consumir el kit en un proyecto.

## 1.3.0 — 19/09/2026

Toda la API pública queda en inglés y todos los tamaños de fuente salen de la
escala. Añade `design.md`, el contrato para modificar el kit.

**Nombres de icono en inglés.** 19 iconos tenían nombre en español; ahora se
nombran por lo que dibujan:

| Antes | Ahora | Antes | Ahora |
|---|---|---|---|
| `sh-chevron-abajo` | `sh-chevron-down` | `sh-sello` | `sh-stamp` |
| `sh-plegar` | `sh-sidebar-collapse` | `sh-semaforo` | `sh-traffic-light` |
| `sh-pastilla` | `sh-pill` | `sh-boletin` | `sh-bulletin` |
| `sh-gota` | `sh-drop` | `sh-bandeja` | `sh-inbox` |
| `sh-bisturi` | `sh-scalpel` | `sh-lapiz` | `sh-pencil` |
| `sh-lavadora` | `sh-washer` | `sh-tijeras` | `sh-scissors` |
| `sh-cubiertos` | `sh-cutlery` | `sh-caja` | `sh-box` |
| `sh-radiografia` | `sh-xray` | `sh-bebe` | `sh-baby` |
| `sh-llave` | `sh-wrench` | `sh-enviar` | `sh-send` |
| `sh-remitir` | `sh-share` | | |

Los nombres anteriores **siguen funcionando** (`ICON_ALIASES`) y avisan una vez
por nombre en desarrollo; se retiran en la próxima versión mayor.

**Valores de prop en inglés.** Mismo tratamiento, con los valores anteriores
aceptados como alias hasta la próxima mayor: `IconButton tone` (`plano` →
`plain`, `accion` → `action`), `DropdownMenu align` (`derecha` → `right`,
`izquierda` → `left`) y el `tone` de sus ítems (`peligro` → `danger`).

**Tamaños de fuente dentro de la escala.** El CSS tenía 35 `font-size` (y el
`DetailDialog` 5 `fontSize`) que no coincidían con ningún escalón: 13 px se
repetía 10 veces, junto a 10, 11.5, 12, 14.5, 15, 16, 18, 19, 20, 26 y 28.
Cada uno pasa al escalón más cercano; los empates suben, para no achicar texto:

| Antes | Ahora | Antes | Ahora |
|---|---|---|---|
| 10, 11.5 px | `--text-xs` (11) | 16, 18, 19 px | `--text-lg` (17) |
| 12 px | `--text-sm` (12.5) | 20 px | `--text-xl` (22) |
| 13 px | `--text-base` (13.5) | 26, 28 px | `--text-2xl` (30) |
| 14.5, 15 px | `--text-md` (14) | | |

**Es un cambio de aspecto**, de como máximo 2 px salvo la cifra del `GaugeArc`
(26 → 30 px). Sube el texto más chico (10 px era ilegible) y baja entre 0.5 y
2 px el de 14.5–19 px. `npm run literales` falla si un `font-size` vuelve a escribirse
como literal, y el CI lo ejecuta.

**Corregido.**
- 17 pictogramas (`sh-pill`, `sh-drop`, `sh-scalpel`…) tenían su `<symbol>`
  **dentro de cada `<Icon>`**, no en `IconSprite`: cada icono dibujado repetía en
  el DOM 17 definiciones con los mismos ids. Pasan a `IconSprite`, como el resto.
  Efecto: ahora, como los otros 34, **requieren `IconSprite` montado** (`AppShell`
  ya lo monta). La prueba de humo falla si un icono del registro no tiene su
  símbolo.
- El «Sin datos» de `GaugeArc` se partía en dos líneas y se salía del arco
  (ya pasaba antes; a 30 px se notaba más). Ahora va en una línea, a
  `--text-lg`, dentro del arco.
- Los comentarios de `tokens.json` mencionaban «tipo de cáncer» y módulos de una
  aplicación concreta; el kit no sabe de dominio (`design.md` § 1).

## 1.2.0 — 19/09/2026

La tipografía y las formas pasan a ser tan configurables como los colores.
Hasta ahora `--font-sans`, `--text-*` y `--radius-*` existían como tokens pero
casi ningún componente los usaba: el CSS tenía 53 radios y 85 tamaños de
fuente escritos como literal, así que cambiar un token no cambiaba nada.

- Toda `font-family` de `tokens.css` usa `var(--font-sans)` / `var(--font-mono)`
  (5 lugares que llevaban el nombre de la fuente escrito). Cambiar la fuente
  del sistema es ahora cambiar un token.
- 25 `border-radius` y 50 `font-size` que coincidían **exactamente** con un
  valor de la escala pasan a `var(--radius-*)` / `var(--text-*)`. Cada uno
  lleva el valor original como respaldo (`var(--radius, 12px)`), de modo que
  fuera de `.hrl-nuevo` / `.hrl-portal` —donde los tokens no existen— se ve
  igual que antes. Con los tokens por defecto el resultado es idéntico:
  se compararon las 72 historias del catálogo antes y después, y las
  diferencias que quedaron se explican por animaciones, datos aleatorios y
  la carga tardía de la fuente de Google, no por el CSS.
- Token nuevo `--radius-card` (16 px): es el radio de `Card`/`StatCard`, que
  no coincidía con ningún escalón de la escala.
- Sin cambios de API ni de aspecto por defecto. **Pendiente**: quedan
  literales que no coinciden con la escala (p. ej. `9px`, `13px`, `50%` de los
  círculos) y no se tocaron; llevarlos a la escala cambiaría el aspecto y es
  una decisión de diseño aparte.

Además, el repositorio suma un **catálogo visual** (Ladle): `npm run
ladle:serve`. Ver README.

## 1.1.2 — 18/09/2026

Solo declara `allowScripts` para `esbuild` en `package.json`, necesario para
instalar el kit por Git con npm reciente.

## 1.1.1 — 18/09/2026

Corrige los hallazgos que reportó `npm run contrast` en 1.1.0. Cada color se
oscureció lo mínimo posible en HSL (mismo matiz y saturación, solo baja la
luminosidad) para no cambiar la identidad de marca más de lo necesario.

- `--brand` (y con él `--primary`/`--success`/`--ring`) baja de `#00a76f` a
  `#008659` **en tema claro únicamente**: el texto blanco de un botón
  `primary` pasa de 3.11:1 a 4.62:1. El tema oscuro **conserva el verde
  original** — el mismo valor no puede servir a la vez al texto blanco del
  claro y al texto casi negro que ya usaba el oscuro (la ventana donde ambos
  llegan a 4.5:1 es de un punto de luminosidad, prácticamente inexistente);
  forzarlo habría bajado el oscuro de 5.35:1 a 3.65:1. Es la primera vez que
  `--brand` distingue tema, y queda documentado en tokens.json por qué.
- `--danger` baja de `#ff5630` a `#e52a00`: el texto blanco del botón
  `destructive` pasa de 3.17:1 a 4.52:1, en los dos temas (no está
  redefinido en oscuro).
- `--action-blue` baja de `#1877f2` a `#0e71f1`: el texto blanco del botón
  `accent` pasa de 4.23:1 a 4.52:1, en los dos temas.
- `--text-disabled` (de donde cuelga `--subtle-foreground`) baja de
  `#919eab` a `#8493a1` **en tema claro**, pero solo hasta 3:1, no 4.5:1: es
  el umbral que le corresponde porque su uso real es sobre todo iconografía
  (`EmptyState`, `StatCard`, `Steps`, iconos de `Input`) más un caso de
  estado deshabilitado, exento por la propia norma. Llevarlo a 4.5:1 lo
  dejaba a un paso de `--muted-foreground` (`#657585` contra `#637381`),
  perdiendo la diferencia entre "secundario" y "terciario" que existe a
  propósito. El texto oscuro no se tocó (ya daba 4.46:1, por encima de 3:1).
  El único uso real de texto que tenía —el metadato de una notificación en
  `AppShell`— se movió a `--muted-foreground`, que sí llega a 4.5:1.

Quedan, a propósito, tres combinaciones con `subtle-foreground` entre 3:1 y
4.5:1: es el trato correcto para un token pensado para iconos, no para texto
de lectura.

## 1.1.0 — 18/09/2026

`tokens.json` pasa a ser la única fuente de los tokens. `tokens.css` y
`src/preset.js` se generan desde ahí (`npm run tokens`) y dejan de editarse a
mano — que es exactamente cómo, sin que nadie lo notara, las dos copias del
kit habían llegado a diferir 658 líneas en esta hoja.

Consecuencia directa, no cosmética: `preset.color` tenía una selección hecha a
mano que se había desalineado de `tokens.css` — `row-hover`, `head-bg`,
`head-solido`, `fila-solida`, `toast-bg`, `brand-texto`, `text-primary`,
`text-secondary`, `text-disabled` y otros existían como variable CSS pero
`literalColor()` no podía devolverlos. Ahora `preset.color` cubre los 70
tokens de color declarados, en los dos temas. Aditivo: nada de lo que ya
existía cambió de valor ni de nombre.

Se agrega `preset.transition` (`fast`/`base`/`slow`, duración + curva ya
compuestas), resuelto desde los mismos tokens que `duration` y `ease`.

**Nuevo:** `npm run contrast` — verifica WCAG 2.1 AA (4.5:1 texto normal, 3:1
texto grande) de cada combinación texto/fondo real del sistema, en claro y en
oscuro. No bloquea el build. Primer resultado sobre esta paleta: dos
combinaciones no llegan ni al mínimo de texto grande (`subtle-foreground`
sobre fondo, ambas superficies, tema claro) y el texto blanco de los botones
`primary`, `destructive` y `accent` da entre 3.11:1 y 4.23:1 — por debajo de
4.5:1, el umbral que le corresponde a un texto de 13.5 px. Quedan reportadas,
no corregidas: cambiar un color de marca es una decisión de diseño.

## 1.0.0 — 17/09/2026

Primera versión extraíble. El kit venía funcionando dentro del Sistema de
Vigilancia Oncológica; esto es esa base, ya sin nada de ese hospital dentro.

**Componentes.** Primitivos (`Button`, `Input`, `CompactSelect`, `Checkbox`,
`NumberCell`, `Badge`, `Card`, `StatCard`, `Alert`, `Dialog`, `DetailDialog`,
`Tooltip`, `Tabs`, `Toast`, `DropdownMenu`, `Steps`, `SelectionStrip`,
`Skeleton`, `Spinner`, `EmptyState`), datos (`DataTable` con grupos de
columnas, `PaginatedTable`, `Pagination`, `Timeline`), gráficos en SVG y CSS
sin librería (`GaugeArc`, `Sparkline`, `StackedBars`, `SeriesBars`, `Funnel`,
`Ranking`, `SplitBar`, `Calendar`) y layout (`AppShell`, `PageHeader`,
`PageActions`, `FilterBar`).

**Lo que trae de serie, y no es casual:**

- Un dato ausente no se dibuja como cero. `SeriesBars` deja un hueco rotulado
  donde no hubo dato, y `NumberCell` distingue `null` de `0`.
- El color nunca es la única señal: cada estado lleva además icono o texto.
- Objetivo táctil de 40 px en todo control, y `aria-label` obligatorio en los
  que no tienen texto visible.
- Todo lo que flota (diálogos, menús, tooltips) se monta con portal, cierra con
  `Esc` y con clic exterior, y anima su salida antes de desmontarse.
- Modo oscuro por redefinición de tokens, nunca por reglas nuevas.

**API en inglés.** Nombres, props y valores. Los comentarios siguen en español.

**Sin dependencias.** Solo React como `peerDependency`. `esbuild` es
dependencia de desarrollo y no llega al consumidor.
