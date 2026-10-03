# Catálogo del Core UI

Índice de todo lo que ofrece `frontend/src/core-ui/`. Si algo no está aquí, no
existe en el sistema de diseño: créalo dentro del kit antes de usarlo, nunca en
el módulo que lo necesita.

**Stack real:** React 19 + Vite, CSS con custom properties. Sin Tailwind, sin
Radix, sin CVA, sin TanStack Table, sin TypeScript. El kit no tiene ninguna
dependencia más allá de React.

**Importación única:**

```jsx
import { Button, DataTable, PageHeader } from '@/core-ui';
```

También se puede importar por archivo (`@/core-ui/Button.jsx`) cuando importa
el tamaño del paquete.

**Idioma:** la API pública del kit —nombres, props y valores— está en inglés,
porque es el vocabulario del sistema de diseño y se comparte entre proyectos.
Los comentarios, las variables internas y el código de la aplicación siguen en
español.

---

## 1. Tokens

Los estilos no se escriben con valores, se escriben con tokens. La lista
completa está en `core-ui/tokens.css` (capa semántica) y en `core-ui/preset.js`
(mismo contenido como módulo JS).

`tokens.css` contiene los tokens y los estilos **del kit**, nada más. Lo propio
de cada sistema —sus tarjetas propias, su rejilla de paneles— vive en la hoja
de esa aplicación (aquí, `nuevo/estilos.css`), que se carga después. La
pantalla de ingreso y el logo del hospital **sí** son del kit (ver §5).

| Grupo | Tokens |
|---|---|
| Superficie | `--background` `--foreground` `--surface` `--muted` `--muted-foreground` `--subtle-foreground` |
| Acción | `--primary` `--primary-foreground` `--primary-strong` `--primary-hover` `--accent` `--accent-foreground` |
| Estado | `--destructive` `--destructive-foreground` `--destructive-text` `--success` `--success-text` `--warning` `--warning-fg` `--info` `--info-fg` |
| Fondos tenidos | `--info-soft` `--success-soft` `--warning-soft` `--destructive-soft` `--neutral-soft` |
| Formulario | `--border` `--input` `--input-border` `--ring` |
| Radios | `--radius` (12px) `--radius-xs` `-sm` `-md` `-lg` `-xl` `-full` |
| Sombras | `--shadow-sm` `--shadow-md` `--shadow-lg` `--shadow-overlay` |
| Tipografía | `--font-sans` `--font-mono` · `--text-xs` … `--text-2xl` · `--weight-*` · `--leading-*` |
| Movimiento | `--ease` `--duration-fast|base|slow` `--transition-fast|base|slow` |
| Táctil | `--touch-target` (40px) `--touch-target-lg` (44px) |
| Espaciado | `--space-1` … `--space-6` (4 · 8 · 12 · 16 · 24 · 32 px). Las separaciones entre bloques salen de aquí; `Stack` y `Grid` las usan por ti. |

El modo oscuro redefine **solo tokens**, nunca reglas. Se activa con
`data-tema-hrl="oscuro"` en `<html>`; lo gestiona `applyTheme()`.

```js
import { preset, token, literalColor, tokensToCss } from '@/core-ui';

token('primary');                 // 'var(--primary)'  ← para estilos
literalColor('primary', 'oscuro') // '#00a76f'         ← para canvas o SVG
tokensToCss();                    // el bloque CSS completo, para otro bundler
```

---

## 2. Primitivos

