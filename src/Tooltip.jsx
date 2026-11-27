import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons.jsx';
import { anchoVisible } from './viewport.js';
import { msDelToken } from './tiempos.js';
import { useMountedWhile } from './useExitAnimation.js';

/* Tres burbujas, cada una con su trabajo (2.0.0):

     Tooltip   la explicación breve de algo que no es un control (una cifra, un
               dibujo). Oscura, anclada al elemento y no al cursor. Sobre un
               botón no sale (27/11/2026): ver Tooltip, más abajo.
     InfoTip   la explicación de una cifra, una abreviatura o una columna, detrás
               de un ⓘ visible. Oscura como la etiqueta: es el sistema hablando de
               la interfaz. Se abre también al tocarla, porque en un teléfono no
               hay ratón que pase por encima.
     DataTip   la lectura de un punto de un gráfico: rótulo, cifra y contexto. Es
               blanca, del mismo material que la tarjeta: es más dato, no una
               nota sobre el dato.

   Antes había una sola burbuja grande (320 px, título y cuerpo) que seguía al
   cursor y salía al instante sobre cualquier texto: tapaba lo que se estaba
   leyendo. Ahora la explicación está donde alguien la pide (el ⓘ), y lo que se
   pasa de camino no abre nada hasta que el puntero se queda quieto un momento
   (`--delay-tip`).

   FloatingTip sigue siendo la burbuja que acompaña al cursor en las superficies
   con miles de celdas (la matriz de producción): ahí no se puede montar un
   componente por celda ni medir el DOM en cada movimiento. */

const MARGEN = 12;
/* Entre el elemento y la burbuja: lo justo para que la flecha no lo toque. */
const SEPARACION_ANCLA = 8;
/* La lectura del dato se separa más del punto: el punto mismo y su halo
   (radio de 7 a 9 px) no deben quedar debajo de la tarjeta. */
const SEPARACION_DATO = 14;
/* Cuánto dura la salida de una burbuja. Más corta que la entrada: lo que se
   cierra no debe hacer esperar. */
const SALIDA_MS = 120;
/* Si otra burbuja se cerró hace menos de esto, la siguiente sale sin esperar:
   quien ya está recorriendo los iconos de una barra no debe esperar en cada uno. */
const CALENTAMIENTO_MS = 450;
let ultimoCierre = 0;

/* ------------------------------------------------------------- FloatingTip */

const ANCHO_MAX = 280;
const RELLENO = 24;
const ANCHO_TOTAL = ANCHO_MAX + RELLENO;
/* Con el cursor son 20 px: es lo que libra la silueta del puntero (una flecha
   de ~12 px, una mano de ~16) para que nunca quede debajo del tooltip. */
const SEPARACION = 20;
/* No se mide el DOM real antes de posicionar: este tooltip compartido se
   reubica en cada mousemove sobre superficies con miles de celdas. Esta altura
   es una cota amplia para acotarlo en vertical. */
const ALTO_RESERVA = 120;

/* Al costado del cursor, centrado en vertical: a la derecha si cabe y, si no,
   a la izquierda. El espacio se mide con anchoVisible(), no con innerWidth
   (ver viewport.js). */
