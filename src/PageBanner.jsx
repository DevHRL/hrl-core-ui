import { useEffect, useState } from 'react';
import { Icon } from './icons.jsx';
import { Mascot } from './Mascot.jsx';
import { PAGE_ACTIONS_ID } from './PageActions.jsx';
import { cx } from './variants.js';

/* Cabecera en banda: la vista se presenta en una tarjeta con un degradado del
   verde profundo al de la marca y ondas verde agua en la base.

   Un lado es lo de siempre —migas, título y debajo la descripción—; el otro
   es lo que pasa ahora en esa vista, dicho una sola vez: un estado (icono,
   etiqueta y una línea de detalle) y sus acciones. Así el estado no se repite
   en dos etiquetas y lo que hay que hacer queda junto a lo que lo explica.

     title        el título de la vista
     description  lo que va debajo (en un inicio, la fecha de hoy)
     breadcrumbs  { label, href? }[]
     clock        true añade la hora tras la descripción («… | 5:36 p. m.»),
                  y se actualiza sola
     status       { icon, label, detail, tone }: tone 'warning' pone la
                  etiqueta sobre amarillo (un plazo que vence hoy); la
                  etiqueta dice lo que pasa, así que el color no es la única
                  señal
     mascot       un estado de Mascot ('idle', 'thinking', 'done'…) para que
                  la mascota acompañe al estado; mejor solo en la portada
     actions      nodos (Button). El principal con tone="cta" sale en blanco y
                  los demás, con tone="ghost", con borde claro

   El AppShell la dibuja con su prop `banner`. A diferencia de PageHeader, va
   al principio del contenido y no dentro de la barra superior fija: es alta,
   y fija se comería la pantalla al desplazarse. Conserva la ranura de
   PageActions, así que una vista puede seguir poniendo ahí sus controles. */

const HORA = new Intl.DateTimeFormat('es-PE', { hour: 'numeric', minute: '2-digit', hour12: true });

function Reloj() {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    // Cada 15 s basta para que el minuto cambie a tiempo sin repintar de más.
    const t = setInterval(() => setAhora(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return (
    <time className="hrl-banda__hora" dateTime={ahora.toISOString()}>
      {HORA.format(ahora)}
    </time>
  );
}

export function PageBanner({ title, description, breadcrumbs = [], clock = false, status, mascot, actions, className }) {
  return (
    <header className={cx('hrl-banda', status?.tone === 'warning' && 'hrl-banda--aviso', className)}>
      <div className="hrl-banda__titulo">
        {breadcrumbs.length > 0 && (
          <nav className="hrl-banda__migas" aria-label="Ruta de navegación">
            {breadcrumbs.map((m, i) => {
              const ultimo = i === breadcrumbs.length - 1;
              return (
                <span key={m.label} className="hrl-banda__paso">
                  {i > 0 && <Icon name="sh-chevron" size={11} />}
                  {ultimo || !m.href ? <span aria-current={ultimo ? 'page' : undefined}>{m.label}</span> : <a href={m.href}>{m.label}</a>}
                </span>
              );
            })}
          </nav>
        )}
        <h1>{title}</h1>
        {(description || clock) && (
          <p className="hrl-banda__bajada">
            {description}
            {description && clock && <span className="hrl-banda__separador" aria-hidden="true">|</span>}
            {clock && <Reloj />}
          </p>
        )}
      </div>

      <div className="hrl-banda__lado">
        {(status || mascot) && (
          <div className="hrl-banda__estado-fila">
            {status && (
              <div className="hrl-banda__estado">
                <p className="hrl-banda__etiqueta">
                  {status.icon && <Icon name={status.icon} size={18} />}
                  {status.label}
                </p>
                {status.detail && <p className="hrl-banda__detalle">{status.detail}</p>}
              </div>
            )}
            {mascot && <Mascot state={mascot} size="md" />}
          </div>
        )}
        {/* Siempre presente: además de `actions`, es el destino de PageActions. */}
        <div className="hrl-banda__acciones" id={PAGE_ACTIONS_ID}>
          {actions}
        </div>
      </div>

      <svg className="hrl-banda__ondas" viewBox="0 0 1200 72" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 40 C200 10 400 70 600 40 S1000 10 1200 35 V72 H0Z" />
        <path d="M0 52 C250 30 450 75 700 50 S1050 30 1200 50 V72 H0Z" />
        <path d="M0 62 C300 50 600 75 900 60 S1100 52 1200 60 V72 H0Z" />
      </svg>
    </header>
  );
}
