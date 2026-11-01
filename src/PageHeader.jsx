import { useEffect, useState } from 'react';
import { Icon } from './icons.jsx';
import { PAGE_ACTIONS_ID } from './PageActions.jsx';
import { cx } from './variants.js';

/* Cabecera de una vista (1.11.0): arriba, pequeña, la ruta —dónde se está,
   lo primero que se lee de izquierda a derecha—; debajo el título grande con
   su mensaje, y al otro lado la fecha. Debajo, si la vista lo tiene, su estado
   y sus acciones.

   Reemplaza a la banda verde (PageBanner) como cabecera del AppShell: la
   nueva interfaz presenta cada vista sobre el fondo de la página, sin tarjeta
   de color.

     title        el título de la vista (en un inicio, el saludo)
     description  el mensaje que va debajo
     breadcrumbs  { label, href? }[]: la ruta hasta la sección. No repite el
                  título: el último paso es de donde cuelga la vista
     date         la fecha, a la derecha; la pone la aplicación
     clock        true añade la hora tras la fecha, y se actualiza sola
     status       { icon, label, detail, tone }: el estado de la vista, en una
                  franja bajo el título. Para avisar de algo que hay que hacer,
                  mejor MascotAlert
     actions      nodos (Button). La ranura existe siempre: es también el
                  destino de PageActions */

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
  return (
    <header className={cx('hrl-pagehead', className)}>
      <div className="hrl-pagehead__fila">
        <div className="hrl-pagehead__textos">
          {breadcrumbs.length > 0 && (
            <nav className="hrl-migas" aria-label="Ruta de navegación">
              {breadcrumbs.map((m, i) => (
                <span key={m.label} className="hrl-migas__paso">
                  {i > 0 && <Icon name="sh-chevron" size={11} className="hrl-migas__separador" />}
                  {m.href ? <a href={m.href}>{m.label}</a> : <span>{m.label}</span>}
                </span>
              ))}
            </nav>
          )}
          <h1>{title}</h1>
          {description && <p className="hrl-pagehead__bajada">{description}</p>}
        </div>

        {(date || clock) && (
          <p className="hrl-pagehead__fecha">
            <Icon name="sh-calendar" size={16} className="hrl-pagehead__fecha-icono" />
            <span>
              {date}
              {date && clock && <span aria-hidden="true"> · </span>}
              {clock && <Reloj />}
            </span>
          </p>
        )}
      </div>

      {/* La franja es la ranura de PageActions: existe siempre y, vacía, no
          ocupa sitio (:empty). El estado va primero y las acciones a la derecha. */}
      <div className="hrl-pagehead__franja" id={PAGE_ACTIONS_ID}>
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
        {actions && <div className="hrl-pagehead__acciones">{actions}</div>}
      </div>
    </header>
  );
}
