/* Tonos de estado compartidos por los componentes de agenda (ScheduleGrid,
   DayTimeline, SlotGrid, CapacityMeter, Avatar).

   Son los mismos pares texto/fondo que `Badge`: el texto (--*-text) se invierte
   con el tema oscuro y el fondo (--*-soft) es el tenue de estado, así que el
   contraste ya está medido por `npm run contrast`. `line` es el color pleno del
   tono, para bordes y rellenos que no llevan texto encima.

   `violet` existe para distinguir un ORIGEN (otro sistema, otra sede) sin
   confundirlo con un estado: es el acento categórico `--violet`, con su par
   de texto y fondo tenue en cada tema. */
export const TONES = {
  ok: { fg: 'var(--ok-text)', bg: 'var(--success-soft)', line: 'var(--success)' },
  info: { fg: 'var(--info-text)', bg: 'var(--info-soft)', line: 'var(--info)' },
  warn: { fg: 'var(--warning-text)', bg: 'var(--warning-soft)', line: 'var(--warning)' },
  crit: { fg: 'var(--danger-text)', bg: 'var(--destructive-soft)', line: 'var(--destructive)' },
  none: { fg: 'var(--neutral-text)', bg: 'var(--neutral-soft)', line: 'var(--input-border)' },
  violet: { fg: 'var(--violet-text)', bg: 'var(--violet-soft)', line: 'var(--violet)' },
};

/* Variables CSS de un tono, para el `style` de un elemento. Con `outline` el
   fondo es la superficie y el tono queda en el borde y el texto: así se
   distingue un borrador (contorno) de lo ya confirmado (relleno tenue). */
export function toneVars(tone, outline = false) {
  const t = TONES[tone] ?? TONES.none;
  return {
    '--tone-fg': t.fg,
    '--tone-bg': outline ? 'var(--surface)' : t.bg,
    '--tone-line': t.line,
  };
}
