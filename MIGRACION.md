# Migrar un frontend existente al kit

Guía para pasar una interfaz que ya existe (HTML/CSS propio, o React con estilos
propios) a `@hrl/core-ui`. Sale de la primera migración completa a un proyecto real
(`ficha_14`, Sistema de Vigilancia Oncológica): lo que falló ahí está aquí, con su
arreglo, para que el siguiente proyecto no tenga que descubrirlo otra vez.

Viaja dentro del paquete: `node_modules/@hrl/core-ui/MIGRACION.md`.

## El recorrido

1. **Instalar e integrar** — `npm i "git+https://github.com/GiancarloChavez/hrl-core-ui.git#vX.Y.Z"`
   y `npx hrl-core-ui init`. Fija la versión, carga los tokens antes que tus estilos,
   escribe el contrato (`CLAUDE.md`), **cambia el icono de pestaña de Vite por el escudo
   del hospital** y te dice, en pasos «manual», lo que falta de la lista de abajo.
2. **Quitar lo heredado**: la hoja de estilos global antigua, los `<script>`/`<link>` a
   CDN de `index.html` y el JS que pintaba el DOM a mano. El kit y los estilos viejos
   no conviven: los globales del sistema anterior invaden los componentes. Borra también
   los CSS que ya nadie importa: `doctor` los cuenta como colores literales.
3. **Montar `<AppShell>`** con la navegación, el usuario, `brand` y `themeKey`. El logo
   del hospital lo pone solo.
4. **Pantalla de ingreso**: `<LoginScreen>` (y `<ChangePasswordScreen>` si el sistema
   obliga a cambiar la clave). Ver «Ingreso».
5. **Pasar los paneles uno a uno** con la tabla de equivalencias (más abajo).
6. **Comprobar**: `npx hrl-core-ui doctor` (0 errores y 0 avisos), la compilación del
   proyecto **y abrir la aplicación de verdad** (ver «Probar de punta a punta»).

`npx hrl-core-ui init` es idempotente: repetirlo no rompe nada, y es la forma de
volver a ver la lista de pendientes.

## Lo que una migración deja a medias

Ninguno de estos rompe la compilación, así que compilar y pasar las pruebas **no los
detecta**. `doctor` los marca como avisos e `init` los lista con su arreglo (o lo aplica,
cuando no hay nada que adivinar).

| Síntoma | Causa | Arreglo |
|---|---|---|
| Tipografía distinta o «de Arial» | Antes el kit pedía las fuentes a Google Fonts; sin internet caían en Helvetica/Arial | **Resuelto en 1.6.0**: las fuentes viajan en el paquete. Sube a ≥ 1.6.0 (`npx hrl-core-ui upgrade latest`); no hay nada que configurar |
| Sin logo en la barra lateral, o el logo viejo | `<AppShell>` de una versión anterior, o un `logo={…}` propio con el escudo antiguo | **Resuelto en 1.6.0**: `AppShell` dibuja `HrlLogo` si no le pasas `logo`. Borra tu `logo={…}` |
| Icono de pestaña morado (Vite) | `index.html` sigue con el `favicon.svg` de la plantilla | **`npx hrl-core-ui init` lo cambia** por el escudo del hospital (`public/icono-hrl.png`) |
| Iconos o estilos que aparecen y desaparecen | `<script src="https://unpkg.com/…">` o `@import` de un CDN en `index.html`/CSS: dependen de la salida a internet del equipo | Quitarlos. Iconos: `<Icon name="sh-…" />` (el sprite ya viene en el kit) |
| Página en blanco justo después de subir el kit (`does not provide an export named …`) | Vite conserva en `node_modules/.vite` el kit pre-empaquetado de la versión anterior | `npx hrl-core-ui upgrade` la borra; si subiste a mano: `rm -rf node_modules/.vite` y reinicia el servidor de desarrollo |
| El logo o el icono de pestaña son los de antes | Un `logo-icon.png` (u otro archivo) copiado en `public/` y enlazado a mano | Borra el archivo y su referencia: `AppShell` y `LoginScreen` ya traen el logo actual, y `init` cambia el icono de pestaña |
| Un elemento sale sin estilo | Clase `hrl-…` en el código que nadie define | Definirla en los estilos del proyecto o pedir el componente al kit |
| Colores que no cambian con el tema oscuro | Colores escritos como literal (`'#0284C7'`, `#1E293B`) | `var(--primary)`, `var(--serie-1…8)` para series; en JS, `token('serie-1')` |
| Botones o campos con otro aspecto | `<button>`, `<input>`, `<select>`, `<table>` nativos | El componente del kit (el aviso dice cuál). Excepción justificada: comentario `hrl-nativo: motivo` en esa línea, la anterior o dentro de la etiqueta |

