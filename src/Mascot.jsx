import { useEffect, useId, useRef } from 'react';
import { cx } from './variants.js';

/* Mascota del hospital: Dr. Mochi.

   Es identidad del Hospital Regional de Loreto, como el logo: todos los
   sistemas la comparten, así que viaja con el kit. Un médico con forma de
   mochi —cuerpo redondo y blando, bata blanca, estetoscopio y espejo frontal—
   que acompaña lo que hace un sistema: espera, lee, termina o encuentra algo.

     state        idle (por defecto)  espera: respira, mira a su alrededor y parpadea
                  thinking            trabaja: se mece y lee de lado a lado; «…» en un globo
                  done                terminó bien: celebra con un salto y queda contento; ✓
                  problem             encontró algo: se inclina, preocupado, mira hacia abajo; «!»
                  sleeping            en pausa: ojos cerrados y «z»
     size         sm 40 · md 64 (por defecto) · lg 104 · xl 160, o un número en px
     mouth        false la dibuja sin boca
     interactive  responde al clic y al teclado (Enter o Espacio): se aplasta y sonríe;
                  mantenido, se aprieta y al soltarlo rebota; cinco clics seguidos lo marean
     onReact      (nombre) => void, con 'tap', 'squeeze' o 'dizzy': para que el sistema
                  diga algo (la mascota no tiene texto propio; lo que dice es interfaz)
     label        texto accesible. Sin él y sin interactive, es decorativa (aria-hidden):
                  quien la usa debe decir en texto lo que la mascota expresa, porque el
                  gesto nunca es la única señal.

   No sigue el cursor: tiene su propia mirada en cada estado. Con
   prefers-reduced-motion conserva la expresión, la mirada y el parpadeo,
   pero no respira, no salta ni se mece; lo que aparece, aparece en su sitio.

   El dibujo es un SVG en línea con colores de tokens (--mascota-*); el
   movimiento lo calcula un motor por cuadro, compartido entre todas las
   mascotas de la página. Los ojos, la boca, el globo y las partículas los
   dibuja el motor porque cambian con la expresión; el resto es fijo. */

const TAMANOS = { sm: 40, md: 64, lg: 104, xl: 160 };
export const MASCOT_STATES = ['idle', 'thinking', 'done', 'problem', 'sleeping'];

/* Colores: el token y, como respaldo dentro del var(), su valor, para que la
   mascota no pierda el color fuera de .hrl-nuevo (design.md § 2.2). */
const C = {
  cuerpo: 'var(--mascota-cuerpo, #2fbfa0)',
  claro: 'var(--mascota-cuerpo-claro, #c5ede4)',
  solapa: 'var(--mascota-solapa, #a4c4bd)',
  tubo: 'var(--mascota-estetoscopio, #1c6e5c)',
  tinta: 'var(--mascota-tinta, #12302a)',
  blanco: 'var(--mascota-blanco, #ffffff)',
  metal: 'var(--mascota-metal, #d5dfe2)',
  metalSombra: 'var(--mascota-metal-sombra, #93a3a9)',
  cinta: 'var(--mascota-cinta, #4f6f69)',
  espejo: 'var(--mascota-espejo, #6c7c82)',
  espejoCentro: 'var(--mascota-espejo-centro, #4d5c61)',
  globo: 'var(--surface, #ffffff)',
  globoBorde: 'var(--input-border, #8493a1)',
  globoTinta: 'var(--text-primary, #1c252e)',
  ok: 'var(--success, #008659)',
  alerta: 'var(--destructive, #e52a00)',
  destello: 'var(--warning, #ffab00)',
  sudor: 'var(--info, #00b8d9)',
  zz: 'var(--text-secondary, #5f6f7c)',
};

/* Geometría de la cara (en el viewBox de 200). */
const OJOS = { cx: 100, cy: 108, sep: 36, w: 14, h: 20 };
const BOCA = { cx: 100, cy: 128, w: 15, grosor: 3.4 };
const GLOBO = { x: 154, y: 56 };
/* La caja es el personaje (del espejo frontal a la sombra), no el lienzo
   entero: así ocupa su tamaño. El globo, los saltos y las partículas se
   salen de ella sin empujar lo de alrededor (overflow visible). */
const VISTA = '36 58 128 128';
const BASE = 176;
const CABEZA_Y = 66;
const SUDOR = { x: 152, y: 94 };

