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

/* La tendencia junto a la cifra: barras pequeñas de los últimos periodos, la
   del periodo de la cifra en el color de la acción y las anteriores en gris.
   Un periodo sin dato (`value: null`) no se dibuja como cero: queda su hueco,
   marcado con un trazo punteado en la base. Se lee entera en su tooltip
   («Mayo 1 234 · Junio 1 302 · …»), así que la forma no es la única señal.

     trend  { points: { label, value, title? }[], label?, format? }
            `label` nombra la serie («Últimos 6 meses»); `format` escribe cada
            valor en el tooltip (por defecto, con separador de miles). La última
            barra es la del periodo de la cifra. */
const ANCHO_TENDENCIA = 104;
const ALTO_TENDENCIA = 40;

function Tendencia({ trend }) {
  const puntos = trend.points ?? [];
  if (puntos.length < 2) return null;
  const valores = puntos.map((p) => p.value).filter((v) => typeof v === 'number');
  const maximo = Math.max(...valores, 0);
  const formato = trend.format ?? ((v) => v.toLocaleString('es-PE'));
  const hueco = 3;
  const ancho = (ANCHO_TENDENCIA - hueco * (puntos.length - 1)) / puntos.length;
  const detalle = puntos.map((p) => `${p.title ?? p.label} ${p.value == null ? 'sin dato' : formato(p.value)}`).join(' · ');
  /* Solo se rotulan el primer y el último periodo: seis rótulos no caben bajo
     barras de 15 px a un tamaño legible. Los demás se leen en el tooltip. */
  const rotulo = (p, i, actual) =>
    i === 0 || actual ? (
      <text
        className={`hrl-stat__tendencia-mes${actual ? ' hrl-stat__tendencia-mes--actual' : ''}`}
        x={actual ? ANCHO_TENDENCIA : 0}
        y={ALTO_TENDENCIA + 13}
        textAnchor={actual ? 'end' : 'start'}
      >
        {p.label}
      </text>
    ) : null;

  return (
    <Tooltip title={trend.label ?? 'Tendencia'} body={detalle} focusable={false}>
      <svg
        className="hrl-stat__tendencia"
        width={ANCHO_TENDENCIA}
        height={ALTO_TENDENCIA + 14}
        viewBox={`0 0 ${ANCHO_TENDENCIA} ${ALTO_TENDENCIA + 14}`}
        role="img"
        aria-label={`${trend.label ?? 'Tendencia'}: ${detalle}`}
      >
        {puntos.map((p, i) => {
          const x = i * (ancho + hueco);
          const actual = i === puntos.length - 1;
          if (p.value == null || maximo === 0) {
            return (
              <g key={p.label + i}>
                <line className="hrl-stat__tendencia-hueco" x1={x} x2={x + ancho} y1={ALTO_TENDENCIA - 1} y2={ALTO_TENDENCIA - 1} />
                {rotulo(p, i, actual)}
              </g>
            );
          }
          const alto = Math.max(3, (p.value / maximo) * (ALTO_TENDENCIA - 2));
          return (
            <g key={p.label + i}>
              <rect
                className={`hrl-stat__tendencia-barra${actual ? ' hrl-stat__tendencia-barra--actual' : ''}`}
                x={x}
                y={ALTO_TENDENCIA - alto}
                width={ancho}
                height={alto}
                rx={Math.min(4, ancho / 2)}
                style={{ animationDelay: `${i * 40}ms` }}
              />
              {rotulo(p, i, actual)}
            </g>
          );
        })}
      </svg>
    </Tooltip>
  );
}

export function StatCard({ label = 'Métrica', value = '—', note, severity = 'neutral', percent, delay = 0, info, onClick, trend }) {
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
      {trend ? (
        <div className="hrl-stat__cuerpo">
          <strong className="hrl-stat__value">{value}</strong>
          <Tendencia trend={trend} />
        </div>
      ) : (
        <strong className="hrl-stat__value">{value}</strong>
      )}
      {conBarra && (
        <div className="hrl-stat__track">
          <span className="hrl-stat__bar" />
        </div>
      )}
      {note && <span className="hrl-stat__note">{note}</span>}
    </Etiqueta>
  );
}
