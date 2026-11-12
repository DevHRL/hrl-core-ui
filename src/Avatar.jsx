import { toneVars } from './tones.js';

/* Iniciales de una persona en un círculo.

   Casi siempre acompaña al nombre escrito al lado, y entonces es decorativo
   (aria-hidden): repetir el nombre al lector de pantalla no aporta. Solo con
   `label` se anuncia, para cuando el avatar va solo.

     name   nombre completo; se toman las iniciales de las dos primeras palabras
     size   sm (28) · md (40) · lg (56)
     tone   ok · info · warn · crit · none · violet — el estado de la persona
            (p. ej. con o sin disponibilidad); el texto de al lado lo dice también
     label  texto para el lector de pantalla cuando el avatar va sin nombre */
const TAMANOS = ['sm', 'md', 'lg'];

function iniciales(nombre) {
  const palabras = String(nombre ?? '')
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return palabras.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?';
}

export function Avatar({ name, size = 'md', tone = 'none', label }) {
  return (
    <span
      className={`hrl-avatar hrl-avatar--${TAMANOS.includes(size) ? size : 'md'}`}
      style={toneVars(tone)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {iniciales(name)}
    </span>
  );
}