export function Mascot({ state = 'idle', size = 'md', mouth = true, interactive = false, onReact, label, className, style }) {
  const id = `hrl-m${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const raiz = useRef(null);
  const motor = useRef(null);
  const reaccion = useRef(onReact);
  reaccion.current = onReact;
  // La primera cara, para el render en servidor y el primer cuadro. Es fija:
  // si cambiara, React reescribiría los ojos y la boca que dibuja el motor.
  const caraInicial = useRef(null);
  caraInicial.current ??= { ojos: { __html: dibujarOjos('pildora', 1) }, boca: { __html: mouth ? dibujarBoca('sonrisa') : '' } };

  useEffect(() => {
    const m = crearMotor(raiz.current, { estado: state, boca: mouth, alReaccionar: (n) => reaccion.current?.(n) });
    motor.current = m;
    return () => { m.destruir(); motor.current = null; };
    // El motor vive lo que vive el elemento; estado y boca se actualizan abajo.
  }, []);
  useEffect(() => { motor.current?.fijarEstado(state); }, [state]);
  useEffect(() => { motor.current?.fijarBoca(mouth); }, [mouth]);

  const px = typeof size === 'number' ? size : TAMANOS[size] ?? TAMANOS.md;
  const accesible = interactive
    ? { role: 'button', tabIndex: 0, 'aria-label': label ?? 'Mascota del hospital' }
    : label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  const manejadores = interactive ? {
    onPointerDown: (e) => { if (e.button === 0) motor.current?.presionar(); },
    onPointerUp: () => motor.current?.soltar(true),
    onPointerLeave: () => motor.current?.soltar(false),
    onPointerCancel: () => motor.current?.soltar(false),
    onBlur: () => motor.current?.soltar(false),
    onKeyDown: (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); motor.current?.presionar(); }
    },
    onKeyUp: (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); motor.current?.soltar(true); }
    },
  } : {};

  return (
    <span
      ref={raiz}
      className={cx('hrl-mascota', interactive && 'hrl-mascota--interactiva', className)}
      style={{ '--hrl-mascota-tamano': `${px}px`, ...style }}
      {...accesible}
      {...manejadores}
    >
      <svg viewBox={VISTA} overflow="visible" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-piel`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: C.claro }} />
            <stop offset="1" style={{ stopColor: C.cuerpo }} />
          </linearGradient>
          <radialGradient id={`${id}-metal`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" style={{ stopColor: C.blanco }} />
            <stop offset="0.55" style={{ stopColor: C.metal }} />
            <stop offset="1" style={{ stopColor: C.metalSombra }} />
          </radialGradient>
          <clipPath id={`${id}-silueta`}>
            <rect x="42" y="66" width="116" height="110" rx="55" />
          </clipPath>
        </defs>
        <ellipse data-pieza="sombra" cx="100" cy="179" rx="48" ry="6" style={{ fill: C.tinta }} opacity="0.14" />
        <g data-pieza="cuerpo">
          <rect x="42" y="66" width="116" height="110" rx="55" fill={`url(#${id}-piel)`} />
          <g clipPath={`url(#${id}-silueta)`}>
            <path d="M30 136 H80 L100 168 L120 136 H170 V190 H30 Z" style={{ fill: C.blanco }} />
            <path d="M80 136 L90 151 L85 154 L100 168 M120 136 L110 151 L115 154 L100 168" fill="none" style={{ stroke: C.solapa }} strokeWidth="2.2" strokeLinejoin="round" />
          </g>
          <g data-paralaje="0.35">
            <path d="M84 143 C82 158 90 166 100 166 C110 166 118 158 116 143" fill="none" style={{ stroke: C.tubo }} strokeWidth="4" strokeLinecap="round" />
            <circle cx="84" cy="142" r="3.4" style={{ fill: C.tubo }} />
            <circle cx="116" cy="142" r="3.4" style={{ fill: C.tubo }} />
            <circle cx="100" cy="167" r="6.5" fill={`url(#${id}-metal)`} style={{ stroke: C.tubo }} strokeWidth="3" />
          </g>
          <g data-paralaje="1">
            <g data-pieza="ojos" dangerouslySetInnerHTML={caraInicial.current.ojos} />
            <g data-pieza="boca" dangerouslySetInnerHTML={caraInicial.current.boca} />
          </g>
          <g data-paralaje="0.8">
            <path d="M48 96 Q100 66 152 96" fill="none" style={{ stroke: C.cinta }} strokeWidth="5" strokeLinecap="round" />
            <circle cx="74" cy="83" r="12" fill={`url(#${id}-metal)`} style={{ stroke: C.espejo }} strokeWidth="2" />
            <circle cx="74" cy="83" r="3" style={{ fill: C.espejoCentro }} />
            <path d="M66.5 79 A8 8 0 0 1 73 75" fill="none" style={{ stroke: C.blanco }} strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
        <g data-pieza="globo" />
        <g data-pieza="particulas" />
      </svg>
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════ dibujo */

const f = (n) => Math.round(n * 100) / 100;
const trazo = (d, ancho, color = C.tinta) =>
  `<path d="${d}" fill="none" style="stroke:${color}" stroke-width="${f(ancho)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const relleno = (forma, color = C.tinta) => forma.replace('/>', ` style="fill:${color}"/>`);
const pildora = (x, y, w, h) =>
  relleno(`<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(Math.min(w, h) / 2)}"/>`);

