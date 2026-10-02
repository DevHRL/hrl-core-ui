/* `hrl-core-ui doctor`: comprueba que un proyecto consume bien el kit.

   Cada comprobación devuelve {nivel, titulo, detalle?, arreglo?}. Los niveles
   son `error` (rompe o incumple el contrato), `aviso` (conviene arreglarlo),
   `info` (dato, no exige nada) y `ok`. Con `--fix` se corrigen solos los
   nombres obsoletos, que es lo único que se puede reescribir con seguridad. */
import { existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DEPRECATED } from '../../dist/deprecated.js';
import {
  KIT, especificacionKit, etiquetaDe, finDeEtiqueta, fuentes, entradaDe, importsDe, leerTexto, lineaDe, raizGit, versionInstalada,
} from './proyecto.mjs';
import { revisiones } from './revisiones.mjs';

const ESCALA_FUENTE = new Set([11, 12.5, 13.5, 14, 17, 22, 30]);
const TOKENS_CSS = '@hrl/core-ui/tokens.css';

/* Un componente montado con datos mínimos: si el paquete no resuelve, si React
   no es compatible o si un import está roto, esto lo dice sin abrir el navegador. */
const CASOS = [
  ['Button', { children: 'Aceptar' }],
  ['Card', { title: 'Sección', children: 'x' }],
  ['Badge', { label: 'Activo', tone: 'ok' }],
  ['StatCard', { label: 'KPI', value: '10' }],
  ['Alert', { title: 'Aviso', children: 'x' }],
  ['Icon', { name: 'sh-ok' }],
  ['IconSprite', {}],
  ['EmptyState', { title: 'Sin datos' }],
  ['Spinner', {}],
  ['DataTable', { columns: [{ key: 'a', label: 'A' }], rows: [{ a: 1 }] }],
];

/* ¿Dos posiciones del texto están en el mismo bloque `{ … }`? Si entre la primera y la
   segunda se cierra una llave que no se abrió ahí, la primera está en otra rama (un
   `if` y su `else`): nunca se ejecutan juntas y el orden entre ellas no importa. */
