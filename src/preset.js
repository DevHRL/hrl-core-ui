/* Preset del sistema de diseño.

   GENERADO por scripts/generate-tokens.mjs a partir de tokens.json — no se
   edita a mano. Para cambiar un valor, se cambia tokens.json y se corre
   `npm run tokens`.

   Es el equivalente de `tailwind.preset.js` para este stack: la fuente de
   los tokens en JavaScript, para cuando hace falta el valor y no la variable
   (canvas, SVG generado, meta theme-color).

     import { preset, token, literalColor, tokensToCss } from '@hrl/core-ui';

     token('primary')                    // 'var(--primary)'
     preset.color.primary                // '#00a76f'
     literalColor('primary', 'oscuro')   // '#00a76f' (no cambia con el tema)
     tokensToCss()                       // el bloque CSS completo

   Regla: si un valor no está en tokens.json, no es parte del sistema. */

export const preset = {
  color: {
    'bg-app': '#f1f2f4',
    'bg-surface': '#ffffff',
    'text-primary': '#101828',
    'text-secondary': '#5d677a',
    'text-disabled': '#98a2b3',
    border: '#eaecee',
    'border-soft': '#f0f2f3',
    'row-hover': '#f8f9fa',
    'head-bg': '#f4f6f6',
    'surface-sunken': '#f6f7f8',
    'nav-icon': '#667085',
    'nav-text': '#344054',
    /* Versiones opacas, para las celdas fijas de la matriz: al ser sticky se
     superponen a otras filas y con un color translúcido se transparentan. */
    'head-solido': '#f4f6f6',
    'fila-solida': '#fbfcfc',
    'brand-deep': '#0b403a',
    brand: '#107f6f',
    'brand-hover': '#0c6b5e',
    /* El verde profundo se usa como fondo y como texto; en oscuro el texto
     necesita su propio tono, porque sobre fondo oscuro no se lee. */
    'brand-texto': '#086c60',
    'toast-bg': '#101828',
    'action-blue': '#086c60',
    'toast-icono': '#6fe0c8',
    /* Acento categórico, sin significado de estado: identifica módulos y series
     que no son ni acción ni alerta. */
    violet: '#8e33ff',
    danger: '#d1442b',
    'danger-text': '#8e3a26',
    warning: '#ffab00',
    'warning-text': '#7d550f',
    info: '#00b8d9',
    'info-text': '#1f5f86',
    /* Tonos de texto que acompañan a un fondo teñido pálido. En claro son
     oscuros; en oscuro tienen que invertirse o el badge queda ilegible. */
    'ok-text': '#0a5a51',
    'accent-text': '#086c60',
    'neutral-text': '#475467',
    'violet-text': '#5b2bb5',
    /* Identidad institucional del hospital. Son los colores del logotipo, no del
     sistema de diseño: se usan solo en la marca (login y cabecera) y no
     cambian con el tema, porque siempre van sobre fondo claro. */
    'marca-verde': '#3b5c38',
    'marca-tierra': '#8c3a10',
    'marca-naranja': '#963d0c',
    /* Mascota del hospital (Mascot), Dr. Mochi. Son colores de una ilustración,
     no de la interfaz: el cuerpo es mascota-cuerpo y el resto se deriva de él
     (el claro de arriba, las solapas grises de su familia, el estetoscopio y
     la tinta de la cara, muy oscuros para que se lea). No cambian con el tema:
     la bata blanca y el cuerpo se leen sobre los dos fondos. */
    'mascota-cuerpo': '#2fbfa0',
    'mascota-cuerpo-claro': '#c5ede4',
    'mascota-solapa': '#a4c4bd',
    'mascota-estetoscopio': '#1c6e5c',
    'mascota-tinta': '#12302a',
    'mascota-blanco': '#ffffff',
    'mascota-metal': '#d5dfe2',
    'mascota-metal-sombra': '#93a3a9',
    'mascota-cinta': '#4f6f69',
    'mascota-espejo': '#6c7c82',
    'mascota-espejo-centro': '#4d5c61',
    /* Cabecera en banda (PageBanner): un degradado del verde profundo al verde
     de la marca, con texto claro. No cambian con el tema: en oscuro, --brand
     se aclara y el texto blanco dejaría de leerse sobre él, así que la banda
     lleva sus propios valores fijos. */
    'banda-desde': '#004b50',
    'banda-hasta': '#008659',
    'banda-texto': '#ffffff',
    /* Paleta categórica. No es un semáforo: son colores de identidad, sin
     significado de estado. Cada serie mantiene el suyo en todos los paneles
     para que la misma categoría se reconozca de un vistazo. El orden es
     estable: cambiarlo reasigna colores en todo el sistema. */
    'serie-1': '#107f6f',
    'serie-2': '#0c7bb3',
    'serie-3': '#c9822e',
    'serie-4': '#7a2fd1',
    'serie-5': '#c2185b',
    'serie-6': '#0e8c9c',
    'serie-7': '#4c8a16',
    'serie-8': '#d4451c',
    'serie-9': '#4b4fd6',
    'serie-10': '#96154c',
    'serie-11': '#5119b7',
    /* Superficies y texto */
    background: '#f1f2f4',
    foreground: '#101828',
    surface: '#ffffff',
    'surface-foreground': '#101828',
    muted: '#f4f6f6',
    'muted-foreground': '#5d677a',
    'subtle-foreground': '#626b7f',
    /* Accion principal */
    primary: '#107f6f',
    'primary-foreground': '#ffffff',
    'primary-strong': '#0b403a',
    'primary-hover': '#0c6b5e',
    'primary-text': '#086c60',
    /* Accion secundaria / enlaces */
    accent: '#086c60',
    'accent-foreground': '#ffffff',
    /* Semaforo de estado. Cada uno con su par de texto legible sobre su propio
     fondo tenido. */
    destructive: '#d1442b',
    'destructive-foreground': '#ffffff',
    'destructive-text': '#8e3a26',
    'warning-fg': '#7d550f',
    success: '#107f6f',
    'success-text': '#0a5a51',
    'info-fg': '#1f5f86',
    /* Fondos tenidos de cada estado. Existen para no escribir el mismo
     `rgba(...)` suelto en cada aviso, y para poder subirles la opacidad en
     modo oscuro, donde un velo del 8 % no se ve. */
    'info-soft': '#eaf2f7',
    'success-soft': '#e6f2f0',
    'warning-soft': '#f7f0e2',
    'destructive-soft': '#fcede9',
    'neutral-soft': '#edf0f1',
    'violet-soft': '#f1ecfb',
    /* Bordes, campos y foco */
    input: '#ffffff',
    'input-border': '#8a94a6',
    selection: 'rgba(16, 127, 111, 0.18)',
    scrim: 'rgba(16, 24, 40, 0.36)',
    ring: '#107f6f',
    /* ---------------------------------------------- escala tipografica En rem y
     multiplicada por --hrl-escala-texto (la preferencia «Tamaño del texto», de
     1 a 1.5): así el texto respeta también el tamaño de letra del navegador,
     no solo el zoom. */
    'text-3xl': 'calc(2.25rem * var(--hrl-escala-texto, 1))',
  },

  /* Equivalentes del tema oscuro. Solo los que cambian. */
  colorOscuro: {
    'bg-app': '#0e1316',
    'bg-surface': '#171d22',
    'text-primary': '#eef1f4',
    'text-secondary': '#a7b1be',
    'text-disabled': '#6f7a88',
    border: '#283139',
    'border-soft': '#20282e',
    'row-hover': '#1c2328',
    'head-bg': '#1f272d',
    'head-solido': '#1f272d',
    'fila-solida': '#1a2126',
    'brand-texto': '#5fd3bf',
    'toast-bg': '#26313a',
    'danger-text': '#ffac9b',
    'warning-text': '#f3c969',
    'info-text': '#8ccdf0',
    'ok-text': '#6fe0c8',
    'accent-text': '#5fd3bf',
    'neutral-text': '#b8c1cc',
    'violet-text': '#c4a8ff',
    'action-blue': '#5fd3bf',
    'surface-sunken': '#1c2328',
    'nav-icon': '#8b96a4',
    'nav-text': '#d5dbe2',
    danger: '#c4432c',
    'accent-foreground': '#062520',
    /* Sobre superficie oscura, un velo del 8 % desaparece: se refuerzan. */
    'info-soft': 'rgba(140, 205, 240, 0.14)',
    'success-soft': 'rgba(43, 179, 159, 0.18)',
    'warning-soft': 'rgba(243, 201, 105, 0.16)',
    'destructive-soft': 'rgba(255, 120, 95, 0.16)',
    'neutral-soft': 'rgba(184, 193, 204, 0.12)',
    'violet-soft': 'rgba(196, 168, 255, 0.14)',
    /* Los semanticos que no se derivan solos de los de implementacion. */
    'primary-foreground': '#062520',
    'subtle-foreground': '#8b96a4',
    'input-border': '#66727f',
    selection: 'rgba(43, 179, 159, 0.34)',
    scrim: 'rgba(0, 0, 0, 0.55)',
    /* La acción principal en oscuro es un verde agua más claro con texto casi
     negro encima (primary-foreground): el verde del tema claro, con texto
     blanco, se apagaba sobre el fondo oscuro. */
    brand: '#2bb39f',
    'brand-hover': '#3cc4af',
  },

  radius: {
    DEFAULT: '12px',
    xs: '6px',
    sm: '8px',
    md: '10px',
    lg: '14px',
    card: '22px',
    xl: '18px',
    full: '999px',
    nav: '13px',
    tile: '18px',
  },

  shadow: {
    card: '0 1px 3px rgba(16, 24, 40, 0.04), 0 12px 30px -16px rgba(16, 24, 40, 0.12)',
    'card-hover': '0 1px 3px rgba(16, 24, 40, 0.06), 0 18px 36px -16px rgba(16, 24, 40, 0.2)',
    drawer: '-24px 0 48px -12px rgba(16, 24, 40, 0.18)',
    sm: '0 1px 2px rgba(16, 24, 40, 0.06)',
    md: '0 1px 3px rgba(16, 24, 40, 0.04), 0 12px 30px -16px rgba(16, 24, 40, 0.12)',
    lg: '0 1px 3px rgba(16, 24, 40, 0.06), 0 18px 36px -16px rgba(16, 24, 40, 0.2)',
    overlay: '0 32px 64px -16px rgba(16, 24, 40, 0.32)',
  },

  text: {
    xs: 'calc(0.6875rem * var(--hrl-escala-texto, 1))',
    sm: 'calc(0.78125rem * var(--hrl-escala-texto, 1))',
    base: 'calc(0.84375rem * var(--hrl-escala-texto, 1))',
    md: 'calc(0.875rem * var(--hrl-escala-texto, 1))',
    lg: 'calc(1.0625rem * var(--hrl-escala-texto, 1))',
    xl: 'calc(1.375rem * var(--hrl-escala-texto, 1))',
    '2xl': 'calc(2rem * var(--hrl-escala-texto, 1))',
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  leading: {
    tight: 1.25,
    normal: 1.5,
    loose: 1.6,
  },

  font: {
    sans: '\'Plus Jakarta Sans\', system-ui, -apple-system, \'Segoe UI\', sans-serif',
    mono: '\'IBM Plex Mono\', ui-monospace, monospace',
  },

  duration: {
    fast: '0.2s',
    base: '0.35s',
    slow: '0.5s',
  },
  /* Transiciones ya armadas (duración + curva), listas para `transition:`. */
  transition: {
    fast: '0.2s cubic-bezier(0.33, 1, 0.68, 1)',
    base: '0.35s cubic-bezier(0.33, 1, 0.68, 1)',
    slow: '0.5s cubic-bezier(0.33, 1, 0.68, 1)',
  },
  ease: 'cubic-bezier(0.33, 1, 0.68, 1)',

  /* Altura mínima de cualquier control interactivo. */
  touchTarget: {
    base: '40px',
    lg: '44px',
  },

  /* Escala de espaciado (gap, padding) de las separaciones entre bloques. */
  space: {
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '24px',
    '6': '32px',
  },
};

/* Referencia a un token para usarlo en un estilo en línea.
   `token('primary')` devuelve 'var(--primary)', no el hex: así el valor sigue
   cambiando con el tema. */
export function token(nombre, respaldo) {
  return respaldo ? `var(--${nombre}, ${respaldo})` : `var(--${nombre})`;
}

/* Valor literal de un token de color, para cuando hace falta el hex y no la
   variable (canvas, SVG generado, meta theme-color). `tema` es 'claro' u
   'oscuro'. */
export function literalColor(nombre, tema = 'claro') {
  if (tema === 'oscuro' && nombre in preset.colorOscuro) return preset.colorOscuro[nombre];
  return preset.color[nombre];
}

/* Genera el bloque CSS de los tokens. Útil para otro empaquetador o para un
   Shadow DOM, donde la hoja global no llega. */
export function tokensToCss({ selector = ':root', selectorOscuro = ':root[data-tema-hrl="oscuro"]' } = {}) {
  const linea = (k, v) => `  --${k}: ${v};`;

  const claro = [
    ...Object.entries(preset.color).map(([k, v]) => linea(k, v)),
    ...Object.entries(preset.radius).map(([k, v]) => linea(k === 'DEFAULT' ? 'radius' : `radius-${k}`, v)),
    ...Object.entries(preset.shadow).map(([k, v]) => linea(`shadow-${k}`, v)),
    ...Object.entries(preset.text).map(([k, v]) => linea(`text-${k}`, v)),
    ...Object.entries(preset.weight).map(([k, v]) => linea(`weight-${k}`, v)),
    ...Object.entries(preset.leading).map(([k, v]) => linea(`leading-${k}`, v)),
    ...Object.entries(preset.font).map(([k, v]) => linea(`font-${k}`, v)),
    ...Object.entries(preset.duration).map(([k, v]) => linea(`duration-${k}`, v)),
    ...Object.entries(preset.transition).map(([k, v]) => linea(`transition-${k}`, v)),
    linea('ease', preset.ease),
    linea('touch-target', preset.touchTarget.base),
    linea('touch-target-lg', preset.touchTarget.lg),
    ...Object.entries(preset.space).map(([k, v]) => linea(`space-${k}`, v)),
  ].join('\n');

  const oscuro = Object.entries(preset.colorOscuro).map(([k, v]) => linea(k, v)).join('\n');

  return `${selector} {\n${claro}\n}\n\n${selectorOscuro} {\n  color-scheme: dark;\n${oscuro}\n}\n`;
}