function ojo(tipo, x, y, lado, parpado, giro) {
  const { w, h } = OJOS;
  switch (tipo) {
    case 'feliz':
      return trazo(`M${f(x - w * 0.62)} ${f(y + h * 0.14)} Q${f(x)} ${f(y - h * 0.6)} ${f(x + w * 0.62)} ${f(y + h * 0.14)}`, w * 0.42);
    case 'cerrado':
      return trazo(`M${f(x - w * 0.62)} ${f(y)} Q${f(x)} ${f(y + h * 0.3)} ${f(x + w * 0.62)} ${f(y)}`, w * 0.34);
    case 'apretado': {
      // «> <»: la punta mira hacia el centro de la cara.
      const fuera = x + lado * w * 0.5, punta = x - lado * w * 0.45;
      return trazo(`M${f(fuera)} ${f(y - h * 0.32)} L${f(punta)} ${f(y)} L${f(fuera)} ${f(y + h * 0.32)}`, w * 0.36);
    }
    case 'espiral': {
      let d = '';
      const n = 30, R = w * 0.85, g0 = ((giro * Math.PI) / 180) * lado;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 3.4 + g0, r = (R * i) / n;
        d += `${i ? 'L' : 'M'}${f(x + Math.cos(a) * r)} ${f(y + Math.sin(a) * r)}`;
      }
      return trazo(d, w * 0.2);
    }
    case 'grande': {
      const r = w * 0.68;
      return relleno(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(Math.max(1.2, r * parpado))}"/>`);
    }
    case 'preocupado':
      // Ceja con el extremo interior alzado: preocupación, no enojo.
      return pildora(x, y + h * 0.08, w, Math.max(2.4, h * 0.8 * parpado))
        + trazo(`M${f(x + lado * w * 0.85)} ${f(y - h * 0.62)} L${f(x - lado * w * 0.7)} ${f(y - h * 0.92)}`, w * 0.3);
    default:
      return pildora(x, y, w, Math.max(2.4, h * parpado));
  }
}

function dibujarOjos(tipo, parpado, giro = 0) {
  return [-1, 1].map((lado) => ojo(tipo, OJOS.cx + (lado * OJOS.sep) / 2, OJOS.cy, lado, parpado, giro)).join('');
}

function dibujarBoca(tipo) {
  const { cx: x, cy: y, w, grosor } = BOCA;
  switch (tipo) {
    case 'abierta':
      return `<path d="M${f(x - w * 0.55)} ${f(y)} Q${f(x)} ${f(y + w * 0.95)} ${f(x + w * 0.55)} ${f(y)} Z" style="fill:${C.tinta};stroke:${C.tinta}" stroke-width="${f(grosor * 0.6)}" stroke-linejoin="round"/>`;
    case 'plana': return trazo(`M${f(x - w * 0.3)} ${f(y + w * 0.12)} L${f(x + w * 0.3)} ${f(y + w * 0.12)}`, grosor);
    case 'o': return relleno(`<ellipse cx="${f(x)}" cy="${f(y + w * 0.18)}" rx="${f(w * 0.2)}" ry="${f(w * 0.26)}"/>`);
    case 'dormida': return relleno(`<ellipse cx="${f(x)}" cy="${f(y + w * 0.15)}" rx="${f(w * 0.12)}" ry="${f(w * 0.15)}"/>`);
    case 'preocupada': return trazo(`M${f(x - w * 0.42)} ${f(y + w * 0.25)} Q${f(x)} ${f(y - w * 0.1)} ${f(x + w * 0.42)} ${f(y + w * 0.25)}`, grosor);
    case 'ondulada': {
      const p = w / 4;
      return trazo(`M${f(x - w / 2)} ${f(y + w * 0.1)} q${f(p / 2)} ${f(-p * 0.7)} ${f(p)} 0 t${f(p)} 0 t${f(p)} 0 t${f(p)} 0`, grosor);
    }
    case 'apretada':
      return trazo(`M${f(x - w * 0.42)} ${f(y + w * 0.1)} L${f(x - w * 0.21)} ${f(y)} L${f(x)} ${f(y + w * 0.1)} L${f(x + w * 0.21)} ${f(y)} L${f(x + w * 0.42)} ${f(y + w * 0.1)}`, grosor * 0.85);
    default: return trazo(`M${f(x - w / 2)} ${f(y)} Q${f(x)} ${f(y + w * 0.5)} ${f(x + w / 2)} ${f(y)}`, grosor);
  }
}