| Componente | Import | Props principales |
|---|---|---|
| `Button` | `@/core-ui` | `tone` cta·blue·ghost·danger·plain·link (`link`: acción que se lee como enlace, p. ej. abrir un registro desde su celda; 24 px de alto) · `size` md·sm · `icon` · `loading` · `disabled` · `onClick` |
| `IconButton` | `@/core-ui` | `icon` **(req.)** · `aria-label` **(req.)** · `tone` plain·action |
| `Input` | `@/core-ui` | `label` **(req.)** · `kind` text·number·date·password·select · `value` · `onChange` · `options` `{value,label}[]` · `groups` · `error` · `info` · `required` · `searchIcon` · `disabled` · `labelHidden` · `autoFocus` · `kind="password"` trae botón para mostrar/ocultar (`aria-pressed`). `error` y `hint` se asocian al control con `aria-describedby`; con `error`, `aria-invalid` |
| `Badge` | `@/core-ui` | `label` · `tone` ok·warn·crit·info·none |
| `Card` | `@/core-ui` | `title` · `subtitle` · `total` · `icon` (sh-…, junto al título) · `meta` (el estado: insignias o chips) · `actions` · `flush` · `wide` (siempre a lo ancho en un `Mosaic`) · `headingLevel` (2 por defecto) · `children`. La cabecera es una banda: icono, título, estado y acción a la misma altura. `accent` ya no se dibuja |
| `StatCard` | `@/core-ui` | `label` · `value` · `note` · `severity` neutral·normal·suspect·abnormal·nodata · `percent` · `info` · `delay` |
| `Alert` | `@/core-ui` | `tone` info·success·warning·error · `title` · `action` · `children` |
| `Dialog` | `@/core-ui` | `title` **(req.)** · `subtitle` · `onClose` **(req.)** · `maxWidth` · `footer` · `children` |
| `DetailDialog` | `@/core-ui` | `title` · `subtitle` · `badge` · `icon` · `tone` · `fields` · `block` · `aside` · `onClose` |
| `Tooltip` | `@/core-ui` | `title` · `body` **(req.)** · `focusable` · `as` · `style` · Con `focusable`, el objetivo mide al menos 24 px de alto sin mover el texto |
| `Tabs` | `@/core-ui` | `tabs` `{key,label}[]` · `active` · `onChange` · `alerts` · `style` |
| `Toast` | `@/core-ui` | `message` · `onClose` **(req.)** · `duration` (3600 ms) |
| `DropdownMenu` | `@/core-ui` | `trigger` **(req.)** · `items` `{id,label,icon,onSelect,tone,disabled,separator}[]` · `align` |
| `Skeleton` / `SkeletonRows` | `@/core-ui` | `width` · `height` · `radius` / `rows` · `columns` |
| `Spinner` | `@/core-ui` | `text` · `height` |
| `EmptyState` | `@/core-ui` | `icon` · `tone` · `title` **(req.)** · `body` · `children` |
| `Checkbox` | `@/core-ui` | `checked` · `onChange` (recibe el booleano) · `label` o `aria-label` **(req.)** · `disabled` |
| `NumberCell` | `@/core-ui` | `value` (número o `null`) · `onChange` · `aria-label` **(req.)** · `width` · `suffix` · `error` · `disabled` |
| `Steps` | `@/core-ui` | `steps` `{key,title,note,status}[]` · `active` · `onChange` · `label`. `status`: empty·partial·ok·error |
| `ProgressSteps` | `@/core-ui` | `steps` `{key,title,note?,status}[]` · `active` · `label`. Círculos unidos por una línea para un recorrido corto que va hacia adelante; **no se pulsa** (para navegar un formulario largo, `Steps`). `status`: empty·partial·ok·error |
| `SelectionStrip` | `@/core-ui` | `items` `{key,title,subtitle?,marked?,tip?,description?}[]` · `active` · `onChange` · `label` |
| `Calendar` | `@/core-ui` | `year` · `month` · `selected` · `onSelect` · `statusOf(d)` full·partial·empty · `detailOf(d)` · `descriptionOf(d)` · `legend` |

## 3. Datos

| Componente | Import | Props principales |
|---|---|---|
| `DataTable` | `@/core-ui` | `columns` **(req.)** · `rows` **(req.)** · `sort` · `onSortChange` · `rowKey` · `rowClass` · `legend` · `empty` · `loading` · `loadingRows` |
| `PaginatedTable` | `@/core-ui` | lo de `DataTable` más `accent` · `perPage` (10) · `resizable` · `presorted` |
| `Pagination` | `@/core-ui` | `page` · `totalPages` · `perPage` · `totalItems` · `onChange` · `onPerPageChange` |
| `usePagination` | `@/core-ui` | `(rows, perPage)` → `{pageRows, page, pages, total, goTo, changing, hasPages}` |

**Forma de una columna:**

```js
{
  key: 'nombre',          // clave del dato
  label: 'Nombre',        // cabecera
  width: 160,             // opcional
  align: 'left|right|center',
  sortable: true,
  numeric: true,          // ordena como número, no como texto
  tooltip: 'Qué significa esta columna',
  render: (fila) => <span>{fila.nombre}</span>,
  group: 'SIS',                 // rótulo sobre un tramo de columnas contiguas
  groupTooltip: 'Qué agrupa',   // aclaración de ese rótulo
}
```

