/* Lo que la herramienta necesita saber de un proyecto que consume el kit.

   Solo módulos integrados de Node: el kit no tiene dependencias de ejecución
   (design.md § 0) y esta herramienta viaja dentro del paquete. */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

export const KIT = '@hrl/core-ui';

export const leerTexto = (ruta) => readFileSync(ruta, 'utf8');
export const eolDe = (texto) => (texto.includes('\r\n') ? '\r\n' : '\n');

/* Se conserva la sangría, el salto de línea y el final de archivo: un cambio de
   una línea en package.json no debe aparecer en git como un archivo reescrito. */
export function leerJson(ruta) {
  const texto = leerTexto(ruta);
  return {
    datos: JSON.parse(texto),
    sangria: (texto.match(/^([ \t]+)"/m) || [, '  '])[1],
    eol: eolDe(texto),
    finalNl: texto.endsWith('\n'),
  };
}

export function escribirJson(ruta, { datos, sangria, eol, finalNl }) {
  let salida = JSON.stringify(datos, null, sangria);
  if (eol === '\r\n') salida = salida.replace(/\n/g, '\r\n');
  writeFileSync(ruta, salida + (finalNl ? eol : ''));
}

/* Sube desde `desde` hasta el primer package.json que declare React o el kit. */
export function encontrarProyecto(desde) {
  let dir = resolve(desde);
  for (;;) {
    const ruta = join(dir, 'package.json');
    if (existsSync(ruta)) {
      const pkg = JSON.parse(leerTexto(ruta));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps[KIT] || deps.react) return { dir, pkg };
    }
    const padre = dirname(dir);
    if (padre === dir) return null;
    dir = padre;
  }
}

export function nombreDe(dir, pkg) {
  return pkg.name && pkg.name !== 'frontend' ? pkg.name : basename(dirname(dir)) || basename(dir);
}

export function raizGit(dir) {
  try {
    return resolve(execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
  } catch {
    return dir;
  }
}

export function entradaDe(dir) {
  for (const c of ['src/main.jsx', 'src/main.tsx', 'src/main.js', 'src/main.ts', 'src/index.jsx', 'src/index.tsx', 'src/index.js', 'src/index.ts']) {
    if (existsSync(join(dir, c))) return c;
  }
  return null;
}

/* Todos los archivos de código de src/, sin node_modules ni dist. */
export function fuentes(dir, extensiones = /\.(jsx?|tsx?)$/) {
  const salida = [];
  const recorrer = (d) => {
    if (!existsSync(d)) return;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
      const ruta = join(d, e.name);
      if (e.isDirectory()) recorrer(ruta);
      else if (extensiones.test(e.name)) salida.push(ruta);
    }
  };
  recorrer(join(dir, 'src'));
  return salida;
}

export function especificacionKit(pkg) {
  for (const seccion of ['dependencies', 'devDependencies']) {
    if (pkg[seccion]?.[KIT]) return { seccion, valor: pkg[seccion][KIT] };
  }
  return null;
}

/* Una versión semver, con sufijo de prelanzamiento opcional (1.10.0-redesign.1):
   un tag de prelanzamiento es tan fijo como cualquier otro. */
export const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export const etiquetaDe = (valor) => (valor.match(/#v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/) || [])[1] ?? null;

export function versionInstalada(dir) {
  const ruta = join(dir, 'node_modules', '@hrl', 'core-ui', 'package.json');
  return existsSync(ruta) ? JSON.parse(leerTexto(ruta)).version : null;
}

/* Como semver: primero la base; con la misma base, un prelanzamiento va antes
   que la versión final (1.10.0-redesign.1 < 1.10.0). */
export const comparar = (a, b) => {
  const [[ba, pa], [bb, pb]] = [a, b].map((v) => { const i = v.indexOf('-'); return i < 0 ? [v, null] : [v.slice(0, i), v.slice(i + 1)]; });
  const [x, y] = [ba, bb].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  if (pa === pb) return 0;
  if (pa === null) return 1;
  if (pb === null) return -1;
  return pa.localeCompare(pb, 'en', { numeric: true });
};

/* Versiones de todos los paquetes del lockfile, para saber qué cambió al instalar. */
export function versionesDelLockfile(dir) {
  const ruta = join(dir, 'package-lock.json');
  if (!existsSync(ruta)) return null;
  const mapa = {};
  for (const [clave, v] of Object.entries(JSON.parse(leerTexto(ruta)).packages ?? {})) {
    if (clave) mapa[clave] = v.version;
  }
  return mapa;
}

/* Un `import` estático o dinámico de un módulo, con su posición en el texto. */
export function importsDe(texto, filtro = /.*/) {
  const salida = [];
  const patron = /(?:import\s+(?:[^'"()]*?\s+from\s+)?|import\(\s*|from\s+)(['"])([^'"]+)\1/g;
  for (let m; (m = patron.exec(texto)); ) {
    if (filtro.test(m[2])) salida.push({ modulo: m[2], indice: m.index });
  }
  return salida;
}

export const lineaDe = (texto, indice) => texto.slice(0, indice).split('\n').length;

/* Fin de una etiqueta JSX que empieza en `inicio`: el primer `>` que no esté
   dentro de llaves ni de comillas (una flecha `=>` dentro de una prop no la cierra). */
export function finDeEtiqueta(texto, inicio) {
  let prof = 0;
  let comilla = null;
  for (let i = inicio; i < texto.length; i++) {
    const c = texto[i];
    if (comilla) {
      if (c === comilla && texto[i - 1] !== '\\') comilla = null;
    } else if (c === '"' || c === "'" || c === '`') comilla = c;
    else if (c === '{') prof++;
    else if (c === '}') prof--;
    else if (c === '>' && prof === 0) return i;
  }
  return -1;
}
