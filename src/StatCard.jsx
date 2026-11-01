import { Tooltip } from './Tooltip.jsx';
import { Icon } from './icons.jsx';

const SEVERIDAD = {
  neutral: 'var(--accent)',
  normal: 'var(--success)',
  suspect: 'var(--warning)',
  abnormal: 'var(--destructive)',
  nodata: 'var(--subtle-foreground)',
};

/* El tono de texto de cada severidad: el icono va en él porque el color pleno
   (el ámbar, sobre todo) no se lee sobre blanco. */
const SEVERIDAD_TEXTO = {
  neutral: 'var(--primary-text)',
  normal: 'var(--success-text)',
  suspect: 'var(--warning-fg)',
  abnormal: 'var(--destructive-text)',
  nodata: 'var(--subtle-foreground)',
};

/* El icono solo aparece cuando la cifra avisa de algo (sospechosa o
   anormal). En una fila de cifras normales, cuatro iconos iguales no decían
   nada, y un visto junto a «0 fuera de plazo» se leía como contradicción. */
const AVISA = new Set(['suspect', 'abnormal']);

const ICONO = {
  neutral: 'sh-chart',
  normal: 'sh-ok',
  suspect: 'sh-warn',
  abnormal: 'sh-crit',
  nodata: 'sh-none',
};

export function StatCard({ label = 'Métrica', value = '—', note, severity = 'neutral', percent, delay = 0, info, onClick }) {
  const color = SEVERIDAD[severity] ?? SEVERIDAD.neutral;
  const conBarra = typeof percent === 'number';
  const pct = conBarra ? Math.max(0, Math.min(100, percent)) : 0;
  /* Con `onClick` la tarjeta es un control real (botón), no un `article` con
     un manejador pegado: así queda alcanzable con teclado y no rompe la
     selección de texto del resto de la tarjeta. */
  const Etiqueta = onClick ? 'button' : 'article';

  return (
    <Etiqueta
      type={onClick ? 'button' : undefined}
      className={`hrl-stat${onClick ? ' hrl-stat--clic' : ''}`}
      style={{ '--sev': color, '--sev-texto': SEVERIDAD_TEXTO[severity] ?? SEVERIDAD_TEXTO.neutral, '--delay': `${delay}ms`, '--pct': `${pct}%` }}
      onClick={onClick}
      aria-label={onClick ? `${label}: ${value}` : undefined}
    >
      <div className="hrl-stat__top">
        {info ? (
          <Tooltip title={label} body={info} focusable={!onClick}>
            <span className="hrl-stat__label hrl-stat__label--info">
              {label}
              <Icon name="sh-info" size={14} />
            </span>
          </Tooltip>
        ) : (
          <span className="hrl-stat__label">{label}</span>
        )}
        {AVISA.has(severity) && (
          <span className="hrl-stat__icon">
            <Icon name={ICONO[severity]} size={18} />
          </span>
        )}
      </div>
      <strong className="hrl-stat__value">{value}</strong>
      {conBarra && (
        <div className="hrl-stat__track">
          <span className="hrl-stat__bar" />
        </div>
      )}
      {note && <span className="hrl-stat__note">{note}</span>}
    </Etiqueta>
  );
}
