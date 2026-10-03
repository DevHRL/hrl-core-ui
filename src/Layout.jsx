import { useLayoutEffect, useRef } from 'react';
import { cx } from './variants.js';

/* Primitivas de maquetación. Existen para que una pantalla no tenga que escribir
   `style={{ display: 'flex', gap: '1rem' }}`: en la primera migración completa a
   un proyecto real quedaron 67 estilos en línea de este tipo, cada uno con su
   propia separación. Aquí la separación sale de la escala `--space-1…6`.

   Stack   una fila o una columna con separación fija entre sus hijos
     direction  column (por defecto) | row
     gap        1…6 (4, 8, 12, 16, 24, 32 px); por defecto 4
     align      start | center | end | stretch | baseline
     justify    start | center | end | between
     wrap       en fila, permite pasar a otra línea
     as         etiqueta que se dibuja (div por defecto)

   Grid    una rejilla que reparte el ancho sin escribir columnas
     min        ancho mínimo de cada celda en px (240 por defecto): cuantas quepan
     columns    número fijo de columnas; si se da, `min` no se usa
     gap        1…6, por defecto 4

   Mosaic  las secciones de una página, acomodadas solas por su forma
     min        ancho mínimo de una columna en px (420 por defecto)
     gap        1…6, por defecto 4
     Una tarjeta corta (Card sin contenido ancho) comparte fila con las tarjetas
     cortas que la rodean; una que trae algo ancho (tabla, calendario, pasos,
     tira de selección, otra rejilla) o `wide`, y todo lo que
     no es una tarjeta (un aviso, un párrafo, una fila de cifras), ocupan la fila
     entera. Si una fila de tarjetas cortas queda incompleta, las que quedan se
     estiran para llenarla: nunca queda un hueco al lado de una tarjeta. */

const ALINEACION = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' };
const REPARTO = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' };

export function Stack({
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  as: Etiqueta = 'div',
  className,
  style,
  children,
  ...rest
}) {
  return (
    <Etiqueta
      className={cx('hrl-stack', direction === 'row' && 'hrl-stack--fila', wrap && 'hrl-stack--envuelta', className)}
      style={{
        '--hrl-gap': `var(--space-${gap})`,
        alignItems: ALINEACION[align],
        justifyContent: REPARTO[justify],
        ...style,
      }}
      {...rest}
    >
      {children}
    </Etiqueta>
  );
}

export function Grid({
  min = 240,
  columns,
  gap = 4,
  as: Etiqueta = 'div',
  className,
  style,
  children,
  ...rest
}) {
  const columnas = columns
    ? `repeat(${columns}, minmax(0, 1fr))`
    : `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`;
  return (
    <Etiqueta
      className={cx('hrl-grid', className)}
      style={{ '--hrl-gap': `var(--space-${gap})`, gridTemplateColumns: columnas, ...style }}
      {...rest}
    >
      {children}
    </Etiqueta>
  );
}

/* Lo que hace ancha a una tarjeta: contenido del kit que necesita la fila entera. */
/* Los gráficos de barras no cuentan: a media pantalla (más de 400 px) se leen
   bien, y dos gráficos lado a lado son justo lo que un tablero quiere. */
const ANCHO = '.hrl-table-wrap, .hrl-table, .hrl-cal, .hrl-pasos, .hrl-trayecto, .hrl-tira, .hrl-grid, .hrl-mosaico';

const esCorta = (el) => el.classList.contains('hrl-section') && !el.classList.contains('hrl-section--ancha') && !el.querySelector(ANCHO);

/* Reparte las columnas: corridas de tarjetas cortas en filas de `columnas`; la
   última fila de cada corrida, si queda incompleta, se reparte el ancho. Se
   escribe como variable CSS (--hrl-mosaico-span), no como estilo de React: el
   contenido de los hijos lo controla la aplicación. */
function acomodar(contenedor) {
  const columnas = getComputedStyle(contenedor).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
  const hijos = [...contenedor.children];
  let corrida = [];
  const cerrar = () => {
    const resto = corrida.length % columnas;
    corrida.forEach((el, i) => {
      const enUltimaFila = resto && i >= corrida.length - resto;
      if (columnas === 1 || corrida.length === 1) el.style.removeProperty('--hrl-mosaico-span');
      else if (!enUltimaFila) el.style.setProperty('--hrl-mosaico-span', '1');
      else {
        const k = i - (corrida.length - resto);
        const base = Math.floor(columnas / resto);
        el.style.setProperty('--hrl-mosaico-span', String(k === resto - 1 ? columnas - base * (resto - 1) : base));
      }
      el.toggleAttribute('data-mosaico', columnas > 1 && corrida.length > 1);
    });
    corrida = [];
  };
  for (const el of hijos) {
    if (esCorta(el)) corrida.push(el);
    else {
      cerrar();
      el.style.removeProperty('--hrl-mosaico-span');
      el.removeAttribute('data-mosaico');
    }
  }
  cerrar();
}

export function Mosaic({ min = 420, gap = 4, as: Etiqueta = 'div', className, style, children, ...rest }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let pendiente = 0;
    const programar = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(() => acomodar(el));
    };
    acomodar(el);
    const ro = new ResizeObserver(programar);
    ro.observe(el);
    /* El contenido cambia sin que cambie el mosaico: una tabla que llega, un
       paso que se abre. */
    const mo = new MutationObserver(programar);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(pendiente);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <Etiqueta
      ref={ref}
      className={cx('hrl-mosaico', className)}
      style={{ '--hrl-gap': `var(--space-${gap})`, '--hrl-mosaico-min': `${min}px`, ...style }}
      {...rest}
    >
      {children}
    </Etiqueta>
  );
}
