import { useFloatingTip } from './useFloatingTip.js';
import { FloatingTip } from './Tooltip.jsx';
import { toneVars } from './tones.js';

/* Rejilla de un rol: personas (o recursos) en filas y días en columnas, con las
   asignaciones de cada celda como píldoras cortas.

   La primera columna queda fija al desplazar en horizontal, porque un mes no
   cabe en una pantalla y sin el nombre a la vista la fila no se lee. Cada
   píldora es un botón si tiene `onSelect`; su texto es corto (una o dos letras)
   y el detalle va en el tooltip y en el nombre accesible.

     columns     { key, label, sublabel?, muted? }[]   — `muted`: fin de semana o feriado
     rows        { key, title, subtitle? }[]
     entriesOf   (row, column) => { key, label, tone?, outline?, tip?: { title?, body }, ariaLabel?, onSelect? }[]
     label       nombre de la rejilla (req.)
     rowHeader   cabecera de la primera columna
     legend      { label, tone, outline? }[] — qué significa cada tono
     empty       texto cuando no hay filas
     loading     atenúa la rejilla mientras se recarga

   No pagina: un rol se lee completo. Para listas largas, filtrar antes. */
export function ScheduleGrid({
  columns = [],
  rows = [],
  entriesOf = () => [],
  label,
  rowHeader = '',
  legend = [],
  empty = 'Sin asignaciones.',
  loading = false,
}) {
  const { tip, follow, anchor, hide } = useFloatingTip();

  return (
    <div className="hrl-rol">
      <div className={`hrl-rol__marco${loading ? ' hrl-rol__marco--cargando' : ''}`} aria-busy={loading || undefined}>
        <table className="hrl-rol__tabla" aria-label={label}>
          <thead>
            <tr>
              <th scope="col" className="hrl-rol__fija">{rowHeader}</th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`hrl-rol__dia${c.muted ? ' hrl-rol__dia--suave' : ''}`}>
                  {c.sublabel && <span className="hrl-rol__sub">{c.sublabel}</span>}
                  <span>{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <th scope="row" className="hrl-rol__fija">
                  <span className="hrl-rol__nombre">{r.title}</span>
                  {r.subtitle && <span className="hrl-rol__sub">{r.subtitle}</span>}
                </th>
                {columns.map((c) => {
                  const entradas = entriesOf(r, c) ?? [];
                  return (
                    <td key={c.key} className={c.muted ? 'hrl-rol__celda--suave' : undefined}>
                      {entradas.length > 0 && (
                        <span className="hrl-rol__celda">
                          {entradas.map((e) => {
                            const titulo = e.tip?.title ?? `${r.title} · ${c.label}`;
                            const cuerpo = e.tip?.body ?? e.label;
                            const comunes = {
                              className: `hrl-rol__turno${e.outline ? ' hrl-rol__turno--contorno' : ''}`,
                              style: toneVars(e.tone, e.outline),
                              'aria-label': e.ariaLabel ?? `${titulo}. ${cuerpo}`,
                              onMouseEnter: (ev) => follow(ev, titulo, cuerpo),
                              onMouseMove: (ev) => follow(ev, titulo, cuerpo),
                              onMouseLeave: hide,
                              onFocus: (ev) => anchor(ev.currentTarget, titulo, cuerpo),
                              onBlur: hide,
                            };
                            return e.onSelect ? (
                              <button key={e.key} type="button" {...comunes} onClick={e.onSelect}>{e.label}</button>
                            ) : (
                              <span key={e.key} role="img" tabIndex={0} {...comunes}>{e.label}</span>
                            );
                          })}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="hrl-rol__vacio">{empty}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {legend.length > 0 && (
        <div className="hrl-rol__leyenda">
          {legend.map((l) => (
            <span key={l.label} className="hrl-rol__muestra">
              <span className={`hrl-rol__turno hrl-rol__turno--muestra${l.outline ? ' hrl-rol__turno--contorno' : ''}`} style={toneVars(l.tone, l.outline)} />
              {l.label}
            </span>
          ))}
        </div>
      )}

      <FloatingTip tip={tip} />
    </div>
  );
}
