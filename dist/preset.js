const preset = {
  color: {
    "bg-app": "#f9fafb",
    "bg-surface": "#ffffff",
    "text-primary": "#1c252e",
    "text-secondary": "#5f6f7c",
    "text-disabled": "#8493a1",
    border: "rgba(145, 158, 171, 0.2)",
    "border-soft": "rgba(145, 158, 171, 0.16)",
    "row-hover": "rgba(145, 158, 171, 0.06)",
    "head-bg": "rgba(145, 158, 171, 0.08)",
    /* Versiones opacas, para las celdas fijas de la matriz: al ser sticky se
     superponen a otras filas y con un color translúcido se transparentan. */
    "head-solido": "#eff1f3",
    "fila-solida": "#fbfcfc",
    "brand-deep": "#004b50",
    brand: "#008659",
    "brand-hover": "#007867",
    /* El verde profundo se usa como fondo y como texto; en oscuro el texto
     necesita su propio tono, porque sobre fondo oscuro no se lee. */
    "brand-texto": "#004b50",
    "toast-bg": "#1c252e",
    "action-blue": "#0e71f1",
    /* Acento categórico, sin significado de estado: identifica módulos y series
     que no son ni acción ni alerta. */
    violet: "#8e33ff",
    danger: "#e52a00",
    "danger-text": "#b71d18",
    warning: "#ffab00",
    "warning-text": "#7a4100",
    info: "#00b8d9",
    "info-text": "#006c9c",
    /* Tonos de texto que acompañan a un fondo teñido pálido. En claro son
     oscuros; en oscuro tienen que invertirse o el badge queda ilegible. */
    "ok-text": "#00544a",
    "accent-text": "#0a56ae",
    "neutral-text": "#4e5a64",
    /* Identidad institucional del hospital. Son los colores del logotipo, no del
     sistema de diseño: se usan solo en la marca (login y cabecera) y no
     cambian con el tema, porque siempre van sobre fondo claro. */
    "marca-verde": "#3b5c38",
    "marca-tierra": "#8c3a10",
    "marca-naranja": "#963d0c",
    /* Mascota del hospital (Mascot), Dr. Mochi. Son colores de una ilustración,
     no de la interfaz: el cuerpo es mascota-cuerpo y el resto se deriva de él
     (el claro de arriba, las solapas grises de su familia, el estetoscopio y
     la tinta de la cara, muy oscuros para que se lea). No cambian con el tema:
     la bata blanca y el cuerpo se leen sobre los dos fondos. */
    "mascota-cuerpo": "#2fbfa0",
    "mascota-cuerpo-claro": "#c5ede4",
    "mascota-solapa": "#a4c4bd",
    "mascota-estetoscopio": "#1c6e5c",
    "mascota-tinta": "#12302a",
    "mascota-blanco": "#ffffff",
    "mascota-metal": "#d5dfe2",
    "mascota-metal-sombra": "#93a3a9",
    "mascota-cinta": "#4f6f69",
    "mascota-espejo": "#6c7c82",
    "mascota-espejo-centro": "#4d5c61",
    /* Paleta categórica. No es un semáforo: son colores de identidad, sin
     significado de estado. Cada serie mantiene el suyo en todos los paneles
     para que la misma categoría se reconozca de un vistazo. El orden es
     estable: cambiarlo reasigna colores en todo el sistema. */
    "serie-1": "#004b50",
    "serie-2": "#0c7bb3",
    "serie-3": "#b7560b",
    "serie-4": "#7a2fd1",
    "serie-5": "#c2185b",
    "serie-6": "#0e8c9c",
    "serie-7": "#4c8a16",
    "serie-8": "#d4451c",
    "serie-9": "#4b4fd6",
    "serie-10": "#96154c",
    "serie-11": "#5119b7",
    /* Superficies y texto */
    background: "#f9fafb",
    foreground: "#1c252e",
    surface: "#ffffff",
    "surface-foreground": "#1c252e",
    muted: "rgba(145, 158, 171, 0.08)",
    "muted-foreground": "#5f6f7c",
    "subtle-foreground": "#667482",
    /* Accion principal */
    primary: "#008659",
    "primary-foreground": "#ffffff",
    "primary-strong": "#004b50",
    "primary-hover": "#007867",
    "primary-text": "#004b50",
    /* Accion secundaria / enlaces */
    accent: "#0e71f1",
    "accent-foreground": "#ffffff",
    /* Semaforo de estado. Cada uno con su par de texto legible sobre su propio
     fondo tenido. */
    destructive: "#e52a00",
    "destructive-foreground": "#ffffff",
    "destructive-text": "#b71d18",
    "warning-fg": "#7a4100",
    success: "#008659",
    "success-text": "#00544a",
    "info-fg": "#006c9c",
    /* Fondos tenidos de cada estado. Existen para no escribir el mismo
     `rgba(...)` suelto en cada aviso, y para poder subirles la opacidad en
     modo oscuro, donde un velo del 8 % no se ve. */
    "info-soft": "rgba(0, 184, 217, 0.06)",
    "success-soft": "rgba(0, 167, 111, 0.08)",
    "warning-soft": "rgba(255, 171, 0, 0.10)",
    "destructive-soft": "rgba(255, 86, 48, 0.08)",
    "neutral-soft": "rgba(145, 158, 171, 0.10)",
    /* Bordes, campos y foco */
    input: "#ffffff",
    "input-border": "#8493a1",
    selection: "rgba(0, 134, 89, 0.18)",
    scrim: "rgba(28, 37, 46, 0.32)",
    ring: "#008659"
  },
  /* Equivalentes del tema oscuro. Solo los que cambian. */
  colorOscuro: {
    "bg-app": "#10161b",
    "bg-surface": "#18212a",
    "text-primary": "#e9edf1",
    "text-secondary": "#9fb0bd",
    "text-disabled": "#788894",
    border: "rgba(145, 158, 171, 0.26)",
    "border-soft": "rgba(145, 158, 171, 0.16)",
    "row-hover": "rgba(145, 158, 171, 0.1)",
    "head-bg": "rgba(145, 158, 171, 0.12)",
    "head-solido": "#222d37",
    "fila-solida": "#1e2831",
    "brand-texto": "#5be49b",
    "toast-bg": "#2b3742",
    "danger-text": "#ffac9b",
    "warning-text": "#ffd666",
    "info-text": "#61f3f3",
    "ok-text": "#5be49b",
    "accent-text": "#8fc7ff",
    "neutral-text": "#b3c0cb",
    /* Sobre superficie oscura, un velo del 8 % desaparece: se refuerzan. */
    "info-soft": "rgba(0, 184, 217, 0.14)",
    "success-soft": "rgba(0, 167, 111, 0.18)",
    "warning-soft": "rgba(255, 171, 0, 0.18)",
    "destructive-soft": "rgba(255, 86, 48, 0.18)",
    "neutral-soft": "rgba(145, 158, 171, 0.16)",
    /* Los semanticos que no se derivan solos de los de implementacion. */
    "primary-foreground": "#06231b",
    "subtle-foreground": "#8696a2",
    "input-border": "#66737f",
    selection: "rgba(0, 167, 111, 0.34)",
    scrim: "rgba(0, 0, 0, 0.55)",
    /* El verde oscurecido en claro (para que el texto blanco del botón llegue a
     4.5:1) deja muy poco margen para el texto casi negro que usa este tema: se
     conserva aquí el verde original, que ya funcionaba bien con ese texto
     (5.35:1). */
    brand: "#00a76f"
  },
  radius: {
    DEFAULT: "12px",
    xs: "6px",
    sm: "8px",
    md: "10px",
    lg: "14px",
    card: "16px",
    xl: "18px",
    full: "999px"
  },
  shadow: {
    card: "0 0 2px rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
    "card-hover": "0 0 2px rgba(145, 158, 171, 0.2), 0 20px 40px -8px rgba(145, 158, 171, 0.28)",
    drawer: "-24px 0 48px -12px rgba(145, 158, 171, 0.34)",
    sm: "0 1px 2px rgba(28, 37, 46, 0.08)",
    md: "0 0 2px rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
    lg: "0 0 2px rgba(145, 158, 171, 0.2), 0 20px 40px -8px rgba(145, 158, 171, 0.28)",
    overlay: "0 32px 64px -16px rgba(28, 37, 46, 0.44)"
  },
  text: {
    xs: "11px",
    sm: "12.5px",
    base: "13.5px",
    md: "14px",
    lg: "17px",
    xl: "22px",
    "2xl": "30px"
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  leading: {
    tight: 1.25,
    normal: 1.5,
    loose: 1.6
  },
  font: {
    sans: "'Public Sans', Helvetica, Arial, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace"
  },
  duration: {
    fast: "0.2s",
    base: "0.35s",
    slow: "0.5s"
  },
  /* Transiciones ya armadas (duración + curva), listas para `transition:`. */
  transition: {
    fast: "0.2s cubic-bezier(0.33, 1, 0.68, 1)",
    base: "0.35s cubic-bezier(0.33, 1, 0.68, 1)",
    slow: "0.5s cubic-bezier(0.33, 1, 0.68, 1)"
  },
  ease: "cubic-bezier(0.33, 1, 0.68, 1)",
  /* Altura mínima de cualquier control interactivo. */
  touchTarget: {
    base: "40px",
    lg: "44px"
  },
  /* Escala de espaciado (gap, padding) de las separaciones entre bloques. */
  space: {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "24px",
    "6": "32px"
  }
};
function token(nombre, respaldo) {
  return respaldo ? `var(--${nombre}, ${respaldo})` : `var(--${nombre})`;
}
function literalColor(nombre, tema = "claro") {
  if (tema === "oscuro" && nombre in preset.colorOscuro) return preset.colorOscuro[nombre];
  return preset.color[nombre];
}
function tokensToCss({ selector = ":root", selectorOscuro = ':root[data-tema-hrl="oscuro"]' } = {}) {
  const linea = (k, v) => `  --${k}: ${v};`;
  const claro = [
    ...Object.entries(preset.color).map(([k, v]) => linea(k, v)),
    ...Object.entries(preset.radius).map(([k, v]) => linea(k === "DEFAULT" ? "radius" : `radius-${k}`, v)),
    ...Object.entries(preset.shadow).map(([k, v]) => linea(`shadow-${k}`, v)),
    ...Object.entries(preset.text).map(([k, v]) => linea(`text-${k}`, v)),
    ...Object.entries(preset.weight).map(([k, v]) => linea(`weight-${k}`, v)),
    ...Object.entries(preset.leading).map(([k, v]) => linea(`leading-${k}`, v)),
    ...Object.entries(preset.font).map(([k, v]) => linea(`font-${k}`, v)),
    ...Object.entries(preset.duration).map(([k, v]) => linea(`duration-${k}`, v)),
    ...Object.entries(preset.transition).map(([k, v]) => linea(`transition-${k}`, v)),
    linea("ease", preset.ease),
    linea("touch-target", preset.touchTarget.base),
    linea("touch-target-lg", preset.touchTarget.lg),
    ...Object.entries(preset.space).map(([k, v]) => linea(`space-${k}`, v))
  ].join("\n");
  const oscuro = Object.entries(preset.colorOscuro).map(([k, v]) => linea(k, v)).join("\n");
  return `${selector} {
${claro}
}

${selectorOscuro} {
  color-scheme: dark;
${oscuro}
}
`;
}
export {
  literalColor,
  preset,
  token,
  tokensToCss
};
//# sourceMappingURL=preset.js.map