## 4. Gráficos

`GaugeArc` · `Sparkline` · `StackedBars` · `SeriesBars` · `Funnel` · `Ranking` ·
`SplitBar`. Todos en SVG o CSS, sin librería. `StackedBars` lleva tooltip por
tramo y anima cada tramo por separado; acepta `unit` para nombrar lo que cuenta.

`SeriesBars` es la serie de una sola medida: `points` `{key?,label,title?,value,detail?}[]`
donde `value: null` **no se dibuja como cero**. Un hueco en medio de la serie
sale punteado y rotulado; los periodos vacíos del final se agrupan en un bloque
(`emptyTail`).

## 5. Layout

| Componente | Props |
|---|---|
| `AppShell` | `navItems` `{id,label,icon,group?,badge?,href?}[]` · `active` · `onSelect` · `title` · `subtitle` · `breadcrumbs` · `actions` · `user` `{name,email?,role?,avatar?}` · `logo` (por defecto `HrlLogo`, que con el menú plegado queda en solo el escudo; `null` la deja sin marca) · `brand` (nombre del sistema; el kit no lo sabe) · `themeKey` · `notifications` · `onSignOut` · `children`. Plegado, los módulos conservan la altura que tienen con el menú abierto. · El contenido es `<main id={ID_CONTENIDO}>` (exportado; enfóquelo al cambiar de pantalla) con enlace «Saltar al contenido». Por debajo de 900 px el menú es un cajón |
| `Stack` | `direction` column·row · `gap` 1…6 (escala `--space-*`) · `align` start·center·end·stretch·baseline · `justify` start·center·end·between · `wrap` · `as`. Una fila o columna con separación fija: reemplaza `style={{ display: 'flex', gap }}`. |
| `Grid` | `min` (px, 240 por defecto: cuantas celdas quepan) · `columns` (número fijo; sustituye a `min`) · `gap` 1…6 · `as`. |
| `Mosaic` | `min` (px, 420 por defecto) · `gap` 1…6 · `as`. Las secciones de una página, acomodadas solas: las `Card` cortas comparten fila; las que traen tabla, calendario, pasos o tira (o `wide`), y lo que no es tarjeta, ocupan la fila entera; una fila incompleta se reparte el ancho. |
| `HrlLogo` | `variant` full·mark · `width` (px o medida CSS) · `label`. El logo del Hospital Regional de Loreto, incluido en el paquete. `AppShell` lo pone solo en la barra lateral. |
| `LoginScreen` | `systemName` · `onSubmit({username,password})` (async; si lanza, se muestra su mensaje) · `backdrop` auto·none·dawn·morning·afternoon·dusk·lit-night·night · `labels` · `footer`. Pantalla de ingreso con la fachada del hospital según la hora. Ocupa exactamente la ventana, sin scroll: si no cabe, se desplaza la tarjeta. No consulta nada. · Campos con `autocomplete` (`username`, `current-password`, `new-password`): funcionan los gestores de contraseñas |
| `ChangePasswordScreen` | `systemName` · `onSubmit({current,next})` · `minLength` · `backdrop` · `labels` · `footer`. Cambio obligatorio de contraseña, con el mismo fondo. |
| `PageHeader` | `title` **(req.)** · `description` · `breadcrumbs` `{label,href?}[]` · `actions` |
| `PageActions` | `children`. Lleva controles de la vista abierta (periodo, Exportar) a la ranura de `PageHeader`, junto al título, sin subir su estado al shell. |
| `FilterBar` | `children` (los campos) · `actions` · `footer` · `columns` |

## 6. Hooks y utilidades

| Nombre | Para qué |
|---|---|
| `useExitAnimation(onClose)` | Retrasa el cierre para poder animar la salida. Lo usan Dialog, Toast y los cajones. |
| `useMountedWhile(open)` | Mantiene montado un bloque mientras se anima su desaparición. |
| `useExpandedRows()` | Filas desplegables con fase de cierre, para tablas con detalle. |
| `useFloatingTip()` | Tooltip único compartido por muchos objetivos (miles de celdas). |
| `readTheme(key)` / `applyTheme(tema, key)` | Modo claro/oscuro. La clave de almacenamiento es un parámetro: `hrl_theme` por defecto. |
| `memoize(key, fn)` / `invalidate(prefix)` | Caché de promesas por clave, viva durante la sesión. |
| `sortRows(rows, sort, columns)` | Orden estable respetando `numeric`. |
| `variants(base, map, defaults)` / `cx(...)` | Variantes de clase y unión condicional. |