function dibujarGlobo(tipo) {
  const burbuja = `<circle cx="-14" cy="15" r="3.6" style="fill:${C.globo};stroke:${C.globoBorde}" stroke-width="1.6"/>`
    + `<circle cx="-20" cy="21" r="2.2" style="fill:${C.globo};stroke:${C.globoBorde}" stroke-width="1.4"/>`
    + `<circle r="16" style="fill:${C.globo};stroke:${C.globoBorde}" stroke-width="1.6"/>`;
  const contenido = {
    puntos: [-6, 0, 6].map((x) => relleno(`<circle data-punto="" cx="${x}" cy="0" r="2.7"/>`, C.globoTinta)).join(''),
    alerta: relleno('<rect x="-2.4" y="-10" width="4.8" height="12" rx="2.4"/>', C.alerta) + relleno('<circle cy="7" r="2.7"/>', C.alerta),
    check: trazo('M-7 0.5 L-2 5.5 L7.5 -5.5', 4, C.ok),
    pregunta: trazo('M-5 -4.5 Q-5 -10.5 0.5 -10.5 Q6 -10.5 6 -5.5 Q6 -1.5 0.5 0.5 L0.5 2.5', 3.4, C.globoTinta)
      + relleno('<circle cx="0.5" cy="8" r="2.3"/>', C.globoTinta),
  }[tipo];
  return burbuja + contenido;
}

const PARTICULAS = {
  destello: relleno('<path d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6Z"/>', C.destello),
  gota: relleno('<path d="M0 -6 C3 -2 4.5 1 4.5 2.8 A4.5 4.5 0 0 1 -4.5 2.8 C-4.5 1 -3 -2 0 -6Z"/>', C.sudor),
  z: trazo('M-4 -4 H4 L-4 4 H4', 2.2, C.zz),
};

/* ════════════════════════════════════════════════════════════════ motor */

/* Lo que expresa en cada estado. `mirada` es cómo mueve los ojos sola. */
const ESTADOS = {
  idle:     { ojos: 'pildora',    boca: 'sonrisa',    globo: null,     cuerpo: 'respira', mirada: 'curiosa' },
  thinking: { ojos: 'pildora',    boca: 'plana',      globo: 'puntos', cuerpo: 'mece',    mirada: 'lee' },
  done:     { ojos: 'pildora',    boca: 'abierta',    globo: 'check',  cuerpo: 'respira', mirada: 'curiosa' },
  problem:  { ojos: 'preocupado', boca: 'preocupada', globo: 'alerta', cuerpo: 'inclina', mirada: 'baja' },
  sleeping: { ojos: 'cerrado',    boca: 'dormida',    globo: null,     cuerpo: 'duerme',  mirada: 'quieta' },
};

/* Reacciones pasajeras: se ponen encima del estado y se van solas. */
const PASAJERAS = {
  celebra:   { ojos: 'feliz', boca: 'abierta', dura: 1600 },
  toque:     { ojos: 'feliz', boca: 'abierta', dura: 750 },
  despierta: { ojos: 'grande', boca: 'o', globo: 'pregunta', mirada: 'quieta', dura: 1100 },
  mareo:     { ojos: 'espiral', boca: 'ondulada', globo: null, cuerpo: 'tambalea', mirada: 'quieta', dura: 1900 },
  apretado:  { ojos: 'apretado', boca: 'apretada', mirada: 'quieta' },
};

/* Respiración y balanceo de cada forma de moverse: periodo (s), amplitud y,
   si se mece, la frecuencia del péndulo. */
