import { useEffect, useState } from 'react';
import { Icon } from './icons.jsx';
import { PAGE_ACTIONS_ID } from './PageActions.jsx';
import { cx } from './variants.js';

/* Cabecera de una vista (1.11.0): el título grande con su mensaje debajo y,
   al otro lado, dónde se está —la ruta— y qué día es. Debajo, si la vista lo
   tiene, su estado dicho una sola vez y sus acciones.

   Reemplaza a la banda verde (PageBanner) como cabecera del AppShell: la
   nueva interfaz presenta cada vista sobre el fondo de la página, sin tarjeta
   de color. El estado sigue siendo un dato de la vista, no un adorno, así que
   conserva su lugar en una franja propia bajo el título.

     title        el título de la vista (en un inicio, el saludo)
     description  el mensaje que va debajo
     breadcrumbs  { label, href? }[]: la ruta, a la derecha
     date         la fecha bajo la ruta; la pone la aplicación
     clock        true añade la hora tras la fecha, y se actualiza sola
     status       { icon, label, detail, tone }: tone 'warning' lo marca en
                  ámbar. La etiqueta dice lo que pasa: el color no es la única
                  señal
     actions      nodos (Button) junto al estado. La ranura existe siempre: es
                  también el destino de PageActions */

const HORA = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

function Reloj() {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    // Cada 15 s basta para que el minuto cambie a tiempo sin repintar de más.
    const t = setInterval(() => setAhora(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return (
    <time className="hrl-pagehead__hora" dateTime={ahora.toISOString()}>
      {HORA.format(ahora)}
    </time>
  );
}

export function PageHeader({ title, description, breadcrumbs = [], date, clock = false, status, actions, className }) {
  const conLado = breadcrumbs.length > 0 || date || clock;

  return (
    <header className={cx('hrl-pagehead', className)}>
      <div className="hrl-pagehead__fila">
        <div className="hrl-pagehead__textos">
          <h1>{title}</h1>
          {description && <p className="hrl-pagehead__bajada">{description}</p>}
        </div>

        {conLado && (
          <div className="hrl-pagehead__lado">
            {breadcrumbs.length > 0 && (
              <nav className="hrl-migas" aria-label="Ruta de navegación">
                <Icon name="sh-folder" size={17} className="hrl-migas__icono" />
                {breadcrumbs.map((m, i) => {
                  const ultimo = i === breadcrumbs.length - 1;
                  return (
                    <span key={m.label} className="hrl-migas__paso">
                      {i > 0 && <Icon name="sh-chevron" size={12} className="hrl-migas__separador" />}
                      {ultimo || !m.href ? (
                        <span aria-current={ultimo ? 'page' : undefined}>{m.label}</span>
                      ) : (
                        <a href={m.href}>{m.label}</a>
                      )}
                    </span>
                  );
                })}
              </nav>
            )}
            {(date || clock) && (
              <p className="hrl-pagehead__fecha">
                {date}
                {date && clock && <span aria-hidden="true"> · </span>}
                {clock && <Reloj />}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="hrl-pagehead__franja">
        {status && (
          <p className={cx('hrl-pagehead__estado', status.tone === 'warning' && 'hrl-pagehead__estado--aviso')}>
            {status.icon && (
              <span className="hrl-pagehead__estado-icono" aria-hidden="true">
                <Icon name={status.icon} size={17} />
              </span>
            )}
            <span className="hrl-pagehead__estado-textos">
              <strong>{status.label}</strong>
              {status.detail && <span>{status.detail}</span>}
            </span>
          </p>
        )}
        <div className="hrl-pagehead__acciones" id={PAGE_ACTIONS_ID}>
          {actions}
        </div>
      </div>
    </header>
  );
}
