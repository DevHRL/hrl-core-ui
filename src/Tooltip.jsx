import { useState } from 'react';
import { createPortal } from 'react-dom';
import { anchoVisible } from './viewport.js';

const MARGEN = 12;
const ANCHO_MAX = 320;
/* `.hrl-tip` es content-box: su ancho total es el del contenido más el relleno
   horizontal (2 × 18 px). Hay que contarlo para saber si cabe. */
const RELLENO = 36;
const ANCHO_TOTAL = ANCHO_MAX + RELLENO;
/* Distancia horizontal entre el punto de anclaje y el tooltip. Con el cursor
   son 20 px: es lo que libra la silueta del puntero (una flecha de ~12 px, una
   mano de ~16) para que nunca quede debajo del tooltip. Al anclar a un
   elemento por teclado no hay puntero y basta con 8. */
const SEPARACION = 20;
const SEPARACION_ELEMENTO = 8;
/* No se mide el DOM real antes de posicionar: este tooltip compartido se
   reubica en cada mousemove sobre superficies con miles de celdas (la matriz
   de producción), y medir ahí saldría caro. Esta altura es una cota amplia
   para acotar el tooltip verticalmente, no la altura exacta de cada uno. */
const ALTO_RESERVA = 150;

/* El tooltip sale al COSTADO del punto de anclaje, centrado en vertical: a la
   derecha si cabe su ancho máximo y, si no, a la izquierda. Nunca arriba ni
   abajo: ahí quedaba a un palmo del puntero y, al voltearse cerca de un borde,
   lo tapaba.

   Se ancla siempre por `left`; del lado izquierdo la clase `hrl-tip--izquierda`
   lo desplaza su propio ancho con `translateX(-100%)`. El ancho no depende del
   espacio disponible (`width: max-content` en el CSS) y se le da un `max-width`
   propio: un elemento fijo se ajusta al espacio que le queda hasta el borde, y
   pegado a él salía angosto y alto.

   El espacio se mide con anchoVisible(), no con innerWidth (ver viewport.js). */
function ubicar(x, y, separacion) {
  const ancho = anchoVisible();
  const espacioDerecha = ancho - x - separacion - MARGEN;
  const espacioIzquierda = x - separacion - MARGEN;
  const izquierda = espacioDerecha < ANCHO_TOTAL && espacioIzquierda > espacioDerecha;
  const espacio = izquierda ? espacioIzquierda : espacioDerecha;

  const mitad = ALTO_RESERVA / 2 + MARGEN;
  const top = Math.min(Math.max(y, mitad), window.innerHeight - mitad);

  return {
    izquierda,
    estilo: {
      top,
      maxWidth: Math.max(Math.min(ANCHO_MAX, espacio - RELLENO), 120),
      left: izquierda ? x - separacion : x + separacion,
    },
  };
}

/* Capa flotante del tooltip. Una sola instancia alimentada con
   {title, body, x, y, gap?}: en la matriz de producción hay más de mil celdas y
   montar un componente por celda sería inviable. `gap` sustituye a la
   separación por defecto (ver SEPARACION_ELEMENTO). */
export function FloatingTip({ tip }) {
  if (!tip) return null;
  const { izquierda, estilo } = ubicar(tip.x, tip.y, tip.gap ?? SEPARACION);

  return createPortal(
    <div className={`hrl-portal hrl-tip${izquierda ? ' hrl-tip--izquierda' : ''}`} style={estilo} role="tooltip">
      {tip.title && <strong className="hrl-tip__title">{tip.title}</strong>}
      {tip.body}
    </div>,
    document.body,
  );
}

/* Envoltorio para objetivos puntuales. Sigue al cursor mientras esté encima y
   se cierra al salir.

   `focusable` en false cuando el contenido ya es focusable (un botón, un
   select): así no se crea un segundo punto de tabulación. El tooltip sigue
   apareciendo al enfocar, porque el evento focus burbujea hasta aquí.

   `style` se mezcla con el del envoltorio, para los casos en los que el
   objetivo ocupa toda una fila y el `inline-flex` por defecto lo encogería. */
export function Tooltip({ title, body, children, as: Etiqueta = 'span', focusable = true, style }) {
  const [pos, setPos] = useState(null);

  const mover = (e) => setPos({ x: e.clientX, y: e.clientY });

  const alEnfocar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.right, y: r.top + r.height / 2, gap: SEPARACION_ELEMENTO });
  };

  return (
    <>
      <Etiqueta
        className={focusable ? 'hrl-tip-objetivo' : undefined}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%', ...style }}
        onMouseEnter={mover}
        onMouseMove={mover}
        onMouseLeave={() => setPos(null)}
        onFocus={alEnfocar}
        onBlur={() => setPos(null)}
        tabIndex={focusable ? 0 : undefined}
      >
        {children}
      </Etiqueta>

      <FloatingTip tip={pos ? { title, body, ...pos } : null} />
    </>
  );
}
