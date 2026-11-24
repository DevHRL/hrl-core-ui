import { useRef } from 'react';
import { Icon } from './icons.jsx';
import { Tooltip, FloatingTip } from './Tooltip.jsx';
import { useFloatingTip } from './useFloatingTip.js';

/* Calendario de un mes, con la semana empezando en lunes.

   Existe para el registro diario: elegir un día en una cuadrícula con forma de
   calendario se lee de un vistazo —qué semanas faltan, qué fines de semana
   quedaron en blanco—, cosa que una fila de treinta y un números no permite.

   El kit no sabe qué se registra cada día. Quien lo usa dice, para cada día,
   su estado ('full' | 'partial' | 'empty'), un detalle corto que se pinta
   dentro de la casilla y una descripción para el tooltip.

   Se recorre con el teclado: flechas para moverse un día o una semana, Inicio
   y Fin para ir al primer o al último día. Solo la casilla elegida es
   tabulable, así que el calendario entero es un único punto de tabulación. */

const SEMANA = [
  { corto: 'Lun', largo: 'Lunes' },
  { corto: 'Mar', largo: 'Martes' },
  { corto: 'Mié', largo: 'Miércoles' },
  { corto: 'Jue', largo: 'Jueves' },
  { corto: 'Vie', largo: 'Viernes' },
  { corto: 'Sáb', largo: 'Sábado' },
  { corto: 'Dom', largo: 'Domingo' },
];

const MARCAS = {
  full: { clase: ' hrl-cal__dia--lleno', icono: 'sh-check', texto: 'Completo' },
  partial: { clase: ' hrl-cal__dia--parcial', icono: 'sh-clock', texto: 'Incompleto' },
  empty: { clase: '', icono: null, texto: 'Sin registrar' },
};

export function Calendar({
  year,
  month,
  selected,
  onSelect,
  statusOf = () => 'empty',
  detailOf,
  descriptionOf,
  label = 'Calendario del mes',
  legend = true,
}) {
  const refs = useRef({});
  const { tip, follow, hide } = useFloatingTip();

  /* Horas UTC: el día de la semana es del calendario, no de la zona horaria
     de quien mira. */
  const totalDias = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const desfase = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const dias = Array.from({ length: totalDias }, (_, i) => i + 1);

  const conteo = { full: 0, partial: 0, empty: 0 };
  for (const d of dias) conteo[statusOf(d) ?? 'empty'] += 1;

  const ir = (dia) => {
    const destino = Math.min(totalDias, Math.max(1, dia));
    onSelect?.(destino);
    requestAnimationFrame(() => refs.current[destino]?.focus());
  };

  const alTeclear = (e, dia) => {
    const pasos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in pasos) {
      e.preventDefault();
      ir(dia + pasos[e.key]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      ir(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      ir(totalDias);
    }
  };

  /* Las celdas en semanas de siete: los huecos antes del día 1 y los días del mes. */
  const celdas = [...Array.from({ length: desfase }, (_, i) => ({ hueco: i })), ...dias.map((d) => ({ dia: d }))];
  const semanas = Array.from({ length: Math.ceil(celdas.length / 7) }, (_, i) => celdas.slice(i * 7, i * 7 + 7));

  const diaDe = (d) => {
    const estado = statusOf(d) ?? 'empty';
    const marca = MARCAS[estado] ?? MARCAS.empty;
    const indice = (desfase + d - 1) % 7;
    const nombre = `${SEMANA[indice].largo} ${d}`;
    const detalle = detailOf?.(d);
    const descripcion = descriptionOf?.(d) ?? marca.texto;
    const elegido = d === selected;

    return (
      <button
        key={d}
        ref={(n) => {
          refs.current[d] = n;
        }}
        type="button"
        role="gridcell"
        aria-selected={elegido}
        aria-label={`${nombre}. ${marca.texto}.${detalle ? ` ${detalle}.` : ''}`}
        tabIndex={elegido ? 0 : -1}
        className={`hrl-cal__dia${marca.clase}${elegido ? ' hrl-cal__dia--on' : ''}${indice >= 5 ? ' hrl-cal__dia--finde' : ''}`}
        onClick={() => onSelect?.(d)}
        onKeyDown={(e) => alTeclear(e, d)}
        onMouseEnter={(e) => follow(e, nombre, descripcion)}
        onMouseMove={(e) => follow(e, nombre, descripcion)}
        onMouseLeave={hide}
      >
        <span className="hrl-cal__num">{d}</span>
        {marca.icono && (
          <span className="hrl-cal__marca">
            <Icon name={marca.icono} size={12} />
          </span>
        )}
        {detalle && <span className="hrl-cal__detalle">{detalle}</span>}
      </button>
    );
  };

  return (
    <div className="hrl-cal">
      <div className="hrl-cal__semana" aria-hidden="true">
        {SEMANA.map((s) => (
          <Tooltip
            key={s.corto}
            title={s.largo}
            body={`Columna de los ${s.largo.toLowerCase()} del mes.`}
            focusable={false}
            style={{ justifyContent: 'center' }}
          >
            <span className="hrl-cal__cabecera">{s.corto}</span>
          </Tooltip>
        ))}
      </div>

      {/* Una fila por semana (`role="row"`): una rejilla sin filas no se recorre como
          tabla en un lector de pantalla (axe, aria-required-children/-parent;
          1.11.0-redesign.9). Las filas no ocupan sitio (`display: contents`): la
          rejilla de siete columnas se ve igual. */}
      <div className="hrl-cal__rejilla" role="grid" aria-label={label}>
        {semanas.map((semana, s) => (
          <div key={`semana-${s}`} role="row" className="hrl-cal__fila">
            {semana.map((celda) => (celda.hueco != null ? <span key={`hueco-${celda.hueco}`} className="hrl-cal__hueco" aria-hidden="true" /> : diaDe(celda.dia)))}
          </div>
        ))}
      </div>

      {legend && (
        <div className="hrl-cal__leyenda">
          <span className="hrl-cal__muestra">
            <span className="hrl-cal__cuadro hrl-cal__cuadro--lleno" />
            <Icon name="sh-check" size={12} />
            Completo · {conteo.full}
          </span>
          <span className="hrl-cal__muestra">
            <span className="hrl-cal__cuadro hrl-cal__cuadro--parcial" />
            <Icon name="sh-clock" size={12} />
            Incompleto · {conteo.partial}
          </span>
          <span className="hrl-cal__muestra">
            <span className="hrl-cal__cuadro" />
            Sin registrar · {conteo.empty}
          </span>
        </div>
      )}

      <FloatingTip tip={tip} />
    </div>
  );
}