---

## 7. Ejemplos mínimos

### 7.1 Formulario con validación visual

```jsx
import { useState } from 'react';
import { Button, Input, Alert, FilterBar } from '@/core-ui';

export function FormularioUsuario({ onGuardar }) {
  const [form, setForm] = useState({ usuario: '', clave: '', rol: 'digitador' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);

  const campo = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const enviar = () => {
    const errs = {};
    if (form.usuario.trim().length < 3) errs.usuario = 'Mínimo 3 caracteres.';
    if (form.clave.length < 8) errs.clave = 'Mínimo 8 caracteres.';
    setErrores(errs);
    if (Object.keys(errs).length) return;

    onGuardar(form).catch((e) => setError(e.message));
  };

  return (
    <>
      {error && <Alert tone="error" title="No se pudo guardar">{error}</Alert>}

      <FilterBar actions={<Button icon="sh-ok" onClick={enviar}>Guardar</Button>}>
        <Input
          label="Usuario"
          required
          value={form.usuario}
          onChange={campo('usuario')}
          error={errores.usuario}
          info="Identificador con el que ingresa al sistema."
        />
        <Input
          label="Contraseña"
          kind="password"
          required
          autoComplete="new-password"
          value={form.clave}
          onChange={campo('clave')}
          error={errores.clave}
        />
        <Input
          label="Rol"
          kind="select"
          options={['digitador', 'supervisor', 'administrador']}
          value={form.rol}
          onChange={campo('rol')}
        />
      </FilterBar>
    </>
  );
}
```

### 7.2 Tabla con ordenamiento, paginación y acción

```jsx
import { useState } from 'react';
import { PaginatedTable, Badge, IconButton, Tooltip } from '@/core-ui';

const columnas = (onVer) => [
  {
    key: 'codigo',
    label: 'Código',
    width: 120,
    sortable: true,
    tooltip: 'Identificador del registro en el sistema de origen.',
    // El identificador principal es el enlace de la fila.
    render: (f) => (
      <button type="button" className="hrl-enlace" onClick={() => onVer(f)}>
        {f.codigo}
      </button>
    ),
  },
  { key: 'nombre', label: 'Nombre', sortable: true },
  {
    key: 'total',
    label: 'Total',
    width: 110,
    align: 'right',
    sortable: true,
    numeric: true,
    render: (f) => f.total.toLocaleString('es-PE'),
  },
  {
    key: 'estado',
    label: 'Estado',
    width: 120,
    render: (f) => <Badge label={f.activo ? 'Activo' : 'Inactivo'} tone={f.activo ? 'ok' : 'none'} />,
  },
  {
    key: 'acciones',
    label: '',
    width: 64,
    align: 'right',
    // Y al final de la fila, el botón de acción explícito.
    render: (f) => (
      <div className="hrl-acciones-icono">
        <Tooltip title="Ver detalle" body="Abre la ficha completa del registro." focusable={false}>
          <IconButton icon="sh-eye" tone="action" aria-label={`Ver ${f.codigo}`} onClick={() => onVer(f)} />
        </Tooltip>
      </div>
    ),
  },
];

export function TablaRegistros({ filas, cargando, onVer }) {
  const [sort, setSort] = useState({ key: 'total', dir: 'desc' });

  return (
    <PaginatedTable
      columns={columnas(onVer)}
      rows={filas}
      sort={sort}
      onSortChange={setSort}
      rowKey={(f) => f.codigo}
      loading={loading}
      resizable
      empty="Ningún registro coincide con los filtros."
      legend={<span>El total agrupa todas las atenciones del periodo.</span>}
    />
  );
}
```

### 7.3 Modal de confirmación destructiva

