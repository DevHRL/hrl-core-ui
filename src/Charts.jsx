/* Gráficos del handoff, en SVG y sin librerías: el proyecto no tiene ninguna
   de charts y estas tres formas son sencillas de dibujar a mano. */

import { useEffect, useRef, useState } from 'react';
import { useFloatingTip } from './useFloatingTip.js';
import { FloatingTip } from './Tooltip.jsx';
import { cx } from './variants.js';

const R = 80;
const LARGO = Math.PI * R; // longitud del semicírculo, ~251.3

/* Arco semicircular. `value` es null cuando no hay denominador: entonces no se
   dibuja progreso y se rotula «Sin datos», nunca 0%. */
export function GaugeArc({ value, color, label }) {
  const hayDato = typeof value === 'number' && Number.isFinite(value);
  const pct = hayDato ? Math.max(0, Math.min(100, value)) : 0;
  const offset = LARGO - (LARGO * pct) / 100;

  return (
    <div className="hrl-gauge">
      <svg viewBox="0 0 200 112" role="img" aria-label={label ?? `${pct}%`}>
        <path d={`M 20 100 A ${R} ${R} 0 0 1 180 100`} fill="none" stroke="rgba(145,158,171,0.24)" strokeWidth="14" strokeLinecap="round" />
        {hayDato && (
          <path
            d={`M 20 100 A ${R} ${R} 0 0 1 180 100`}
            fill="none"
            /* Por `style` y no por atributo: un atributo SVG no resuelve
               `var(--token)`, así el color puede venir del kit o en crudo. */
            style={{ stroke: color }}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={LARGO}
            strokeDashoffset={offset}
            className="hrl-gauge__arco"
          />
        )}
      </svg>
      <span className={`hrl-gauge__valor${hayDato ? '' : ' hrl-gauge__valor--sin-dato'}`} style={{ color: hayDato ? undefined : 'var(--text-disabled)' }}>
        {hayDato ? `${Number(value.toFixed(2))}%` : 'Sin datos'}
      </span>
    </div>
  );
}

/* Barras finas de tendencia. La opacidad crece con el índice para que se lea
   la dirección del tiempo sin necesidad de eje. */
export function Sparkline({ values, color, height = 30 }) {
  const max = Math.max(1, ...values);

  return (
    <span className="hrl-spark" style={{ height: height }}>
      {values.map((v, i) => (
        <span
          key={i}
          className="hrl-spark__barra"
          style={{
            height: `${Math.max(8, (v / max) * 100)}%`,
            background: color,
            opacity: 0.35 + (0.65 * (i + 1)) / values.length,
          }}
        />
      ))}
    </span>
  );
}

/* Barras apiladas por mes. Los meses sin datos no se dibujan: se agrupan a la
   derecha en un bloque rotulado, como pide el handoff (nunca barras en cero
   que se confundan con «no hubo atenciones»).

   Cada tramo se anima y se resalta por separado, y lleva su propio tooltip con
   el value, el peso sobre el mes y el total del mes: en una barra apilada el
   dato de un tramo fino es ilegible de otra forma. `unit` nombra lo que se
   cuenta (personas, atenciones, sesiones…), porque el mismo gráfico se usa
   para cosas distintas en cada módulo. */
export function StackedBars({ labels, series, height = 260, emptyLabel, unit = 'registros' }) {
  const { tip, follow, hide } = useFloatingTip();

  const totales = labels.map((_, i) => series.reduce((s, serie) => s + (serie.values[i] ?? 0), 0));
  const max = Math.max(1, ...totales);
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  const compacto = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n));
  const cifra = (n) => n.toLocaleString('es-PE');

  return (
    <div className="hrl-barras">
      <div className="hrl-barras__eje">
        {[...marcas].reverse().map((m) => (
          <span key={m}>{compacto(m)}</span>
        ))}
      </div>

      <div className="hrl-barras__lienzo" style={{ height: height }}>
        {labels.map((mes, i) => (
          <div
            className="hrl-barras__col"
            key={mes}
            role="img"
            aria-label={`${mes}: ${cifra(totales[i])} ${unit}`}
          >
            <div className="hrl-barras__pila">
              {series.map((serie, j) => {
                const v = serie.values[i] ?? 0;
                if (v <= 0) return null;

                const total = totales[i];
                const parte = total ? (v / total) * 100 : 0;
                const titulo = series.length > 1 ? `${serie.name} · ${mes}` : `${mes}`;
                const cuerpo =
                  series.length > 1
                    ? `${cifra(v)} ${unit} · ${parte.toFixed(parte < 10 ? 1 : 0)}% de las ${cifra(total)} del mes`
                    : `${cifra(v)} ${unit}`;

                return (
                  <span
                    key={serie.name}
                    className="hrl-barras__tramo"
                    /* El retardo encadena las columnas de izquierda a derecha y,
                       dentro de cada una, los tramos de abajo arriba. */
                    style={{
                      height: `${(v / max) * 100}%`,
                      background: serie.color,
                      '--retardo': `${i * 55 + j * 40}ms`,
                    }}
                    onMouseEnter={(e) => follow(e, titulo, cuerpo)}
                    onMouseMove={(e) => follow(e, titulo, cuerpo)}
                    onMouseLeave={hide}
                  />
                );
              })}
            </div>
            <span className="hrl-barras__etiqueta">{mes}</span>
          </div>
        ))}

        {emptyLabel && (
          <div className="hrl-barras__col hrl-barras__col--vacia">
            <div className="hrl-barras__vacio">{emptyLabel}</div>
            <span className="hrl-barras__etiqueta">—</span>
          </div>
        )}
      </div>

      <FloatingTip tip={tip} />
    </div>
  );
}