function mismoBloque(texto, desde, hasta) {
  let prof = 0;
  for (const c of texto.slice(desde, hasta)) {
    if (c === '{') prof++;
    else if (c === '}' && --prof < 0) return false;
  }
  return true;
}

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Nombres obsoletos de un archivo: [{linea, de, a, donde}] y el texto ya corregido. */
export function obsoletosDe(texto) {
  const cambios = [];
  let corregido = texto;

  // Iconos: cualquier literal 'sh-…' que sea un nombre viejo.
  corregido = corregido.replace(/(['"`])(sh-[a-z0-9-]+)\1/g, (todo, comilla, nombre, indice) => {
    const nuevo = DEPRECATED.icons[nombre];
    if (!nuevo) return todo;
    cambios.push({ linea: lineaDe(texto, indice), de: nombre, a: nuevo, donde: 'icono' });
    return `${comilla}${nuevo}${comilla}`;
  });

  // Valores de prop en las etiquetas <IconButton …> y <DropdownMenu …>.
  for (const [componente, props] of Object.entries(DEPRECATED.props)) {
    for (const [prop, valores] of Object.entries(props)) {
      if (prop === 'itemTone') continue;
      const patron = new RegExp(`\\b${prop}\\s*=\\s*(["'])(${Object.keys(valores).map(escapar).join('|')})\\1`, 'g');
      let salida = '';
      let cursor = 0;
      for (const m of corregido.matchAll(new RegExp(`<${componente}\\b`, 'g'))) {
        const fin = finDeEtiqueta(corregido, m.index);
        if (fin < 0 || m.index < cursor) continue;
        const etiqueta = corregido.slice(m.index, fin + 1);
        const nueva = etiqueta.replace(patron, (todo, comilla, valor, pos) => {
          cambios.push({ linea: lineaDe(corregido, m.index + pos), de: `${prop}="${valor}"`, a: `${prop}="${valores[valor]}"`, donde: componente });
          return `${prop}=${comilla}${valores[valor]}${comilla}`;
        });
        salida += corregido.slice(cursor, m.index) + nueva;
        cursor = fin + 1;
      }
      corregido = salida + corregido.slice(cursor);
    }
  }

  // tone de los ítems de un DropdownMenu, solo en archivos que lo importan del kit.
  if (/\bDropdownMenu\b/.test(corregido) && importsDe(corregido, /^@hrl\/core-ui$/).length) {
    const valores = DEPRECATED.props.DropdownMenu.itemTone;
    corregido = corregido.replace(new RegExp(`\\btone\\s*:\\s*(['"])(${Object.keys(valores).join('|')})\\1`, 'g'), (todo, comilla, valor, indice) => {
      cambios.push({ linea: lineaDe(corregido, indice), de: `tone: '${valor}'`, a: `tone: '${valores[valor]}'`, donde: 'DropdownMenu' });
      return `tone: ${comilla}${valores[valor]}${comilla}`;
    });
  }
  return { cambios, corregido };
}

async function humoDeRender(dir) {
  const req = createRequire(join(dir, 'package.json'));
  const React = req('react');
  const { renderToString } = req('react-dom/server');
  globalThis.localStorage ??= { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  const kit = await import(pathToFileURL(join(dir, 'node_modules', '@hrl', 'core-ui', 'dist', 'index.js')).href);
  const fallos = [];
  for (const [nombre, props] of CASOS) {
    try {
      if (!kit[nombre]) throw new Error('el paquete no lo exporta');
      renderToString(React.createElement(kit[nombre], props));
    } catch (e) {
      fallos.push(`${nombre}: ${e.message.split('\n')[0]}`);
    }
  }
  return { total: CASOS.length, fallos };
}

export async function doctor({ dir, pkg }, { fix = false } = {}) {
  const r = [];
  const anota = (nivel, titulo, detalle, arreglo) => r.push({ nivel, titulo, detalle, arreglo });
  const rel = (ruta) => relative(dir, ruta).replace(/\\/g, '/');

  // 1. El kit: declarado con versión fija, instalado y coherente con el lockfile.
  const espec = especificacionKit(pkg);
  const instalada = versionInstalada(dir);
  if (!espec) anota('error', 'El kit no está declarado en package.json', null, 'npm i "git+https://github.com/DevHRL/hrl-core-ui.git#vX.Y.Z"');
  else {
    const etiqueta = etiquetaDe(espec.valor);
    if (!etiqueta) anota('aviso', 'El kit no tiene la versión fija', `"${espec.valor}" no termina en #vX.Y.Z (ni #vX.Y.Z-pre.N): npm tomaría la rama por defecto y el kit se movería bajo el proyecto.`, 'npx hrl-core-ui upgrade vX.Y.Z');
    if (!instalada) anota('error', 'El kit no está instalado', null, 'npm install');
    else if (etiqueta && etiqueta !== instalada) anota('error', `Versión instalada (${instalada}) distinta de la declarada (${etiqueta})`, null, 'npm install');
    else anota('ok', `Kit ${instalada} declarado e instalado`);
  }

  // 2. Los tokens se cargan una vez y antes que los estilos de la aplicación.
  const entrada = entradaDe(dir);
  if (!entrada) anota('aviso', 'No encuentro el punto de entrada (src/main.jsx…)', 'No puedo comprobar que se cargue tokens.css.');
  else {
    const texto = leerTexto(join(dir, entrada));
    const css = importsDe(texto, /\.css$/);
    const kit = css.find((i) => i.modulo === TOKENS_CSS);
    const otros = css.filter((i) => i.modulo !== TOKENS_CSS);
    if (!kit) anota('error', `${entrada} no carga ${TOKENS_CSS}`, 'Sin los tokens los componentes se ven sin tipografía, colores ni espaciado.', 'npx hrl-core-ui init');
    else if (otros.some((i) => i.indice < kit.indice && mismoBloque(texto, i.indice, kit.indice))) {
      const antes = otros.find((i) => i.indice < kit.indice && mismoBloque(texto, i.indice, kit.indice));
      anota('error', `${entrada} carga estilos propios antes que ${TOKENS_CSS}`, `"${antes.modulo}" va antes: los estilos de la aplicación tienen que poder ajustar los del kit, no al revés.`, 'Mueve la carga de tokens.css antes.');
    }
    else anota('ok', `${entrada} carga tokens.css antes que los estilos propios`);
  }

  const archivos = fuentes(dir);
  const textos = new Map(archivos.map((a) => [a, leerTexto(a)]));

  // 3. Solo el punto de entrada público; y ninguna copia local del kit.
  const internos = [];
  for (const [archivo, texto] of textos) {
    for (const i of importsDe(texto, /^@hrl\/core-ui\//)) {
      const resto = i.modulo.slice(KIT.length + 1);
      if (resto !== 'tokens.css' && resto !== 'package.json') internos.push(`${rel(archivo)}:${lineaDe(texto, i.indice)}  ${i.modulo}`);
    }
  }
  if (internos.length) anota('error', `${internos.length} import(s) por ruta interna del kit`, internos.slice(0, 6).join('\n'), "Importa de '@hrl/core-ui': todo lo público sale de ahí.");
  else anota('ok', 'Todos los imports salen del punto de entrada público');
  if (existsSync(join(dir, 'src', 'core-ui'))) anota('aviso', 'Hay una copia local del kit en src/core-ui', 'Es lo que hace divergir a los proyectos en silencio.', 'Bórrala y consume el paquete.');

  // 4. El sprite de iconos: sin él, casi todos los iconos se ven en blanco.
  const conSprite = [...textos.values()].some((t) => /\b(AppShell|IconSprite|Sprite)\b/.test(t) && importsDe(t, /^@hrl\/core-ui$/).length);
  if (conSprite) anota('ok', 'El sprite de iconos está montado (AppShell o IconSprite)');
  else anota('aviso', 'No veo AppShell ni <IconSprite /> en el código', 'Sin el sprite, los iconos se ven en blanco.', "Monta <AppShell> (ya lo trae) o <IconSprite /> una vez en la raíz.");

  // 5. Nombres obsoletos.
  const obsoletos = [];
  for (const [archivo, texto] of textos) {
    const { cambios, corregido } = obsoletosDe(texto);
    if (!cambios.length) continue;
    obsoletos.push(...cambios.map((c) => ({ ...c, archivo: rel(archivo) })));
    if (fix) writeFileSync(archivo, corregido);
  }
  if (!obsoletos.length) anota('ok', 'No hay nombres obsoletos del kit en uso');
  else if (fix) anota('ok', `${obsoletos.length} nombre(s) obsoleto(s) corregido(s)`, obsoletos.slice(0, 8).map((o) => `${o.archivo}:${o.linea}  ${o.de} → ${o.a}`).join('\n'));
  else anota('aviso', `${obsoletos.length} uso(s) de nombres obsoletos`, obsoletos.slice(0, 8).map((o) => `${o.archivo}:${o.linea}  ${o.de} → ${o.a}`).join('\n') + (obsoletos.length > 8 ? `\n… y ${obsoletos.length - 8} más` : ''), 'npx hrl-core-ui doctor --fix');

  // 6. El contrato del proyecto menciona el kit.
  const contrato = [join(dir, 'CLAUDE.md'), join(raizGit(dir), 'CLAUDE.md')].find(existsSync);
  if (contrato && leerTexto(contrato).includes(KIT)) anota('ok', `${rel(contrato)} documenta el kit`);
  else anota('aviso', 'El proyecto no tiene un contrato que mencione el kit', 'Sin él, quien trabaje aquí no sabe que un componente nuevo se pide en el repositorio del kit.', 'npx hrl-core-ui init');

  // 7. El paquete resuelve y sus componentes se montan.
  if (instalada) {
    try {
      const { total, fallos } = await humoDeRender(dir);
      if (fallos.length) anota('error', `${fallos.length} de ${total} componentes no se montan`, fallos.join('\n'), 'Revisa que React sea compatible con la versión del kit (peer >= 19).');
      else anota('ok', `${total} componentes del kit se montan (React ${createRequire(join(dir, 'package.json'))('react/package.json').version})`);
    } catch (e) {
      anota('error', 'No se pudo montar el kit', e.message.split('\n')[0], 'npm install');
    }
  }

  // 8. Lo que una migración suele dejar a medias (marca, icono, recursos externos, clases sin definir).
  for (const x of revisiones(dir)) anota(x.nivel, x.titulo, x.detalle, x.arreglo);

  // 9. Dato, no exigencia: tamaños de fuente propios fuera de la escala.
  let fuera = 0;
  const cssPropios = fuentes(dir, /\.css$/);
  for (const a of cssPropios) for (const m of leerTexto(a).matchAll(/font-size:\s*([0-9.]+)px/g)) if (!ESCALA_FUENTE.has(parseFloat(m[1]))) fuera++;
  for (const t of textos.values()) for (const m of t.matchAll(/fontSize:\s*([0-9.]+)(?![0-9.]|\s*['"px])/g)) if (!ESCALA_FUENTE.has(parseFloat(m[1]))) fuera++;
  if (fuera) anota('info', `${fuera} tamaño(s) de fuente propios fuera de la escala (11, 12.5, 13.5, 14, 17, 22, 30)`, 'Los componentes del kit ya la usan; en este proyecto son literales.');

  return { resultados: r, errores: r.filter((x) => x.nivel === 'error').length, avisos: r.filter((x) => x.nivel === 'aviso').length, obsoletos: fix ? 0 : obsoletos.length };
}
