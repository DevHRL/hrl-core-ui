/* Prueba de humo del paquete ya compilado.

   No comprueba el código fuente: importa `dist/`, que es lo que recibe quien
   instala, y monta cada componente. Así se detecta lo que un build correcto no
   ve —un import que no exporta lo que se le pide, un componente que lee una
   propiedad de undefined— y además se verifica que el compilado es importable
   tal cual, sin Vite ni configuración.

     node scripts/humo.mjs   (después de `npm run build`) */

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import * as kit from '../dist/index.js';

const CASOS = [
  ['Button', { children: 'Aceptar' }],
  ['Button', { tone: 'link', children: 'Abrir' }],
  ['Button', { tone: 'danger', size: 'sm', icon: 'sh-close', children: 'Eliminar' }],
  ['IconButton', { icon: 'sh-eye', 'aria-label': 'Ver' }],
  ['Input', { label: 'Campo' }],
  ['Input', { label: 'Clave', kind: 'password', autoComplete: 'current-password', error: 'Requerida', hint: 'Mínimo 10' }],
  ['Input', { label: 'Lista', kind: 'select', options: [{ value: 'a', label: 'A' }] }],
  ['Input', { label: 'Monto', kind: 'number', disabled: true }],
  ['CompactSelect', { 'aria-label': 'Año', options: ['2026'] }],
  ['Checkbox', { label: 'Incluir', checked: true, onChange: () => {} }],
  ['NumberCell', { 'aria-label': 'Atenciones', value: 4.5, onChange: () => {} }],
  ['Badge', { label: 'Activo', tone: 'ok' }],
  ['Card', { title: 'Sección', children: 'x' }],
  ['Card', { title: 'Subsección', headingLevel: 3, children: 'x' }],
  ['Card', { title: 'Banda', icon: 'sh-calendar', meta: 'Vencido', actions: 'Acción', wide: true, children: 'x' }],
  ['Mosaic', { children: 'x' }],
  ['Stack', { direction: 'row', gap: 3, align: 'center', justify: 'between', wrap: true, children: 'x' }],
  ['Grid', { min: 200, gap: 5, children: 'x' }],
  ['Grid', { columns: 3, children: 'x' }],
  ['HrlLogo', {}],
  ['HrlLogo', { variant: 'mark', width: 48 }],
  ['Mascot', {}],
  ['Mascot', { state: 'problem', size: 'lg', mouth: false, label: 'Hay errores' }],
  ['Mascot', { state: 'thinking', size: 120, interactive: true, onReact: () => {} }],
  ['LoginScreen', { systemName: 'Sistema de prueba', onSubmit: async () => {} }],
  ['LoginScreen', { backdrop: 'none', onSubmit: async () => {} }],
  ['ChangePasswordScreen', { onSubmit: async () => {} }],
  ['StatCard', { label: 'KPI', value: '10', severity: 'nodata', info: 'Qué mide' }],
  ['Alert', { tone: 'warning', title: 'Atención', children: 'x' }],

  ['Tooltip', { body: 'Explicación', children: 'x' }],
  ['TruncatedText', { text: 'Un texto largo', width: 200, label: 'Detalle' }],
  ['Tabs', { tabs: [{ key: 'a', label: 'A', icon: 'sh-gear' }], active: 'a', onChange: () => {} }],
  ['DropdownMenu', { trigger: 'x', items: [{ id: '1', label: 'Editar', onSelect: () => {} }] }],
  ['Steps', { steps: [{ key: 'a', title: 'Paso', note: 'faltan 2', status: 'partial' }], active: 'a', onChange: () => {} }],
  ['ProgressSteps', { steps: [{ key: 'a', title: 'Subir', status: 'ok' }, { key: 'b', title: 'Revisar', note: '2 errores', status: 'error' }], active: 'b' }],
  ['SelectionStrip', { items: [{ key: '1', title: '1', subtitle: 'L', marked: true }], active: '1', onChange: () => {} }],
  ['Calendar', { year: 2026, month: 9, selected: 3, onSelect: () => {}, statusOf: (d) => (d % 3 ? 'empty' : 'full') }],
  ['EmptyState', { title: 'Sin datos', body: 'x' }],
  ['Spinner', { text: 'Cargando…' }],
  ['Skeleton', {}],
  ['SkeletonRows', { rows: 2, columns: 3 }],
  ['Timeline', { title: 'Historial', items: [{ key: 'a', date: '2026-01-01', title: 'Evento' }] }],
  ['Pagination', { page: 1, totalPages: 3, totalItems: 30, onChange: () => {} }],
  ['DataTable', { columns: [{ key: 'a', label: 'A', group: 'SIS' }], rows: [{ a: 1 }] }],
  ['PaginatedTable', { columns: [{ key: 'a', label: 'A' }], rows: [{ a: 1 }] }],
  ['GaugeArc', { value: 42, color: 'var(--success)' }],
  ['GaugeArc', { value: null, color: 'var(--success)' }],
  ['Sparkline', { values: [1, 2, 3], color: 'var(--accent)' }],
  ['StackedBars', { labels: ['ene'], series: [{ name: 'S', color: 'var(--accent)', values: [1] }] }],
  ['SeriesBars', { points: [{ label: 'ene', value: 3 }, { label: 'feb', value: null }] }],
  ['Funnel', { stages: [{ name: 'A', value: 10, color: 'var(--accent)' }] }],
  ['Ranking', { rows: [{ name: 'A', value: 1, color: 'var(--accent)' }] }],
  ['SplitBar', { value: 1, total: 2, color: 'var(--accent)' }],
  ['PageHeader', { title: 'Vista' }],
  ['PageBanner', { title: 'Vista' }],
  ['PageBanner', { title: 'Portada', description: 'Hoy', clock: true, mascot: 'idle', status: { icon: 'sh-clock', label: 'Pendiente', detail: 'Hasta el 5', tone: 'warning' } }],
  ['FilterBar', { children: 'x' }],
  ['IconSprite', {}],
  ['Icon', { name: 'sh-ok' }],
];

