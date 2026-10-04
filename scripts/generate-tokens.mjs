/* Genera tokens.css y src/preset.js a partir de tokens.json.

   tokens.json es la única fuente: este script no se edita para cambiar un
   color, se cambia tokens.json y se corre `npm run tokens`. Los dos archivos
   de salida quedan marcados como generados para que nadie los toque a mano
   por costumbre.

     node scripts/generate-tokens.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { cargarTokens } from './lib-tokens.mjs';

const LF = String.fromCharCode(10);
const CRLF = String.fromCharCode(13, 10);

const { data, lightFlat, darkFlat, resolver } = cargarTokens();

/* Envuelve un comentario largo a ~76 columnas, como el resto del CSS a mano.
   Los comentarios con salto de línea propio (los divisores) respetan sus
   propios párrafos. */
function envolver(texto, ancho = 76) {
  return texto.split('\n\n').map((parrafo) => {
    const palabras = parrafo.split(/\s+/);
    const lineas = [];
    let actual = '';
    for (const palabra of palabras) {
      const candidata = actual ? `${actual} ${palabra}` : palabra;
      if (candidata.length > ancho && actual) {
        lineas.push(actual);
        actual = palabra;
      } else {
        actual = candidata;
      }
    }
    if (actual) lineas.push(actual);
    return lineas.join(LF + '     ');
  }).join(LF + LF + '     ');
}

// --------------------------------------------------------------------------
// tokens.css: se reconstruyen los dos bloques tal como están hoy, agrupados
// por los mismos comentarios que ya traía tokens.json.
// --------------------------------------------------------------------------

function bloqueGrupos(grupos) {
  return grupos.map((g) => {
    const lineas = Object.entries(g.tokens).map(([k, v]) => `  --${k}: ${v};`);
    const comentario = g.comment ? `  /* ${envolver(g.comment)} */` : '';
    if (comentario && lineas.length) return `${comentario}${LF}${lineas.join(LF)}`;
    return comentario || lineas.join(LF);
  }).join(LF + LF);
}

function reemplazarEntre(texto, inicioMarca, finMarca, nuevoContenido) {
  const inicio = texto.indexOf(inicioMarca);
  const fin = texto.indexOf(finMarca, inicio);
  if (inicio < 0 || fin < 0) throw new Error(`No se encontró el bloque "${inicioMarca.slice(0, 40)}…"`);
  const desde = inicio + inicioMarca.length;
  return texto.slice(0, desde) + nuevoContenido + texto.slice(fin);
}

const original = readFileSync('tokens.css', 'utf8');

/* Los archivos generados conservan el fin de línea con el que están: CRLF en un
   checkout de Windows con autocrlf, LF en Linux y en lo que guarda git. Escribir
   siempre CRLF hacía que, en un checkout LF, `git diff --exit-code` viera todas
   las líneas distintas y el CI fallara aunque el contenido fuera idéntico; en
   Windows no se notaba porque git normaliza al comparar. */
const finDeLinea = original.includes(CRLF) ? CRLF : LF;
const cssActual = original.split(CRLF).join(LF);

let cssNuevo = reemplazarEntre(
  cssActual,
  '.hrl-nuevo,' + LF + '.hrl-portal {' + LF,
  LF + LF + '  font-family:',
  bloqueGrupos(data.light),
);
cssNuevo = reemplazarEntre(
  cssNuevo,
  ":root[data-tema-hrl='oscuro'] .hrl-nuevo," + LF + ":root[data-tema-hrl='oscuro'] .hrl-portal {" + LF,
  LF + LF + '  color-scheme: dark;' + LF + '}',
  bloqueGrupos(data.dark.groups),
);

/* Alto contraste. El claro excluye el oscuro con :not(): con la misma
   especificidad que el bloque oscuro, sin eso pisaría sus valores en el modo
   oscuro de alto contraste. */
cssNuevo = reemplazarEntre(
  cssNuevo,
  ":root[data-contraste-hrl='alto']:not([data-tema-hrl='oscuro']) .hrl-nuevo," + LF + ":root[data-contraste-hrl='alto']:not([data-tema-hrl='oscuro']) .hrl-portal {" + LF,
  LF + LF + '  /* fin del alto contraste claro */',
  bloqueGrupos(data.lightHigh?.groups ?? []),
);
cssNuevo = reemplazarEntre(
  cssNuevo,
  ":root[data-tema-hrl='oscuro'][data-contraste-hrl='alto'] .hrl-nuevo," + LF + ":root[data-tema-hrl='oscuro'][data-contraste-hrl='alto'] .hrl-portal {" + LF,
  LF + LF + '  /* fin del alto contraste oscuro */',
  bloqueGrupos(data.darkHigh?.groups ?? []),
);

writeFileSync('tokens.css', cssNuevo.split(LF).join(finDeLinea));