function ubicarAlCostado(x, y, separacion) {
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

/* Una sola instancia alimentada con {title, body, x, y, gap?}. */
export function FloatingTip({ tip }) {
  if (!tip) return null;
  const { izquierda, estilo } = ubicarAlCostado(tip.x, tip.y, tip.gap ?? SEPARACION);
  return createPortal(
    <div className={`hrl-portal hrl-tip hrl-tip--cursor${izquierda ? ' hrl-tip--izquierda' : ''}`} style={estilo} role="tooltip">
      {tip.title && <strong className="hrl-tip__title">{tip.title}</strong>}
      {tip.body && <span className="hrl-tip__body">{tip.body}</span>}
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------ burbuja anclada */

/* Encima del ancla y centrada en ella; si no cabe arriba, debajo. Se acota a
   la ventana en horizontal y la flecha sigue apuntando al ancla aunque la
   burbuja se haya corrido para no salirse. Mide su propio tamaño antes de
   pintarse (empieza oculta), así nunca aparece en un sitio y salta a otro. */
function useUbicacionAnclada(caja, ancla, separacion, clave, lado = 'top') {
  const [lugar, setLugar] = useState(null);
  /* Se recalcula por los valores del ancla, no por el objeto: quien la pasa
     suele crear uno nuevo en cada render. `clave` vuelve a medir cuando cambia
     el contenido (y con él, el tamaño) sin que se mueva el ancla. */
  const x = ancla?.x;
  const top = ancla?.top;
  const bottom = ancla?.bottom;
  const right = ancla?.right;
  const hayAncla = Boolean(ancla);
  /* Solo se guarda si cambió: un objeto nuevo con los mismos valores volvería a
     pintar, y ese pintado a medir. */
  const fijar = (nuevo) =>
    setLugar((previo) =>
      previo && previo.left === nuevo.left && previo.top === nuevo.top && previo.flecha === nuevo.flecha && previo.lado === nuevo.lado ? previo : nuevo,
    );
  useLayoutEffect(() => {
    const el = caja.current;
    if (!el || !hayAncla) return;
    const ancho = el.offsetWidth;
    const alto = el.offsetHeight;
    /* A la derecha (el menú plegado): centrada en vertical sobre el elemento. */
    if (lado === 'right' && right != null) {
      const centroY = (top + bottom) / 2;
      fijar({
        left: right + separacion,
        top: Math.min(Math.max(centroY - alto / 2, MARGEN), window.innerHeight - alto - MARGEN),
        flecha: 0,
        lado: 'derecha',
      });
      return;
    }
    const centro = x;
    const left = Math.min(Math.max(centro - ancho / 2, MARGEN), anchoVisible() - ancho - MARGEN);
    const arriba = top - alto - separacion;
    const cabeArriba = arriba >= MARGEN;
    fijar({
      left,
      top: cabeArriba ? arriba : bottom + separacion,
      flecha: Math.min(Math.max(centro - left, 12), ancho - 12),
      lado: cabeArriba ? 'arriba' : 'abajo',
    });
  }, [caja, hayAncla, x, top, bottom, right, separacion, clave, lado]);
  return lugar;
}

function Burbuja({ id, ancla, inmediata, saliendo, title, body, placement }) {
  const caja = useRef(null);
  const lugar = useUbicacionAnclada(caja, ancla, SEPARACION_ANCLA, `${title}|${body}`, placement);
  return createPortal(
    <div
      ref={caja}
      id={id}
      role="tooltip"
      className={[
        'hrl-portal hrl-tip hrl-tip--anclada',
        lugar && `hrl-tip--${lugar.lado}`,
        inmediata && 'hrl-tip--inmediata',
        saliendo && 'hrl-tip--saliendo',
      ].filter(Boolean).join(' ')}
      style={lugar ? { left: lugar.left, top: lugar.top, '--hrl-tip-flecha': `${lugar.flecha}px` } : { left: 0, top: 0, visibility: 'hidden' }}
    >
      {title && <strong className="hrl-tip__title">{title}</strong>}
      {body && <span className="hrl-tip__body">{body}</span>}
    </div>,
    document.body,
  );
}

/* El ancla de una burbuja: el borde superior e inferior del elemento y, en
   horizontal, el punto por donde entró el puntero (acotado al elemento). Así,
   sobre un elemento ancho —una fila, un gráfico pequeño— la burbuja sale cerca
   de donde se está mirando y no en el centro, a un palmo. Por teclado, el centro. */
function anclaDe(elemento, xPuntero) {
  const r = elemento.getBoundingClientRect();
  const x = xPuntero == null ? r.left + r.width / 2 : Math.min(Math.max(xPuntero, r.left), r.right);
  return { x, top: r.top, bottom: r.bottom, right: r.right };
}

/* Estado de apertura compartido por Tooltip e InfoTip: abre, cierra con su
   salida animada y se cierra con Esc.

   Si se cierra antes de que pase la espera (`--delay-tip`), nunca llegó a
   verse: se desmonta sin salida. Animar la salida de algo invisible lo haría
   parpadear, porque la salida parte de la burbuja ya pintada. */
function useBurbuja() {
  const [estado, setEstado] = useState(null);
  const actual = useRef(null);
  actual.current = estado;
  const abiertaDesde = useRef(0);
  const temporizador = useRef(null);
  useEffect(() => () => clearTimeout(temporizador.current), []);

  const abrir = (elemento, xPuntero, sinEspera) => {
    clearTimeout(temporizador.current);
    abiertaDesde.current = Date.now();
    setEstado({
      ancla: anclaDe(elemento, xPuntero),
      inmediata: Boolean(sinEspera) || Date.now() - ultimoCierre < CALENTAMIENTO_MS,
      saliendo: false,
    });
  };

  const cerrar = () => {
    const previo = actual.current;
    if (!previo || previo.saliendo) return;
    const seVio = previo.inmediata || Date.now() - abiertaDesde.current >= msDelToken('--delay-tip', 300);
    if (!seVio) {
      setEstado(null);
      return;
    }
    ultimoCierre = Date.now();
    setEstado({ ...previo, saliendo: true });
    temporizador.current = setTimeout(() => setEstado(null), SALIDA_MS);
  };

  const abierta = Boolean(estado && !estado.saliendo);
  useEffect(() => {
    if (!abierta) return undefined;
    const alTeclear = (e) => {
      if (e.key === 'Escape') cerrar();
    };
    /* Una burbuja anclada no sigue a la página: al desplazarse se cierra, en
       vez de quedarse flotando sobre otra cosa. */
    window.addEventListener('keydown', alTeclear);
    window.addEventListener('scroll', cerrar, true);
    return () => {
      window.removeEventListener('keydown', alTeclear);
      window.removeEventListener('scroll', cerrar, true);
    };
    // `cerrar` lee el estado por la referencia: no hace falta volver a suscribirse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierta]);

  return {
    abierta,
    ancla: estado?.ancla,
    montada: Boolean(estado),
    saliendo: Boolean(estado?.saliendo),
    inmediata: Boolean(estado?.inmediata),
    abrir,
    cerrar,
  };
}

/* El foco que devuelve un cajón o un menú al cerrarse (focus.js) no abre la
   burbuja: no es que alguien haya llegado aquí, es que volvió. */
function esFocoDevuelto(e) {
  if (e.target.hasAttribute?.('data-hrl-foco-devuelto')) {
    e.target.removeAttribute('data-hrl-foco-devuelto');
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------ Tooltip */

/* Lo que se pulsa, se elige o se escribe: sobre esto la burbuja no sale. */
const CONTROL = 'button, a[href], select, input, textarea, [role="button"], [role="switch"], [role="tab"], [role="menuitem"]';

/* ¿Qué envuelve? Un control habilitado se explica solo (su texto, o su
   aria-label si es un icono): una etiqueta oscura en cada botón tapaba lo que
   se estaba mirando a cada paso del puntero (decisión del 27/11/2026). Uno
   deshabilitado sí la conserva: es el único modo de saber por qué no se puede
   pulsar. */
function callaSobre(envoltorio) {
  const control = envoltorio.matches(CONTROL) ? envoltorio : envoltorio.querySelector(CONTROL);
  if (!control) return false;
  return !(control.disabled || control.getAttribute('aria-disabled') === 'true');
}

/* La explicación breve de lo que envuelve. Desde 2.0.0 se ancla al elemento
   (encima, o debajo si no cabe) y no persigue al cursor; al pasar el puntero
   espera `--delay-tip` antes de salir, y por teclado sale al instante.

   Sobre un botón, un enlace o un campo no sale nunca, se haya escrito como se
   haya escrito (callaSobre): la regla vive aquí, en el kit, y no en cada
   pantalla. Solo un control deshabilitado la conserva, para decir por qué.
   Para lo que necesita explicarse (una cifra, una abreviatura), InfoTip.

   `focusable` en false cuando el contenido ya es focusable (un botón, un
   select): así no se crea un segundo punto de tabulación. La burbuja sigue
   saliendo al enfocar, porque el evento focus burbujea hasta aquí.

   `placement` es 'top' (encima, o debajo si no cabe) o 'right' (a la
   derecha, para el menú plegado, donde encima taparía la entrada anterior).

   `style` se mezcla con el del envoltorio, para los casos en los que el
   objetivo ocupa toda una fila y el `inline-flex` por defecto lo encogería. */
export function Tooltip({ title, body, children, as: Etiqueta = 'span', focusable = true, placement = 'top', style }) {
  const id = useId();
  const b = useBurbuja();
  const hayTexto = Boolean(title || body);

  return (
    <>
      <Etiqueta
        className={focusable ? 'hrl-tip-objetivo' : undefined}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%', ...style }}
        onMouseEnter={(e) => hayTexto && !callaSobre(e.currentTarget) && b.abrir(e.currentTarget, e.clientX)}
        onMouseLeave={b.cerrar}
        onFocus={(e) => hayTexto && !callaSobre(e.currentTarget) && !esFocoDevuelto(e) && b.abrir(e.currentTarget, null, true)}
        onBlur={b.cerrar}
        /* Un clic es una acción, no una pregunta: la etiqueta se aparta. */
        onPointerDown={b.cerrar}
        tabIndex={focusable ? 0 : undefined}
        aria-describedby={focusable && b.abierta ? id : undefined}
      >
        {children}
      </Etiqueta>

      {b.montada && hayTexto && (
        <Burbuja id={id} ancla={b.ancla} inmediata={b.inmediata} saliendo={b.saliendo} title={title} body={body} placement={placement} />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ InfoTip */

/* El ⓘ que explica lo que tiene al lado: una cifra, una abreviatura, una
   columna. Es un botón de verdad: se alcanza con Tab, se anuncia por su
   nombre («Qué significa: Tasa de ocupación») y se abre también al tocarlo.

   Con ratón vive lo que dura el puntero encima, se haga clic o no: un clic no
   lo deja fijo (decisión del 26/11/2026; quedarse abierto tras salir era
   justo lo invasivo). Solo al tocarlo con el dedo o un lápiz, donde no hay
   «encima», queda abierto hasta otro toque, un toque fuera o Esc. Por
   teclado, lo que dura el foco.

     label     lo que explica, para su nombre accesible
     title     encabezado opcional de la explicación
     children  la explicación (o `body`)
     size      tamaño del icono (16 por defecto)

   No va dentro de otro botón (una StatCard con onClick): ahí no se puede
   anidar un control, y StatCard ya resuelve ese caso. */
export function InfoTip({ label, title, body, children, size = 16, className }) {
  const id = useId();
  const b = useBurbuja();
  const [fijo, setFijo] = useState(false);
  const raiz = useRef(null);
  const cerrar = useRef(b.cerrar);
  cerrar.current = b.cerrar;
  const contenido = body ?? children;

  useEffect(() => {
    if (!b.abierta) setFijo(false);
  }, [b.abierta]);

  useEffect(() => {
    if (!fijo) return undefined;
    const fuera = (e) => {
      if (!raiz.current?.contains(e.target)) cerrar.current();
    };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [fijo]);

  /* Con qué se pulsó: el clic llega después de pointerdown, que sí lo dice. */
  const puntero = useRef('mouse');

  const alTocar = (e) => {
    if (puntero.current === 'mouse') return;
    if (fijo) {
      b.cerrar();
      return;
    }
    setFijo(true);
    b.abrir(e.currentTarget, null, true);
  };

  return (
    <span ref={raiz} className={['hrl-infotip', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="hrl-infotip__boton"
        aria-label={label ? `Qué significa: ${label}` : 'Más información'}
        aria-expanded={b.abierta}
        aria-describedby={b.abierta ? id : undefined}
        onMouseEnter={(e) => !fijo && b.abrir(e.currentTarget)}
        onMouseLeave={() => !fijo && b.cerrar()}
        onFocus={(e) => !esFocoDevuelto(e) && b.abrir(e.currentTarget, null, true)}
        onBlur={b.cerrar}
        onPointerDown={(e) => {
          puntero.current = e.pointerType || 'mouse';
        }}
        onClick={alTocar}
      >
        <Icon name="sh-info" size={size} />
      </button>
      {b.montada && (
        <Burbuja id={id} ancla={b.ancla} inmediata={b.inmediata} saliendo={b.saliendo} title={title} body={contenido} />
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ DataTip */

/* La lectura de un punto de un gráfico: una tarjeta blanca, encima del punto,
   con tres renglones.

     label   qué es el punto («Junio 2026», «Egresos de Cirugía»), tenue
     value   la cifra, grande («3.8 egresos por cama»)
     detail  el contexto que la hace legible («Meta 4.0, 95 % de la meta»), tenue
     children  lo que no cabe en los tres renglones (una lista corta)
     hint      una pista al pie, tenue («Clic para ampliar»)
     expanded  la lectura ampliada: quien la usa la fija al hacer clic y
               muestra en ella todo lo que la breve calla. Al pasar de una a
               otra la tarjeta vuelve a entrar, para que se note que creció

   Se ubica con `anchor`, en coordenadas de la ventana: { x, y } (un punto) o
   { x, top, bottom } (una barra: encima de su borde superior). `open` en false
   la retira con su salida. Entre un punto y el siguiente se desliza en vez de
   saltar: es la misma lectura que se mueve, no una nueva.

   No sigue al cursor: quien la usa decide a qué punto pertenece (el más
   cercano al puntero, el enfocado con las flechas). */
export function DataTip({ open = true, anchor, label, value, detail, children, hint, expanded = false, id }) {
  const caja = useRef(null);
  const ultima = useRef(anchor);
  if (open && anchor) ultima.current = anchor;
  const { mounted, leaving } = useMountedWhile(Boolean(open && anchor), SALIDA_MS);
  const ancla = ultima.current && {
    x: ultima.current.x,
    top: ultima.current.top ?? ultima.current.y,
    bottom: ultima.current.bottom ?? ultima.current.y,
  };
  const lugar = useUbicacionAnclada(caja, mounted ? ancla : null, SEPARACION_DATO, `${label}|${value}|${detail}|${hint}|${expanded}`);
  /* La primera ubicación se pinta sin deslizarse (aparece donde va); las
     siguientes se deslizan. */
  const [ubicada, setUbicada] = useState(false);
  useEffect(() => {
    if (!mounted) setUbicada(false);
    else if (lugar && !ubicada) {
      const t = requestAnimationFrame(() => setUbicada(true));
      return () => cancelAnimationFrame(t);
    }
    return undefined;
  }, [mounted, lugar, ubicada]);

  if (!mounted) return null;
  return createPortal(
    <div
      ref={caja}
      id={id}
      role="tooltip"
      className={[
        'hrl-portal hrl-datatip',
        lugar && `hrl-datatip--${lugar.lado}`,
        expanded && 'hrl-datatip--ampliada',
        ubicada && 'hrl-datatip--desliza',
        leaving && 'hrl-datatip--saliendo',
      ].filter(Boolean).join(' ')}
      style={lugar ? { transform: `translate3d(${lugar.left}px, ${lugar.top}px, 0)` } : { visibility: 'hidden' }}
    >
      <div className="hrl-datatip__caja" key={expanded ? 'ampliada' : 'breve'}>
        {label && <span className="hrl-datatip__rotulo">{label}</span>}
        {value != null && <strong className="hrl-datatip__valor">{value}</strong>}
        {detail && <span className="hrl-datatip__detalle">{detail}</span>}
        {children}
        {hint && <span className="hrl-datatip__pista">{hint}</span>}
      </div>
    </div>,
    document.body,
  );
}
