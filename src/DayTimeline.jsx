import { useFloatingTip } from './useFloatingTip.js';
import { FloatingTip } from './Tooltip.jsx';
import { toneVars } from './tones.js';

/* Un día en una línea de tiempo: recursos (salas, personas, equipos) en filas y
   las horas en el eje, con cada reserva como un bloque de su duración.

   Existe porque una tabla de «ocupado de 08:00 a 12:00» no deja ver los huecos
   ni los cruces; dibujados a escala se ven de un vistazo. Si dos bloques de una
   misma fila se solapan, el segundo baja a otro carril en vez de taparse.

     rows      { key, title, subtitle?, blocks: Block[] }[]
               Block = { key, start: 'HH:MM', end: 'HH:MM', label, detail?, tone?,
                         outline?, tip?: { title?, body }, onSelect? }
     start     hora del inicio del eje ('07:00')
     end       hora del final del eje ('20:00')
     step      minutos entre marcas del eje (60)
     now       'HH:MM': dibuja la hora actual
     label     nombre de la línea de tiempo (req.)
     legend    { label, tone, outline? }[]
     empty     texto cuando no hay filas

   Lo que cae fuera del eje se recorta al borde y lo dice su tooltip. */
const minutos = (hhmm) => {
  const [h, m] = String(hhmm ?? '').split(':').map(Number);
  return Number.isFinite(h) ? h * 60 + (Number.isFinite(m) ? m : 0) : null;
};

/* Reparte los bloques en carriles: cada uno va al primer carril cuyo último
   bloque ya terminó. */
function carriles(bloques) {
  const fines = [];
  return [...bloques]
    .map((b) => ({ ...b, ini: minutos(b.start), fin: minutos(b.end) }))
    .filter((b) => b.ini != null && b.fin != null && b.fin > b.ini)
    .sort((a, b) => a.ini - b.ini || a.fin - b.fin)
    .map((b) => {
      let carril = fines.findIndex((f) => f <= b.ini);
      if (carril < 0) carril = fines.length;
      fines[carril] = b.fin;
      return { ...b, carril };
    });
}

export function DayTimeline({
  rows = [],
  start = '07:00',
  end = '20:00',
  step = 60,
  now,
  label,
  legend = [],
  empty = 'Sin reservas.',
}) {
  const { tip, follow, anchor, hide } = useFloatingTip();
  const desde = minutos(start) ?? 420;
  const hasta = Math.max(desde + 60, minutos(end) ?? 1200);
  const rango = hasta - desde;
  const pct = (m) => `${((Math.min(hasta, Math.max(desde, m)) - desde) / rango) * 100}%`;
  const marcas = [];
  for (let m = desde; m <= hasta; m += step) marcas.push(m);
  const ahora = minutos(now);
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  return (
    <div className="hrl-agenda">
      <div className="hrl-agenda__marco" role="group" aria-label={label}>
        <div className="hrl-agenda__fila hrl-agenda__fila--eje" aria-hidden="true">
          <span className="hrl-agenda__recurso" />
          <span className="hrl-agenda__pista">
            {marcas.map((m) => (
              <span key={m} className="hrl-agenda__marca" style={{ left: pct(m) }}>{hhmm(m)}</span>
            ))}
          </span>
        </div>

        {rows.map((r) => {
          const bloques = carriles(r.blocks ?? []);
          const total = Math.max(1, ...bloques.map((b) => b.carril + 1));
          return (
            <div key={r.key} className="hrl-agenda__fila" role="group" aria-label={r.title}>
              <span className="hrl-agenda__recurso">
                <span className="hrl-agenda__nombre">{r.title}</span>
                {r.subtitle && <span className="hrl-agenda__sub">{r.subtitle}</span>}
              </span>
              <span className="hrl-agenda__pista" style={{ '--carriles': total }}>
                {marcas.map((m) => (
                  <span key={m} className="hrl-agenda__guia" style={{ left: pct(m) }} aria-hidden="true" />
                ))}
                {ahora != null && ahora >= desde && ahora <= hasta && (
                  <span className="hrl-agenda__ahora" style={{ left: pct(ahora) }} aria-hidden="true" />
                )}
                {bloques.length === 0 && <span className="hrl-agenda__libre">Libre todo el día</span>}
                {bloques.map((b) => {
                  const recortado = b.ini < desde || b.fin > hasta;
                  const titulo = b.tip?.title ?? `${b.start}–${b.end} · ${b.label}`;
                  const cuerpo = `${b.tip?.body ?? b.detail ?? ''}${recortado ? ' (sigue fuera del horario mostrado)' : ''}`.trim() || b.label;
                  const comunes = {
                    className: `hrl-agenda__bloque${b.outline ? ' hrl-agenda__bloque--contorno' : ''}`,
                    style: {
                      ...toneVars(b.tone ?? 'info', b.outline),
                      left: pct(b.ini),
                      width: `calc(${pct(b.fin)} - ${pct(b.ini)})`,
                      top: `calc(${b.carril} * var(--agenda-carril))`,
                    },
                    'aria-label': `${b.start} a ${b.end}. ${b.label}${b.detail ? `. ${b.detail}` : ''}`,
                    onMouseEnter: (e) => follow(e, titulo, cuerpo),
                    onMouseMove: (e) => follow(e, titulo, cuerpo),
                    onMouseLeave: hide,
                    onFocus: (e) => anchor(e.currentTarget, titulo, cuerpo),
                    onBlur: hide,
                  };
                  const contenido = (
                    <>
                      <span className="hrl-agenda__bloque-hora">{b.start}–{b.end}</span>
                      <span className="hrl-agenda__bloque-texto">{b.label}</span>
                    </>
                  );
                  return b.onSelect ? (
                    <button key={b.key} type="button" {...comunes} onClick={b.onSelect}>{contenido}</button>
                  ) : (
                    <span key={b.key} role="img" tabIndex={0} {...comunes}>{contenido}</span>
                  );
                })}
              </span>
            </div>
          );
        })}

        {rows.length === 0 && <p className="hrl-agenda__vacio">{empty}</p>}
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