// --------------------------------------------------------------------------
// src/preset.js: mismo `preset` con la misma forma de siempre (color,
// colorOscuro, radius, shadow, text, weight, leading, font, duration,
// transition, ease, touchTarget), pero con TODOS los tokens — hoy `color`
// tenía una selección hecha a mano que se había ido desalineando de
// tokens.css sin que nadie lo notara (`row-hover`, `head-bg`, `brand-texto`…
// faltaban ahí).
// --------------------------------------------------------------------------

const CATEGORIAS = [
  { prueba: (k) => k === 'radius', destino: 'radius', sub: () => 'DEFAULT' },
  { prueba: (k) => k.startsWith('radius-'), destino: 'radius', sub: (k) => k.slice(7) },
  { prueba: (k) => k.startsWith('shadow-'), destino: 'shadow', sub: (k) => k.slice(7) },
  // Solo la escala de tamaños: --text-primary/secondary/disabled son
  // colores, no tamaños, y deben caer en `color` como el resto.
  { prueba: (k) => /^text-(xs|sm|base|md|lg|xl|2xl)$/.test(k), destino: 'text', sub: (k) => k.slice(5) },
  { prueba: (k) => k.startsWith('weight-'), destino: 'weight', sub: (k) => k.slice(7), numero: true },
  { prueba: (k) => k.startsWith('leading-'), destino: 'leading', sub: (k) => k.slice(8), numero: true },
  { prueba: (k) => k.startsWith('font-'), destino: 'font', sub: (k) => k.slice(5) },
  { prueba: (k) => k.startsWith('duration-'), destino: 'duration', sub: (k) => k.slice(9) },
  { prueba: (k) => k.startsWith('transition-'), destino: 'transition', sub: (k) => k.slice(11) },
  { prueba: (k) => /^space-\d$/.test(k), destino: 'space', sub: (k) => k.slice(6) },
  { prueba: (k) => k === 'touch-target', destino: 'touchTarget', sub: () => 'base' },
  { prueba: (k) => k === 'touch-target-lg', destino: 'touchTarget', sub: () => 'lg' },
  { prueba: (k) => k === 'ease', destino: 'ease', sub: null },
];

function categoriaDe(nombre) {
  return CATEGORIAS.find((c) => c.prueba(nombre)) ?? null;
}

const preset = {
  color: {}, colorOscuro: {}, radius: {}, shadow: {}, text: {}, weight: {},
  leading: {}, font: {}, duration: {}, transition: {}, ease: null, touchTarget: {}, space: {},
};

for (const nombre of Object.keys(lightFlat)) {
  const valor = resolver(nombre, 'light');
  const cat = categoriaDe(nombre);
  if (!cat) { preset.color[nombre] = valor; continue; }
  const v = cat.numero ? Number(valor) : valor;
  if (cat.sub === null) preset[cat.destino] = v;
  else preset[cat.destino][cat.sub(nombre)] = v;
}

// Oscuro: solo los tokens de color que de verdad cambian — las mismas
// entradas de siempre, ahora resueltas en vez de tipeadas dos veces. Las
// sombras oscuras (sí cambian, ver tokens.json) no tienen hoy contraparte en
// JS —nada las consume fuera de CSS— así que no se inventa una aquí.
for (const nombre of Object.keys(darkFlat)) {
  if (categoriaDe(nombre)) continue;
  preset.colorOscuro[nombre] = resolver(nombre, 'dark');
}

/* Valor de una propiedad JS: número tal cual, string con comillas simples y
   cualquier comilla interna escapada como corresponde (evita el bug de
   `'Public Sans'` dentro de un valor ya envuelto en comillas). */