const RITMOS = {
  respira: { periodo: 3.6, amplitud: 0.024 },
  duerme: { periodo: 5.2, amplitud: 0.042 },
  mece: { periodo: 2.4, amplitud: 0.014, balanceo: 0.55 },
  inclina: { periodo: 4.4, amplitud: 0.014 },
  tambalea: { periodo: 2, amplitud: 0.01 },
};

const CLICS_MAREO = 5;
const VENTANA_MAREO = 1500;
const ESPERA_APRETAR = 320;

const instancias = new Set();
let enMarcha = false;

function arrancar() {
  if (enMarcha) return;
  enMarcha = true;
  let previo = performance.now();
  const vuelta = () => {
    // Un solo reloj, performance.now(): la marca que pasa requestAnimationFrame
    // puede ir por detrás de él (el primer cuadro, o un navegador que acelera el
    // tiempo), y mezclarlos daba pasos negativos que hacían retroceder los
    // resortes. Las reacciones también se miden con performance.now().
    const ahora = performance.now();
    const dt = Math.max(0, Math.min((ahora - previo) / 1000, 1 / 30));
    previo = ahora;
    for (const m of instancias) m.paso(ahora / 1000, dt, ahora);
    if (instancias.size) requestAnimationFrame(vuelta);
    else enMarcha = false;
  };
  requestAnimationFrame(vuelta);
}

function resorte(x) { return { x, v: 0, obj: x }; }

/* Euler semiimplícito en cuatro subpasos: con uno solo, un cuadro lento mete
   energía y el cuerpo tiembla. */
function mover(r, dt, k, c, quieto) {
  if (quieto) { r.x = r.obj; r.v = 0; return; }
  const h = dt / 4;
  for (let i = 0; i < 4; i++) {
    r.v += (k * (r.obj - r.x) - c * r.v) * h;
    r.x += r.v * h;
  }
}

/* Inhala en el 40 % del ciclo y exhala en el 60 %, con los extremos suaves:
   una senoidal pura se ve mecánica. Devuelve 0 → 1 → 0. */
function respiracion(t, periodo) {
  const u = (t / periodo) % 1;
  return u < 0.4 ? (1 - Math.cos((Math.PI * u) / 0.4)) / 2 : (1 + Math.cos((Math.PI * (u - 0.4)) / 0.6)) / 2;
}

