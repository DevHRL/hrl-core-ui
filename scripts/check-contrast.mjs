/* Verifica el contraste WCAG 2.1 AA de las combinaciones texto/fondo del
   sistema, en los dos temas.

   Umbrales: 4.5:1 para texto normal, 3:1 para texto grande (24px+, o 19px+ en
   negrita) y para componentes de interfaz. Se reporta la razón exacta y
   contra cuál de los dos umbrales pasa o falla — no un simple sí/no, porque
   una combinación puede servir para un título grande y no para un párrafo.

   Solo se evalúan pares de colores OPACOS: los fondos "-soft" (rgba con
   alpha < 1) dependen de qué haya detrás para tener una luminancia real, y
   componerlos correctamente exige saber sobre qué superficie se pintan en
   cada uso concreto — eso no está en los tokens, está en cada componente.
   Se listan aparte como "no evaluado", no se inventa un resultado.

     node scripts/check-contrast.mjs */
import { cargarTokens } from './lib-tokens.mjs';

const { resolver } = cargarTokens();

// --------------------------------------------------------------------------
// Color: parseo y luminancia relativa (fórmula de WCAG 2.1, §1.4.3).
// --------------------------------------------------------------------------

function aRgb(valor) {
  const hex = valor.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgba = valor.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3]), rgba[4] !== undefined ? Number(rgba[4]) : 1];
  }
  return null; // no es un color (una sombra, una duración...)
}