## Ingreso

```jsx
import { LoginScreen } from '@hrl/core-ui';

<LoginScreen
  systemName="Sistema Web de Oncología & Auditoría HIS"
  onSubmit={async ({ username, password }) => {
    const datos = await api('/api/login', { method: 'POST', body: { username, password } });
    setToken(datos.token);          // si algo falla, lanza un Error: su mensaje se muestra
    await entrar(datos.usuario);
  }}
/>
```

- La fachada del hospital cambia con la hora (amanecer 5–7, mañana 7–12, tarde 12–17,
  atardecer 17–19, noche iluminada 19–22, noche el resto). `backdrop="none"` la quita y
  `backdrop="dusk"` (u otra) la fija. Mientras la imagen baja se ve el color de fondo.
- El kit no consulta nada: la sesión, el endpoint y el token son del sistema.
- `<ChangePasswordScreen onSubmit={({ current, next }) => …} />` es la pantalla del cambio
  obligatorio de clave, con el mismo fondo.
- Los archivos (logo, escudo y fachadas en WebP, ~1,2 MB) están en el paquete y se
  empaquetan solos al importar `tokens.css`. El navegador solo descarga el de la hora.
- La pantalla ocupa exactamente la ventana y no tiene scroll (desde 1.7.0). Si el proyecto
  la corregía en su propio CSS (`.hrl-nuevo.hrl-login { height: 100vh … }`), se borra.

## Menú lateral

- Sin `logo`, `AppShell` pone el del hospital y, con el menú plegado, solo el escudo (desde
  1.7.0). Un `logo` propio que hacía eso mismo (dos `HrlLogo` y un contenedor de alto fijo) se
  borra, junto con el CSS que ocultaba los rótulos de grupo al plegar.

## Probar de punta a punta

`doctor` y la compilación no ven un servidor caído. En `ficha_14` el login daba 502
porque el proxy de desarrollo (`vite.config.js`) apuntaba al puerto 8001 y el backend
escucha en el 8000; todo lo demás estaba en verde. Antes de dar por terminada una
migración:

1. Levantar el backend y el frontend de desarrollo.
2. Comprobar que el puerto del `proxy` de `vite.config.js` es el del backend
   (`curl -i http://localhost:<puerto-de-vite>/api/<ruta-publica>`: debe llegar al
   backend, no dar 502/504).
3. Entrar con un usuario real y recorrer **cada** módulo del menú.
4. Abrir la aplicación con la red sin salida a internet (o con las herramientas del
   navegador en «Sin conexión»): debe verse igual.

## Equivalencias

Lo que se usó en la migración de `ficha_14`, del patrón manual al componente del kit:

| Antes | Ahora |
|---|---|
| Tarjetas de cifras (`kpi-grid`, `tarjetasKpi`) | `StatCard` dentro de un `Grid` |
| Medidor SVG de un indicador (`createRadialGaugeSVG`) | `GaugeArc` |
| Barras horizontales / listas con porcentaje | `Ranking` |
| Interruptor «gráficos / tabla» | `Tabs` |
| `tabla()` + paginación a mano | `DataTable`, `PaginatedTable` |
| Secciones con título | `Card` |
| `style={{ display: 'flex', gap: '1rem' }}` y rejillas escritas a mano | `Stack`, `Grid` (separación de la escala `--space-1…6`) |
| Avisos flotantes propios | `Toast` |
| Cargando… | `Spinner`, `Skeleton` |
| Selectores, campos de texto y fechas | `Input` |
| Barra lateral y cabecera propias | `AppShell` |
| Pantalla de ingreso propia | `LoginScreen`, `ChangePasswordScreen` |
| Logo copiado en `public/` | `HrlLogo` (o el que pone `AppShell`) |

## Lo que el kit todavía no cubre

Se anota aquí para que se pida al kit en vez de resolverse distinto en cada proyecto:

- **Botón con aspecto de enlace** (`Button tone="link"`) y **tarjeta que se puede pulsar**
  (una `Card` clicable): en `ficha_14` quedan 4 `<button>` nativos por esto. Se justifican
  con un comentario `hrl-nativo: motivo` hasta que existan.
- **`<input type="file">`**: no hay componente; se deja oculto tras un `Button` y `doctor` no
  lo marca.
- **El proxy de desarrollo**: ninguna herramienta lo comprueba (ver «Probar de punta a punta»).
