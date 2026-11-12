import { useRef } from 'react';
import { Icon } from './icons.jsx';
import { useFloatingTip } from './useFloatingTip.js';
import { FloatingTip } from './Tooltip.jsx';
import { toneVars } from './tones.js';

/* Los cupos de un turno, hora por hora.

   Cada cupo dice su estado con fondo **e** icono (el color nunca es la única
   señal) y, si se puede elegir, es un botón. Es un único punto de tabulación:
   las flechas recorren los cupos elegibles, como en `Calendar`.

     slots       { key, time, status, extra?, note?, tip?, tone? }[]
                   status  free · taken · held · blocked · past
                   extra   cupo adicional (sobrecupo): lleva su marca «+»
                   note    texto corto bajo la hora («Nuevo», «SIGH»)
                   tip     { title?, body } para el tooltip; por defecto, el estado
                   tone    fuerza el tono (p. ej. `violet` para otro origen)
     label       nombre del grupo (req.)
     onSelect    (slot) => void; sin él, la rejilla es solo de lectura
     selectable  (slot) => boolean; por defecto, solo los libres
     selected    key del cupo elegido
     legend      muestra la leyenda con el conteo de cada estado
     empty       texto cuando no hay cupos */
const SLOT_STATUS = {
  free: { texto: 'Libre', tono: 'ok', icono: null, contorno: true },
  taken: { texto: 'Ocupado', tono: 'info', icono: 'sh-profile', contorno: false },
  held: { texto: 'Retenido', tono: 'warn', icono: 'sh-clock', contorno: false },
  blocked: { texto: 'Bloqueado', tono: 'none', icono: 'sh-close', contorno: false },
  past: { texto: 'Ya pasó', tono: 'none', icono: null, contorno: true },
};

export function SlotGrid({
  slots = [],
  label,
  onSelect,
  selectable = (s) => s.status === 'free',
  selected,
  legend = true,
  empty = 'Sin cupos.',
}) {
  const refs = useRef([]);
  const { tip, follow, anchor, hide } = useFloatingTip();
  const elegibles = onSelect ? slots.map((s, i) => (selectable(s) ? i : -1)).filter((i) => i >= 0) : [];
  const conTab = (() => {
    const i = slots.findIndex((s) => s.key === selected);
    return elegibles.includes(i) ? i : elegibles[0];
  })();

  const mover = (desde, paso) => {
    const pos = elegibles.indexOf(desde);
    const siguiente = elegibles[(pos + paso + elegibles.length) % elegibles.length];
    refs.current[siguiente]?.focus();
  };

  if (!slots.length) return <p className="hrl-cupos__vacio">{empty}</p>;

  const conteo = {};
  for (const s of slots) conteo[s.status] = (conteo[s.status] ?? 0) + 1;

  return (
    <div className="hrl-cupos">
      <div className="hrl-cupos__rejilla" role="group" aria-label={label}>
        {slots.map((s, i) => {
          const estado = SLOT_STATUS[s.status] ?? SLOT_STATUS.free;
          const puede = elegibles.includes(i);
          const titulo = s.tip?.title ?? `${s.time} · ${estado.texto}${s.extra ? ' (adicional)' : ''}`;
          const cuerpo = s.tip?.body ?? (s.note || estado.texto);
          const nombre = `${s.time}. ${estado.texto}${s.extra ? ', adicional' : ''}${s.note ? `. ${s.note}` : ''}`;
          const clase = `hrl-cupo hrl-cupo--${s.status}${s.key === selected ? ' hrl-cupo--on' : ''}${puede ? ' hrl-cupo--elegible' : ''}`;
          const contenido = (
            <>
              <span className="hrl-cupo__hora">
                {s.time}
                {s.extra && <span className="hrl-cupo__extra" aria-hidden="true">+</span>}
              </span>
              {estado.icono && <Icon name={estado.icono} size={12} />}
              {s.note && <span className="hrl-cupo__nota">{s.note}</span>}
            </>
          );
          const comunes = {
            className: clase,
            style: toneVars(s.tone ?? estado.tono, estado.contorno),
            onMouseEnter: (e) => follow(e, titulo, cuerpo),
            onMouseMove: (e) => follow(e, titulo, cuerpo),
            onMouseLeave: hide,
            onBlur: hide,
          };
          if (!puede) {
            return (
              <span key={s.key} {...comunes} role="img" aria-label={nombre}>
                {contenido}
              </span>
            );
          }
          return (
            <button
              key={s.key}
              {...comunes}
              ref={(n) => { refs.current[i] = n; }}
              type="button"
              aria-label={nombre}
              aria-pressed={s.key === selected}
              tabIndex={i === conTab ? 0 : -1}
              onClick={() => onSelect(s)}
              onFocus={(e) => anchor(e.currentTarget, titulo, cuerpo)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); mover(i, 1); }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); mover(i, -1); }
              }}
            >
              {contenido}
            </button>
          );
        })}
      </div>

      {legend && (
        <div className="hrl-cupos__leyenda">
          {Object.entries(SLOT_STATUS).filter(([k]) => conteo[k]).map(([k, e]) => (
            <span key={k} className="hrl-cupos__muestra">
              <span className={`hrl-cupos__cuadro hrl-cupo--${k}`} style={toneVars(e.tono, e.contorno)} />
              {e.texto} · {conteo[k]}
            </span>
          ))}
          {slots.some((s) => s.extra) && <span className="hrl-cupos__muestra">+ adicional</span>}
        </div>
      )}

      <FloatingTip tip={tip} />
    </div>
  );
}
