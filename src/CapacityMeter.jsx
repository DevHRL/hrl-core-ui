import { useFloatingTip } from './useFloatingTip.js';
import { FloatingTip } from './Tooltip.jsx';
import { TONES } from './tones.js';

/* Cuánto de una capacidad está tomado, y por quién.

   Sustituye a una barra de progreso suelta: dice la cifra («12 de 20»), reparte
   lo usado en tramos (cada uno con su tooltip) y se anuncia como `meter`.

     total     la capacidad. `null` es «sin dato», NO cero: la barra no se
               dibuja y el texto lo dice (un 0 % afirmaría que se midió)
     segments  { key, label, value, tone? }[] — lo usado, por tramos
     label     qué se mide (req. para el lector de pantalla)
     unit      cómo se llama cada unidad en el texto («cupos»)
     compact   sin la línea de texto, para una celda de tabla

   Si lo usado supera la capacidad (sobrecupos), la barra se llena y el texto
   marca el exceso en vez de recortarlo en silencio. */
const TONO_TRAMO = ['info', 'violet', 'warn', 'crit', 'ok'];

export function CapacityMeter({ total, segments = [], label, unit = '', compact = false, format = (n) => n.toLocaleString('es-PE') }) {
  const { tip, follow, anchor, hide } = useFloatingTip();
  const usado = segments.reduce((n, s) => n + (Number(s.value) || 0), 0);
  const sinDato = total == null;
  const libre = sinDato ? null : Math.max(0, total - usado);
  const exceso = sinDato ? 0 : Math.max(0, usado - total);
  const base = sinDato ? 0 : Math.max(total, usado);
  const sufijo = unit ? ` ${unit}` : '';

  const texto = sinDato
    ? `${format(usado)}${sufijo} usados · capacidad sin dato`
    : `${format(usado)} de ${format(total)}${sufijo}${exceso ? ` · ${format(exceso)} sobre la capacidad` : ` · ${format(libre)} libres`}`;

  return (
    <div className={`hrl-capacidad${compact ? ' hrl-capacidad--compacta' : ''}`}>
      <div
        className="hrl-capacidad__barra"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={sinDato ? undefined : total}
        aria-valuenow={sinDato ? undefined : Math.min(usado, total)}
        aria-valuetext={texto}
      >
        {!sinDato && base > 0 && segments.map((s, i) => {
          const valor = Number(s.value) || 0;
          if (!valor) return null;
          const tono = TONES[s.tone ?? TONO_TRAMO[i % TONO_TRAMO.length]] ?? TONES.info;
          const detalle = `${format(valor)}${sufijo}`;
          return (
            <span
              key={s.key}
              className="hrl-capacidad__tramo"
              style={{ width: `${(valor / base) * 100}%`, background: tono.line }}
              tabIndex={compact ? -1 : 0}
              aria-label={`${s.label}: ${detalle}`}
              onMouseEnter={(e) => follow(e, s.label, detalle)}
              onMouseMove={(e) => follow(e, s.label, detalle)}
              onMouseLeave={hide}
              onFocus={(e) => anchor(e.currentTarget, s.label, detalle)}
              onBlur={hide}
            />
          );
        })}
      </div>
      {!compact && (
        <span className={`hrl-capacidad__texto${exceso ? ' hrl-capacidad__texto--exceso' : ''}`}>{texto}</span>
      )}
      <FloatingTip tip={tip} />
    </div>
  );
}