function luminancia([r, g, b]) {
  const canal = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function razonDeContraste(colorA, colorB) {
  const l1 = luminancia(colorA);
  const l2 = luminancia(colorB);
  const [claro, oscuro] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (claro + 0.05) / (oscuro + 0.05);
}

// --------------------------------------------------------------------------
// Pares texto/fondo que de verdad ocurren en la interfaz: un color de texto
// semántico sobre las superficies opacas donde el kit lo pinta (fondo general
// y tarjeta/superficie). No es cada combinación matemáticamente posible, es
// cada combinación que un componente realmente produce.
// --------------------------------------------------------------------------

const SUPERFICIES = ['background', 'surface'];
const TEXTOS = [
  'foreground', 'surface-foreground', 'muted-foreground', 'subtle-foreground',
  'destructive-text', 'success-text', 'warning-fg', 'info-fg',
  'primary-text', 'accent-text', 'neutral-text',
];
// Texto sobre su propio fondo de acción (el botón primario, no una tarjeta).
const SOBRE_SI_MISMO = [
  ['primary-foreground', 'primary'],
  ['accent-foreground', 'accent'],
  ['destructive-foreground', 'destructive'],
  // La cabecera en banda (PageBanner): texto claro en los dos extremos del
  // degradado, el botón principal (verde sobre blanco) y la etiqueta de aviso.
  ['banda-texto', 'banda-desde'],
  ['banda-texto', 'banda-hasta'],
  ['banda-desde', 'banda-texto'],
  ['mascota-tinta', 'warning'],
];

// Lo que no es texto pero tiene que verse (WCAG 1.4.11, 3:1): bordes de los
// campos y de las tarjetas y el anillo de foco. En estándar son translúcidos
// (quedan como «no evaluado»); en alto contraste son sólidos y se exigen.
const NO_TEXTO = ['border', 'border-soft', 'input-border', 'ring'].flatMap((borde) => SUPERFICIES.map((fondo) => [borde, fondo]));

function evaluarTema(tema, etiqueta, { alto = false } = {}) {
  const resultados = [];
  const omitidos = [];

  const pares = [
    ...TEXTOS.flatMap((texto) => SUPERFICIES.map((fondo) => [texto, fondo])),
    ...SOBRE_SI_MISMO,
    ...(alto ? NO_TEXTO.map(([a, b]) => [a, b, 'borde']) : []),
  ];

  for (const [texto, fondo, tipo] of pares) {
    const vTexto = resolver(texto, tema);
    const vFondo = resolver(fondo, tema);
    const rgbTexto = aRgb(vTexto);
    const rgbFondo = aRgb(vFondo);
    if (!rgbTexto || !rgbFondo) continue;
    if (rgbTexto[3] < 1 || rgbFondo[3] < 1) {
      omitidos.push(`${texto} / ${fondo} (${etiqueta}): color translúcido, depende de qué haya detrás`);
      continue;
    }
    const razon = razonDeContraste(rgbTexto, rgbFondo);
    resultados.push({
      tema: etiqueta, texto, fondo,
      valorTexto: vTexto, valorFondo: vFondo,
      razon,
      // En alto contraste el texto se exige a 7:1 (AAA) y un borde a 3:1.
      normal: tipo === 'borde' ? razon >= 3 : razon >= (alto ? 7 : 4.5),
      grande: razon >= 3,
      alto,
    });
  }
  return { resultados, omitidos };
}

const claro = evaluarTema('light', 'claro');
const oscuro = evaluarTema('dark', 'oscuro');
const claroAlto = evaluarTema('lightHigh', 'claro+', { alto: true });
const oscuroAlto = evaluarTema('darkHigh', 'oscuro+', { alto: true });
const todos = [...claro.resultados, ...oscuro.resultados, ...claroAlto.resultados, ...oscuroAlto.resultados];

todos.sort((a, b) => a.razon - b.razon);

console.log(`Combinaciones evaluadas: ${todos.length} (claro ${claro.resultados.length}, oscuro ${oscuro.resultados.length}, claro alto ${claroAlto.resultados.length}, oscuro alto ${oscuroAlto.resultados.length})\n`);

const fallanNormal = todos.filter((r) => !r.normal && !r.alto);
const fallanTodo = todos.filter((r) => !r.grande);
// En alto contraste, lo que no llega a su umbral (7:1 texto, 3:1 borde) falla.
const fallanAlto = todos.filter((r) => r.alto && !r.normal);

for (const r of todos) {
  const marca = !r.grande ? 'FALLA' : r.alto && !r.normal ? 'no AAA' : !r.normal ? 'grande' : 'ok   ';
  console.log(
    `  ${marca}  ${r.razon.toFixed(2)}:1  ${r.tema.padEnd(8)} `
    + `${r.texto} (${r.valorTexto}) sobre ${r.fondo} (${r.valorFondo})`,
  );
}

if (claro.omitidos.length || oscuro.omitidos.length) {
  console.log('\nNo evaluados (fondo translúcido, depende del contexto):');
  for (const o of [...claro.omitidos, ...oscuro.omitidos]) console.log(`  - ${o}`);
}

// En alto contraste no debería quedar nada translúcido salvo los velos
// (-soft, scrim, selección), que dependen de lo que hay detrás.
const omitidosAlto = [...claroAlto.omitidos, ...oscuroAlto.omitidos].filter((o) => !/-soft|scrim|selection/.test(o));
if (omitidosAlto.length) {
  console.log('\nEn alto contraste no debería quedar nada translúcido, y queda:');
  for (const o of omitidosAlto) console.log(`  - ${o}`);
}

console.log(`\n${fallanTodo.length} combinación(es) no llegan ni al umbral de texto grande (3:1).`);
console.log(`${fallanNormal.length - fallanTodo.length} combinación(es) sirven para texto grande o UI (≥3:1) pero no para texto normal (≥4.5:1).`);
console.log(fallanNormal.length === 0
  ? 'Todo lo evaluado cumple el mínimo de texto normal (4.5:1).'
  : `${fallanNormal.length} combinación(es) no llegan al mínimo de texto normal (4.5:1) — revisar antes de usarlas en párrafos o etiquetas pequeñas.`);

console.log(fallanAlto.length === 0
  ? 'En alto contraste, todo el texto llega a 7:1 y todo borde a 3:1.'
  : `${fallanAlto.length} combinación(es) de alto contraste no llegan a su umbral (7:1 texto, 3:1 borde).`);

process.exit(fallanTodo.length > 0 || fallanAlto.length > 0 || omitidosAlto.length > 0 ? 1 : 0);