/* Serie de una sola medida a lo largo de periodos: barras de un solo color, sin
   leyenda —el título del gráfico ya dice qué se mide—.

   Un periodo sin dato **no es una barra en cero**:
   · si queda en medio de la serie, se dibuja un hueco punteado rotulado;
   · si está al final, la serie se recorta en el último periodo con dato y lo
     que sobra se agrupa en un bloque rotulado (`emptyTail`).

   Solo el último valor lleva su cifra encima; los demás la tienen en el
   tooltip. Un número sobre cada barra compite con las propias barras.

     points: { key?, label, title?, value: number | null, detail? }[]

   Etiquetas a ancho de teléfono (1.11.0-redesign.8): si los meses no caben bajo sus
   barras, se muestra uno de cada dos (o de cada tres…), siempre el último, y los
   demás dejan su sitio vacío. Cada barra sigue diciendo su mes en el tooltip y en su
   `aria-label`. Antes se montaban unos sobre otros («EneFebMar…»). */
const SEPARACION_ETIQUETAS = 6;

/* Cada cuántas columnas cabe una etiqueta: el ancho de la más larga contra el de
   una columna. Se mide con el lienzo ya dibujado y se vuelve a medir al cambiar su
   ancho. `useEffect` y no `useLayoutEffect`: el kit también se pinta en el servidor. */
function usePasoDeEtiquetas(lienzo, columnas) {
  const [paso, setPaso] = useState(1);
  useEffect(() => {
    const el = lienzo.current;
    if (!el || columnas < 2 || typeof ResizeObserver === 'undefined') return undefined;
    const medir = () => {
      const etiquetas = [...el.querySelectorAll('.hrl-barras__col--serie .hrl-barras__etiqueta')];
      if (!etiquetas.length) return;
      const recorte = el.querySelector('.hrl-barras__col--recorte')?.offsetWidth ?? 0;
      const columna = Math.max(1, (el.clientWidth - recorte) / columnas);
      const masAncha = Math.max(...etiquetas.map((e) => e.scrollWidth)) + SEPARACION_ETIQUETAS;
      setPaso(Math.max(1, Math.ceil(masAncha / columna)));
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [lienzo, columnas]);
  return paso;
}

export function SeriesBars({
  points = [],
  color = 'var(--primary)',
  unit = '',
  height = 220,
  format = (n) => n.toLocaleString('es-PE'),
  noDataLabel = 'Sin dato',
  emptyTail,
  label,
}) {
  const { tip, follow, hide } = useFloatingTip();
  const lienzo = useRef(null);

  let fin = points.length;
  while (fin > 0 && points[fin - 1].value == null) fin -= 1;
  const visibles = points.slice(0, fin);
  const recortados = points.slice(fin);
  const paso = usePasoDeEtiquetas(lienzo, visibles.length);

  const max = Math.max(1, ...visibles.filter((p) => p.value != null).map((p) => p.value));
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const compacto = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n));

  return (
    <div className="hrl-barras" role="group" aria-label={label}>
      <div className="hrl-barras__eje" style={{ paddingTop: 18 }}>
        {[...marcas].reverse().map((m, i) => (
          <span key={`${m}-${i}`}>{compacto(m)}</span>
        ))}
      </div>

      <div className="hrl-barras__lienzo" style={{ height }} ref={lienzo}>
        {visibles.map((p, i) => {
          const sinDato = p.value == null;
          const conEtiqueta = (visibles.length - 1 - i) % paso === 0;
          const titulo = p.title ?? p.label;
          const cuerpo = sinDato
            ? (p.detail ?? noDataLabel)
            : `${format(p.value)}${unit ? ` ${unit}` : ''}${p.detail ? ` · ${p.detail}` : ''}`;

          return (
            <div
              key={p.key ?? p.label}
              className="hrl-barras__col hrl-barras__col--serie"
              role="img"
              aria-label={`${titulo}: ${cuerpo}`}
              onMouseEnter={(e) => follow(e, titulo, cuerpo)}
              onMouseMove={(e) => follow(e, titulo, cuerpo)}
              onMouseLeave={hide}
            >
              <span className="hrl-barras__valor">{!sinDato && i === visibles.length - 1 ? format(p.value) : ''}</span>
              {sinDato ? (
                <span className="hrl-barras__hueco">
                  <span>{noDataLabel}</span>
                </span>
              ) : (
                <span className="hrl-barras__pila">
                  <span
                    className="hrl-barras__tramo"
                    style={{ height: `${(p.value / max) * 100}%`, background: color, '--retardo': `${i * 55}ms` }}
                  />
                </span>
              )}
              <span className={cx('hrl-barras__etiqueta', !conEtiqueta && 'hrl-barras__etiqueta--oculta')} aria-hidden={!conEtiqueta || undefined}>
                {p.label}
              </span>
            </div>
          );
        })}

        {recortados.length > 0 && emptyTail && (
          <div className="hrl-barras__col hrl-barras__col--recorte">
            <span className="hrl-barras__valor" />
            <span className="hrl-barras__vacio">{emptyTail}</span>
            <span className="hrl-barras__etiqueta">{recortados.map((p) => p.label).join(' · ')}</span>
          </div>
        )}
      </div>

      <FloatingTip tip={tip} />
    </div>
  );
}