function crearMotor(host, { estado, boca, alReaccionar }) {
  const q = (s) => host.querySelector(s);
  const cuerpo = q('[data-pieza="cuerpo"]');
  const sombra = q('[data-pieza="sombra"]');
  const ojos = q('[data-pieza="ojos"]');
  const bocaG = q('[data-pieza="boca"]');
  const globoG = q('[data-pieza="globo"]');
  const particulasG = q('[data-pieza="particulas"]');
  const capas = [...host.querySelectorAll('[data-paralaje]')].map((nodo) => ({ nodo, p: +nodo.dataset.paralaje, x: 0, y: 0, vx: 0, vy: 0 }));
  const medio = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  const s = {
    estado: ESTADOS[estado] ? estado : 'idle',
    conBoca: boca,
    pasajera: null,
    apretando: false,
    presionado: false,
    temporizador: 0,
    clics: [],
    mirada: { x: 0, y: 0 },
    objetivo: { x: 0, y: 0, hasta: 0 },
    sx: resorte(1), sy: resorte(1), rot: resorte(0),
    oy: 0, vy: 0,
    parpado: 1, parpadeo: null, proxParpadeo: performance.now() / 1000 + 0.8 + Math.random() * 2.5,
    pop: 0, popV: 0, globo: null, puntos: [],
    vivas: [], proxEfecto: 0,
    claveOjos: '', claveBoca: boca ? 'sonrisa' : '',
  };
  const quieto = () => !!medio?.matches;

  function lanzar(nombre) {
    const d = PASAJERAS[nombre].dura;
    s.pasajera = { nombre, dura: d, hasta: performance.now() + d };
  }

  function aplastar(fuerza) {
    if (quieto()) return;
    s.sx.v += 3.2 * fuerza;
    s.sy.v -= 3.2 * fuerza;
    // Los accesorios van sueltos: el golpe les llega después y rebotan.
    for (const c of capas) if (c.p !== 1) c.vy += 60 * fuerza;
  }

  function saltar(v) {
    if (quieto() || s.oy < 0) return;
    s.vy = -v;
    s.oy = -0.01;
    s.sy.v += v / 140; // se estira al despegar
    s.sx.v -= v / 160;
  }

  function soltarParticula(tipo, x, y, o) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = PARTICULAS[tipo];
    particulasG.append(g);
    const p = { g, x, y, vx: o.vx ?? 0, vy: o.vy ?? 0, gr: o.gr ?? 0, vida: o.vida, edad: 0, giro: o.giro ?? 0, escala: o.escala ?? 1.2 };
    // Con movimiento reducido aparece y se desvanece en su sitio.
    if (quieto()) Object.assign(p, { vx: 0, vy: 0, gr: 0, giro: 0 });
    s.vivas.push(p);
  }

  function estallar(n) {
    const cy = CABEZA_Y + 40;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      soltarParticula('destello', 100 + Math.cos(a) * 40, cy + Math.sin(a) * 40, {
        vx: Math.cos(a) * 80, vy: Math.sin(a) * 80 - 20, vida: 0.75, escala: 1.1, giro: Math.random() * 60 - 30,
      });
    }
  }

  function expresion(ahora) {
    if (s.pasajera && ahora > s.pasajera.hasta) s.pasajera = null;
    const e = { ...ESTADOS[s.estado] };
    if (s.pasajera) Object.assign(e, PASAJERAS[s.pasajera.nombre]);
    if (s.apretando) Object.assign(e, PASAJERAS.apretado);
    return e;
  }

  /* Hacia dónde mira, sin cursor: cada estado tiene su manera. */
  function mirar(e, t) {
    switch (e.mirada) {
      case 'lee': {
        // Como quien lee: cinco saltos de izquierda a derecha, vuelta al
        // principio y un renglón más abajo.
        const ciclo = 2.4, u = (t % ciclo) / ciclo;
        const renglon = Math.floor(t / ciclo) % 3;
        return { x: -0.7 + (Math.floor(u * 5) / 4) * 1.4, y: -0.3 + renglon * 0.14 };
      }
      case 'baja':
        // Mira hacia abajo, a lo que encontró, y de vez en cuando levanta la
        // vista hacia quien está delante.
        if (t > s.objetivo.hasta) {
          const levanta = s.objetivo.x < 0 && Math.random() < 0.5;
          s.objetivo = levanta ? { x: 0, y: 0, hasta: t + 0.9 } : { x: -0.45 + Math.random() * 0.2, y: 0.45, hasta: t + 2 + Math.random() * 1.6 };
        }
        return s.objetivo;
      case 'quieta':
        return { x: 0, y: s.estado === 'sleeping' ? 0.4 : 0 };
      default:
        // Curiosa: se fija en un punto, se queda un rato y cambia; a veces
        // vuelve al centro, y a veces parpadea al cambiar, como hacemos todos.
        if (t > s.objetivo.hasta) {
          const centro = Math.random() < 0.35;
          s.objetivo = {
            x: centro ? 0 : Math.random() * 1.6 - 0.8,
            y: centro ? 0 : Math.random() * 0.85 - 0.5,
            hasta: t + 1.4 + Math.random() * 2.4,
          };
          if (Math.random() < 0.3 && s.parpadeo === null) s.parpadeo = t;
        }
        return s.objetivo;
    }
  }

  function moverGlobo(tipo, t, dt) {
    if (tipo && tipo !== s.globo) {
      globoG.innerHTML = dibujarGlobo(tipo);
      s.globo = tipo;
      s.puntos = [...globoG.querySelectorAll('[data-punto]')];
      s.pop = Math.min(s.pop, 0.4);
    }
    const obj = tipo ? 1 : 0;
    let escala = 1;
    if (quieto()) {
      s.pop += Math.max(-dt * 6, Math.min(dt * 6, obj - s.pop));
    } else {
      s.popV += (320 * (obj - s.pop) - 18 * s.popV) * dt;
      s.pop += s.popV * dt;
      escala = Math.max(0, s.pop);
    }
    if (!tipo && s.pop < 0.02) {
      if (s.globo) { globoG.innerHTML = ''; s.globo = null; }
      s.pop = 0; s.popV = 0;
      return;
    }
    globoG.setAttribute('transform', `translate(${f(GLOBO.x + s.mirada.x * 3)} ${f(GLOBO.y + s.mirada.y * 2 + s.oy)}) scale(${f(escala)})`);
    globoG.setAttribute('opacity', f(Math.max(0, Math.min(1, s.pop * (quieto() ? 1 : 2)))));
    s.puntos.forEach((p, i) => {
      const onda = Math.max(0, Math.sin(t * 6 - i * 0.9));
      if (quieto()) { p.setAttribute('cy', 0); p.setAttribute('opacity', f(0.35 + 0.65 * onda)); }
      else p.setAttribute('cy', f(-3.5 * onda));
    });
  }

  const m = {
    paso(t, dt, ahora) {
      if (!host.isConnected) return;
      const e = expresion(ahora);
      const q0 = quieto();

      // Mirada: salta rápido al nuevo punto y se queda (movimiento sacádico).
      const obj = mirar(e, t);
      const a = q0 ? 1 : 1 - Math.exp(-dt * 16);
      s.mirada.x += (obj.x - s.mirada.x) * a;
      s.mirada.y += (obj.y - s.mirada.y) * a;

      // Parpadeo: 1 → 0 → 1 en 160 ms; a veces dos seguidos.
      if (s.parpadeo === null && t > s.proxParpadeo) s.parpadeo = t;
      if (s.parpadeo !== null) {
        const p = (t - s.parpadeo) / 0.16;
        if (p >= 1) {
          s.parpadeo = null;
          s.parpado = 1;
          s.proxParpadeo = t + (Math.random() < 0.18 ? 0.22 : 2.4 + Math.random() * 3.6);
        } else s.parpado = Math.max(0.08, Math.abs(1 - 2 * p));
      }

      // Cuerpo: todo lo que lo deforma conserva el volumen y apoya en la base.
      const ritmo = RITMOS[e.cuerpo] ?? RITMOS.respira;
      let resp = 0, rotExtra = 0, desp = 0, temblor = 0;
      if (!q0) {
        resp = respiracion(t, ritmo.periodo) * ritmo.amplitud;
        if (ritmo.balanceo) {
          const fase = Math.sin(t * Math.PI * 2 * ritmo.balanceo);
          rotExtra = fase * 3.2;
          desp = fase * 2.4;
        }
        if (e.cuerpo === 'tambalea' && s.pasajera) {
          // Crece y se apaga (campana) y dibuja un ocho: giro y desplazamiento 2:1.
          const p = 1 - (s.pasajera.hasta - ahora) / s.pasajera.dura;
          const env = Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
          rotExtra = Math.sin(t * 7) * 8 * env;
          desp = Math.sin(t * 3.5) * 5 * env;
          temblor = Math.sin(t * 14) * 0.025 * env;
        }
      }
      s.rot.obj = (e.cuerpo === 'inclina' ? -7 : 0) + (q0 ? 0 : s.mirada.x * 2.5);
      s.sx.obj = s.apretando ? 1.13 : 1;
      s.sy.obj = s.apretando ? 0.84 : 1;
      // Poco amortiguado a propósito: rebota dos o tres veces y se asienta.
      mover(s.sx, dt, 300, 13, q0);
      mover(s.sy, dt, 300, 13, q0);
      mover(s.rot, dt, 140, 11, q0);
      if (s.oy < 0) {
        s.vy += 1500 * dt;
        s.oy += s.vy * dt;
        if (s.oy >= 0) {
          const golpe = Math.min(1, s.vy / 400);
          s.oy = 0;
          s.vy = 0;
          aplastar(golpe * 0.8);
        }
      }
      const sy = s.sy.x + resp + temblor;
      const sx = s.sx.x - resp * 0.85 - temblor * 0.85;
      // La parte de arriba llega tarde a la inclinación: se dobla, no rota rígido.
      const sesgo = q0 ? 0 : Math.max(-6, Math.min(6, -s.rot.v * 0.1));
      cuerpo.setAttribute('transform',
        `translate(${f(100 + desp)} ${f(BASE + s.oy)}) rotate(${f(s.rot.x + rotExtra)}) skewX(${f(sesgo)}) scale(${f(sx)} ${f(sy)}) translate(-100 ${-BASE})`);
      const so = Math.max(0.5, 1 + s.oy / 140);
      sombra.setAttribute('transform', `translate(${f(100 + desp)} ${BASE}) scale(${f(so * sx)} 1) translate(-100 ${-BASE})`);
      sombra.setAttribute('opacity', f(0.14 * so));

      // La cara sigue la mirada al instante; los accesorios, con un resorte
      // propio: se quedan un poco atrás y se balancean al parar.
      for (const c of capas) {
        const ox = s.mirada.x * 7 * c.p, oy = s.mirada.y * 5 * c.p;
        if (c.p === 1 || q0) { c.x = ox; c.y = oy; c.vx = 0; c.vy = 0; }
        else {
          const h = dt / 4;
          for (let i = 0; i < 4; i++) {
            c.vx += (150 * (ox - c.x) - 12 * c.vx) * h;
            c.vy += (150 * (oy - c.y) - 12 * c.vy) * h;
            c.x += c.vx * h;
            c.y += c.vy * h;
          }
        }
        c.nodo.setAttribute('transform', `translate(${f(c.x)} ${f(c.y)})`);
      }

      // Ojos y boca: solo se redibujan si cambian.
      const giro = e.ojos === 'espiral' ? Math.round(t * 420) % 360 : 0;
      const parpado = ['pildora', 'grande', 'preocupado'].includes(e.ojos) ? s.parpado : 1;
      const clave = `${e.ojos}|${f(parpado)}|${giro}`;
      if (clave !== s.claveOjos) { s.claveOjos = clave; ojos.innerHTML = dibujarOjos(e.ojos, parpado, giro); }
      const bocaTipo = s.conBoca ? e.boca : '';
      if (bocaTipo !== s.claveBoca) { s.claveBoca = bocaTipo; bocaG.innerHTML = bocaTipo ? dibujarBoca(bocaTipo) : ''; }

      moverGlobo(e.globo ?? null, t, dt);

      // Lo que suelta cada estado, de tanto en tanto.
      if (t >= s.proxEfecto) {
        if (s.estado === 'sleeping' && !s.pasajera) {
          soltarParticula('z', GLOBO.x - 14, GLOBO.y + 14, { vx: 14, vy: -22, vida: 2.2 });
          s.proxEfecto = t + 1.3;
        } else if (s.estado === 'problem' && !s.pasajera) {
          soltarParticula('gota', SUDOR.x, SUDOR.y, { vx: 4, vy: 8, gr: 160, vida: 1.1 });
          s.proxEfecto = t + 2.6;
        } else s.proxEfecto = t + 0.5;
      }

      s.vivas = s.vivas.filter((p) => {
        p.edad += dt;
        if (p.edad >= p.vida) { p.g.remove(); return false; }
        p.vy += p.gr * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const prog = p.edad / p.vida;
        const op = prog < 0.15 ? prog / 0.15 : prog > 0.6 ? (1 - prog) / 0.4 : 1;
        const esc = p.escala * (q0 ? 1 : 0.6 + 0.4 * Math.min(1, prog * 4));
        p.g.setAttribute('transform', `translate(${f(p.x)} ${f(p.y)}) rotate(${f(p.giro * prog)}) scale(${f(esc)})`);
        p.g.setAttribute('opacity', f(op));
        return true;
      });
    },

    fijarEstado(nuevo) {
      if (!ESTADOS[nuevo] || nuevo === s.estado) return;
      s.estado = nuevo;
      s.proxEfecto = 0;
      s.objetivo.hasta = 0;
      if (nuevo === 'done') { lanzar('celebra'); saltar(300); estallar(7); }
      else if (s.pasajera?.nombre === 'celebra') s.pasajera = null;
      if (nuevo === 'problem') aplastar(0.5);
    },

    fijarBoca(valor) { s.conBoca = valor; },

    presionar() {
      s.presionado = true;
      clearTimeout(s.temporizador);
      s.temporizador = setTimeout(() => { s.apretando = true; alReaccionar('squeeze'); }, ESPERA_APRETAR);
    },

    soltar(valido) {
      if (!s.presionado) return;
      s.presionado = false;
      clearTimeout(s.temporizador);
      if (s.apretando) {
        // Al soltarlo rebota: el aplastado guarda energía.
        s.apretando = false;
        saltar(340);
        lanzar('toque');
        return;
      }
      if (!valido) return;
      if (s.estado === 'sleeping' && !s.pasajera) { lanzar('despierta'); saltar(220); alReaccionar('tap'); return; }
      // Un clic no suelta nada: responde el cuerpo y la cara. Al quinto
      // seguido se marea.
      const ahora = performance.now();
      if (s.pasajera?.nombre === 'mareo') return;
      s.clics = s.clics.filter((x) => ahora - x < VENTANA_MAREO);
      s.clics.push(ahora);
      if (s.clics.length >= CLICS_MAREO) {
        s.clics = [];
        lanzar('mareo');
        alReaccionar('dizzy');
        return;
      }
      lanzar('toque');
      aplastar(0.9);
      saltar(170);
      alReaccionar('tap');
    },

    destruir() {
      clearTimeout(s.temporizador);
      instancias.delete(m);
    },
  };

  instancias.add(m);
  arrancar();
  return m;
}