```jsx
import { useState } from 'react';
import { Dialog, Button, Alert, Toast } from '@/core-ui';

export function BorrarPeriodo({ periodo, onBorrar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [toast, setToast] = useState(null);

  const borrar = async () => {
    setOcupado(true);
    try {
      await onBorrar(periodo);
      setConfirmando(false);
      setToast(`Periodo ${periodo} eliminado.`);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <>
      <Button tone="danger" icon="sh-trash" onClick={() => setConfirmando(true)}>
        Eliminar periodo
      </Button>

      {confirmando && (
        <Dialog
          title="Eliminar el periodo cargado"
          subtitle="Esta acción no se puede deshacer."
          onClose={() => setConfirmando(false)}
          maxWidth={520}
          footer={
            <>
              <Button tone="ghost" onClick={() => setConfirmando(false)}>Cancelar</Button>
              <Button tone="danger" loading={ocupado} loadingText="Eliminando…" onClick={borrar}>
                Sí, eliminar
              </Button>
            </>
          }
        >
          <Alert tone="warning" title={`Se borrarán todos los registros de ${periodo}`}>
            Los reportes que dependan de ese periodo dejarán de mostrarlo hasta que se vuelva a cargar.
          </Alert>
        </Dialog>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
```

### 7.4 Página completa dentro del `AppShell`

```jsx
import { useState } from 'react';
import { AppShell, IconSprite, PageHeader, Button, Card } from '@/core-ui';

const NAV = [
  { id: 'inicio', label: 'Inicio', icon: 'sh-home' },
  { id: 'reportes', label: 'Reportes', icon: 'sh-pie', group: 'Análisis' },
  { id: 'ajustes', label: 'Ajustes', icon: 'sh-gear', group: 'Administración' },
];

const TITULOS = {
  inicio: { title: 'Inicio', subtitle: 'Resumen del periodo en curso' },
  reportes: { title: 'Reportes', subtitle: 'Exportaciones y series históricas' },
  ajustes: { title: 'Ajustes', subtitle: 'Parámetros del sistema' },
};

export default function App({ usuario, onSalir }) {
  const [activo, setActivo] = useState('inicio');
  const meta = TITULOS[activo];

  return (
    <div className="hrl-nuevo">
      <IconSprite />

      <AppShell
        navItems={NAV}
        active={activo}
        onSelect={setActivo}
        logo={<img src="/logo.png" alt="Nombre de la institución" />}
        title={meta.title}
        subtitle={meta.subtitle}
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: meta.title }]}
        actions={<Button icon="sh-export" tone="blue">Exportar</Button>}
        user={{ name: usuario.nombre, email: usuario.correo, role: usuario.rol }}
        onSignOut={onSalir}
      >
        <div className="hrl-panel">
          <Card title="Contenido" subtitle="El módulo vive aquí dentro." accent="var(--primary)">
            <p>Lo que devuelva el módulo activo.</p>
          </Card>
        </div>
      </AppShell>
    </div>
  );
}
```

> `PageHeader` ya lo monta el `AppShell` con `title`/`subtitle`/`breadcrumbs`/
> `actions`. Se importa suelto solo para vistas que viven fuera del shell.

---

## 8. Qué no está en el kit (y por qué)

| Ausente | Motivo |
|---|---|
| Tailwind / preset de Tailwind | El sistema no usa Tailwind. `core-ui/preset.js` cumple el mismo papel: fuente única de tokens, importable desde otro proyecto. |
| Radix UI | Los primitivos que necesitan comportamiento (Dialog, DropdownMenu, Tooltip, Tabs) están implementados a mano con foco, `Esc`, clic exterior y navegación por teclado. |
| CVA | `variants()` en `core-ui/variantes.js` — mismo contrato en doce líneas. |
| TanStack Table | `DataTable` cubre orden, paginación, estado vacío y carga con props. Sin virtualización ni agrupación: si un módulo las necesita, se evalúa entonces. |
| lucide-react | El set vive en `core-ui/icons.jsx` como sprite SVG. Cambiar de set es sustituir ese archivo; el resto del código pide iconos por nombre. |
| Sonner | `Toast` propio, portalado y con animación de salida. |
| Botón con aspecto de enlace, tarjeta que se puede pulsar | Todavía no hay `Button tone="link"` ni un `Card` clicable. Mientras tanto, un `<button>` nativo se justifica con un comentario `hrl-nativo: motivo` (`doctor` lo respeta). |
| TypeScript | El proyecto es JS. Las formas de props están documentadas aquí y en los comentarios de cada componente. |