/* Dialog, DetailDialog y Toast se montan con createPortal en document.body,
   que en Node no existe: no se pueden renderizar aquí sin traer un DOM falso,
   y un DOM falso taparía los errores que esta prueba busca. De ellos se
   comprueba que el paquete los exporta; su render lo cubre la prueba de humo
   de la aplicación, que corre con el cargador de Vite. */
const PORTALES = ['Dialog', 'DetailDialog', 'Toast'];

/* En SSR no hay almacenamiento; sin esto fallaría por el entorno y no por un
   defecto del componente. */
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

let fallos = 0;
for (const [nombre, props] of CASOS) {
  try {
    const Componente = kit[nombre];
    if (!Componente) throw new Error('el paquete no exporta ' + nombre);
    renderToString(createElement(Componente, props));
    console.log(`  ok   ${nombre}(${Object.keys(props).join(', ') || '—'})`);
  } catch (e) {
    fallos += 1;
    console.log(`  FALLA ${nombre}\n        ${e.message.split('\n')[0]}`);
  }
}

for (const nombre of PORTALES) {
  if (typeof kit[nombre] === 'function') {
    console.log(`  ok   ${nombre} (solo export: usa portal y necesita DOM)`);
  } else {
    fallos += 1;
    console.log(`  FALLA ${nombre}: el paquete no lo exporta`);
  }
}

/* Nombres en español que la API tuvo antes de pasar a inglés: tienen que seguir
   funcionando hasta la próxima versión mayor, y el registro no puede volver a
   tener un icono sin su <symbol> (un renombrado a medias se ve en blanco, no
   revienta el render). */