function valorJs(v) {
  return typeof v === 'number' ? String(v) : `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function clave(k) {
  return /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `'${k}'`;
}

/* Cuerpo de un objeto plano {clave: valor}, sin agrupar. */
function cuerpoPlano(obj, indent) {
  if (Object.keys(obj).length === 0) return '{}';
  const filas = Object.entries(obj).map(([k, v]) => `${indent}  ${clave(k)}: ${valorJs(v)},`);
  return `{${LF}${filas.join(LF)}${LF}${indent}}`;
}

/* Cuerpo de `color`/`colorOscuro`: agrupado con los mismos comentarios que
   tokens.css, para que el archivo generado se siga leyendo igual de bien.
   `grupos` son los de tokens.json; `resueltos` es el mapa ya resuelto del que
   sacar el valor final de cada clave (se sigue filtrando por categoría). */
function cuerpoAgrupado(grupos, resueltos, indent) {
  const filas = [];
  for (const g of grupos) {
    const claves = Object.keys(g.tokens).filter((k) => k in resueltos);
    if (claves.length === 0) continue;
    if (g.comment) filas.push(`${indent}  /* ${envolver(g.comment, 74)} */`);
    for (const k of claves) filas.push(`${indent}  ${clave(k)}: ${valorJs(resueltos[k])},`);
  }
  return `{${LF}${filas.join(LF)}${LF}${indent}}`;
}

const presetJs = `/* Preset del sistema de diseño.

   GENERADO por scripts/generate-tokens.mjs a partir de tokens.json — no se
   edita a mano. Para cambiar un valor, se cambia tokens.json y se corre
   \`npm run tokens\`.

   Es el equivalente de \`tailwind.preset.js\` para este stack: la fuente de
   los tokens en JavaScript, para cuando hace falta el valor y no la variable
   (canvas, SVG generado, meta theme-color).

     import { preset, token, literalColor, tokensToCss } from '@hrl/core-ui';

     token('primary')                    // 'var(--primary)'
     preset.color.primary                // '#00a76f'
     literalColor('primary', 'oscuro')   // '#00a76f' (no cambia con el tema)
     tokensToCss()                       // el bloque CSS completo

   Regla: si un valor no está en tokens.json, no es parte del sistema. */

export const preset = {
  color: ${cuerpoAgrupado(data.light, preset.color, '  ')},

  /* Equivalentes del tema oscuro. Solo los que cambian. */
  colorOscuro: ${cuerpoAgrupado(data.dark.groups, preset.colorOscuro, '  ')},

  radius: ${cuerpoPlano(preset.radius, '  ')},

  shadow: ${cuerpoPlano(preset.shadow, '  ')},

  text: ${cuerpoPlano(preset.text, '  ')},

  weight: ${cuerpoPlano(preset.weight, '  ')},
  leading: ${cuerpoPlano(preset.leading, '  ')},

  font: ${cuerpoPlano(preset.font, '  ')},

  duration: ${cuerpoPlano(preset.duration, '  ')},
  /* Transiciones ya armadas (duración + curva), listas para \`transition:\`. */
  transition: ${cuerpoPlano(preset.transition, '  ')},
  ease: ${valorJs(preset.ease)},

  /* Altura mínima de cualquier control interactivo. */
  touchTarget: ${cuerpoPlano(preset.touchTarget, '  ')},

  /* Escala de espaciado (gap, padding) de las separaciones entre bloques. */
  space: ${cuerpoPlano(preset.space, '  ')},
};

/* Referencia a un token para usarlo en un estilo en línea.
   \`token('primary')\` devuelve 'var(--primary)', no el hex: así el valor sigue
   cambiando con el tema. */
export function token(nombre, respaldo) {
  return respaldo ? \`var(--\${nombre}, \${respaldo})\` : \`var(--\${nombre})\`;
}

/* Valor literal de un token de color, para cuando hace falta el hex y no la
   variable (canvas, SVG generado, meta theme-color). \`tema\` es 'claro' u
   'oscuro'. */
export function literalColor(nombre, tema = 'claro') {
  if (tema === 'oscuro' && nombre in preset.colorOscuro) return preset.colorOscuro[nombre];
  return preset.color[nombre];
}

/* Genera el bloque CSS de los tokens. Útil para otro empaquetador o para un
   Shadow DOM, donde la hoja global no llega. */
export function tokensToCss({ selector = ':root', selectorOscuro = ':root[data-tema-hrl="oscuro"]' } = {}) {
  const linea = (k, v) => \`  --\${k}: \${v};\`;

  const claro = [
    ...Object.entries(preset.color).map(([k, v]) => linea(k, v)),
    ...Object.entries(preset.radius).map(([k, v]) => linea(k === 'DEFAULT' ? 'radius' : \`radius-\${k}\`, v)),
    ...Object.entries(preset.shadow).map(([k, v]) => linea(\`shadow-\${k}\`, v)),
    ...Object.entries(preset.text).map(([k, v]) => linea(\`text-\${k}\`, v)),
    ...Object.entries(preset.weight).map(([k, v]) => linea(\`weight-\${k}\`, v)),
    ...Object.entries(preset.leading).map(([k, v]) => linea(\`leading-\${k}\`, v)),
    ...Object.entries(preset.font).map(([k, v]) => linea(\`font-\${k}\`, v)),
    ...Object.entries(preset.duration).map(([k, v]) => linea(\`duration-\${k}\`, v)),
    ...Object.entries(preset.transition).map(([k, v]) => linea(\`transition-\${k}\`, v)),
    linea('ease', preset.ease),
    linea('touch-target', preset.touchTarget.base),
    linea('touch-target-lg', preset.touchTarget.lg),
    ...Object.entries(preset.space).map(([k, v]) => linea(\`space-\${k}\`, v)),
  ].join('\\n');

  const oscuro = Object.entries(preset.colorOscuro).map(([k, v]) => linea(k, v)).join('\\n');

  return \`\${selector} {\\n\${claro}\\n}\\n\\n\${selectorOscuro} {\\n  color-scheme: dark;\\n\${oscuro}\\n}\\n\`;
}
`;

writeFileSync('src/preset.js', presetJs.split(LF).join(finDeLinea));

console.log('tokens.css y src/preset.js regenerados desde tokens.json.');
console.log('preset.color:', Object.keys(preset.color).length, 'claves | colorOscuro:', Object.keys(preset.colorOscuro).length);