/* Embudo de etapas: cada una con su total, su peso sobre la primera y la
   conversión hacia la siguiente. */
export function Funnel({ stages }) {
  const base = stages[0]?.value || 0;

  return (
    <div className="hrl-embudo">
      {stages.map((e, i) => {
        const pctBase = base ? (e.value / base) * 100 : 0;
        const previa = i > 0 ? stages[i - 1].value : null;
        const conversion = previa ? (e.value / previa) * 100 : null;

        /* Por encima del 100% la etapa tiene más personas que la anterior, así
           que no puede leerse como conversión: se marca en vez de disimularlo
           con un porcentaje que invita a conclusiones falsas. */
        const excede = conversion != null && conversion > 100;

        return (
          <div className="hrl-embudo__par" key={e.name}>
            {i > 0 && (
              <div className="hrl-embudo__flecha" title={excede ? 'Esta etapa tiene más personas que la anterior: no es una conversión.' : undefined}>
                <span>→</span>
                {conversion == null ? (
                  <strong>—</strong>
                ) : excede ? (
                  <strong style={{ color: 'var(--warning-text)' }}>no aplica</strong>
                ) : (
                  <strong>{conversion.toFixed(1)}%</strong>
                )}
              </div>
            )}
            <article className="hrl-embudo__etapa" style={{ '--delay': `${i * 60}ms` }}>
              <span className="hrl-embudo__rotulo">Etapa {i + 1}</span>
              <span className="hrl-embudo__nombre">{e.name}</span>
              <strong className="hrl-embudo__valor">{e.value.toLocaleString('es-PE')}</strong>
              <span className="hrl-reparto">
                <span className="hrl-reparto__relleno" style={{ width: `${pctBase}%`, background: e.color }} />
              </span>
              <span className="hrl-embudo__nota">
                {base ? `${pctBase.toFixed(pctBase < 10 ? 1 : 0)}% del total de la etapa 1` : 'Sin datos'}
              </span>
            </article>
          </div>
        );
      })}
    </div>
  );
}

/* Ranking horizontal. Cada fila lleva su muestra de color, su nombre y su cifra. */
export function Ranking({ rows, format = (n) => n.toLocaleString('es-PE') }) {
  const max = Math.max(1, ...rows.map((f) => f.value));

  return (
    <div className="hrl-ranking">
      {rows.map((f, i) => (
        <div className="hrl-ranking__fila" key={f.name} style={{ '--delay': `${i * 40}ms` }}>
          <div className="hrl-ranking__alto">
            <span className="hrl-ranking__nombre">
              <span className="hrl-leyenda-series__punto" style={{ background: f.color }} />
              {f.name}
            </span>
            {/* La cifra va en tinta de texto: el color identifica la barra, y
                un número coloreado pierde contraste. */}
            <strong className="hrl-ranking__valor">
              {format(f.value)}
            </strong>
          </div>
          <span className="hrl-reparto">
            <span className="hrl-reparto__relleno" style={{ width: `${(f.value / max) * 100}%`, background: f.color }} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* Barra horizontal simple para repartos de dos o tres categorías. */
export function SplitBar({ value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <span className="hrl-reparto">
      <span className="hrl-reparto__relleno" style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}