const sprite = renderToString(createElement(kit.IconSprite));
const html = (nombre, props) => renderToString(createElement(kit[nombre], props));
const ASERCIONES = [
  ['todo icono del registro tiene su <symbol>', () => kit.ICONS.every((n) => sprite.includes(`id="${n}"`))],
  ['todo alias apunta a un icono registrado', () => Object.values(kit.ICON_ALIASES).every((n) => kit.ICONS.includes(n))],
  ['ningún alias sigue en el registro', () => kit.ICONS.every((n) => !(n in kit.ICON_ALIASES))],
  ['Icon con nombre obsoleto resuelve al nuevo', () => html('Icon', { name: 'sh-pastilla' }).includes('#sh-pill')],
  ['Icon con nombre nuevo', () => html('Icon', { name: 'sh-pill' }).includes('#sh-pill')],
  ['IconButton tone="action"', () => html('IconButton', { icon: 'sh-eye', 'aria-label': 'Ver', tone: 'action' }).includes('hrl-accion')],
  ['IconButton tone="accion" (obsoleto)', () => html('IconButton', { icon: 'sh-eye', 'aria-label': 'Ver', tone: 'accion' }).includes('hrl-accion')],
  ['IconButton por defecto no es de acción', () => !html('IconButton', { icon: 'sh-eye', 'aria-label': 'Ver' }).includes('hrl-accion')],
  ['la fachada sigue la hora: 5→amanecer, 9→mañana, 14→tarde, 18→atardecer, 20→noche iluminada, 23 y 3→noche',
    () => [[5, 'dawn'], [9, 'morning'], [14, 'afternoon'], [18, 'dusk'], [20, 'lit-night'], [23, 'night'], [3, 'night']].every(([h, f]) => kit.backdropForHour(h) === f)],
  ['los seis fondos del login existen como clase', () => kit.LOGIN_BACKDROPS.length === 6],
  ['LoginScreen con fondo fijo pinta esa fachada', () => html('LoginScreen', { backdrop: 'dusk', onSubmit: () => {} }).includes('hrl-login--dusk')],
  ['LoginScreen con backdrop="none" no pinta ninguna', () => !html('LoginScreen', { backdrop: 'none', onSubmit: () => {} }).includes('hrl-login--')],
  ['LoginScreen lleva el logo y el nombre del sistema', () => { const h = html('LoginScreen', { systemName: 'Mi sistema', onSubmit: () => {} }); return h.includes('hrl-logo') && h.includes('Mi sistema'); }],
  ['ChangePasswordScreen pide tres contraseñas', () => (html('ChangePasswordScreen', { onSubmit: () => {} }).match(/type="password"/g) || []).length === 3],
  ['Stack: la separación sale de la escala de espaciado', () => html('Stack', { gap: 5 }).includes('var(--space-5)')],
  ['Grid: sin columns reparte con auto-fill', () => html('Grid', { min: 200 }).includes('auto-fill')],
  ['HrlLogo tiene texto alternativo', () => html('HrlLogo', {}).includes('aria-label="Hospital Regional de Loreto"')],
  ['AppShell sin logo dibuja el del hospital', () => html('AppShell', { navItems: [], title: 'x' }).includes('hrl-logo')],
  ['AppShell con logo={null} no dibuja ninguno', () => !html('AppShell', { navItems: [], title: 'x', logo: null }).includes('hrl-logo')],
  ['AppShell con banner dibuja la banda y no la cabecera de la barra', () => {
    const h = html('AppShell', { navItems: [], title: 'x', banner: { status: { label: 'Pendiente' } } });
    return h.includes('hrl-banda') && !h.includes('hrl-pagehead');
  }],
  ['Input con autoFocus lo declara', () => html('Input', { label: 'X', autoFocus: true }).length > 0],
];
for (const [nombre, prueba] of ASERCIONES) {
  let ok = false;
  try { ok = prueba(); } catch (e) { console.log(`  FALLA ${nombre}\n        ${e.message.split('\n')[0]}`); }
  if (ok) console.log(`  ok   ${nombre}`);
  else { fallos += 1; console.log(`  FALLA ${nombre}`); }
}

/* El barril tiene que exportar todo lo que documenta el catálogo: un export
   que se olvida al renombrar no lo detecta ningún build. */
const esperados = ['Button', 'Input', 'DataTable', 'AppShell', 'PageActions', 'usePagination',
  'useExitAnimation', 'useExpandedRows', 'ICON_ALIASES', 'DEPRECATED', 'useFloatingTip', 'readTheme', 'applyTheme',
  'memoize', 'invalidate', 'sortRows', 'nextSort', 'variants', 'cx', 'preset', 'token', 'ICONS',
  'Stack', 'Grid', 'HrlLogo', 'LoginScreen', 'ChangePasswordScreen', 'backdropForHour', 'LOGIN_BACKDROPS'];
const faltan = esperados.filter((n) => !(n in kit));
if (faltan.length) {
  fallos += 1;
  console.log(`  FALLA barril: no exporta ${faltan.join(', ')}`);
}

console.log(`\n${fallos === 0 ? 'Sin fallos.' : `${fallos} fallo(s).`}`);
process.exit(fallos === 0 ? 0 : 1);
