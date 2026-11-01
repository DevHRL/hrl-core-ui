import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons.jsx';
import { devolverFoco as devolverFocoA } from './focus.js';
import { aliasObsoleto, PROP_ALIASES } from './deprecated.js';
import { anchoVisible } from './viewport.js';

/* Menú desplegable accesible, sin Radix.

   Cumple lo que el contrato exige de cualquier capa flotante: cierra con Esc y
   con clic exterior, devuelve el foco al trigger, navega con flechas y se
   monta en document.body para que ninguna animación con `transform` de un
   contenedor lo convierta en su bloque contenedor.

     <DropdownMenu
       trigger={<Button icon="sh-gear">Acciones</Button>}
       items={[
         { id: 'editar', label: 'Editar', icon: 'sh-doc', onSelect: () => {} },
         { separator: true },
         { id: 'borrar', label: 'Eliminar', icon: 'sh-trash', tone: 'danger', onSelect: () => {} },
       ]}
     /> */
/* `align`: right (por defecto) | left. `tone` de un ítem: danger. Los nombres en
   español anteriores se siguen aceptando (ver deprecated.js). */
const ALIGN_ALIASES = PROP_ALIASES.DropdownMenu.align;
const TONE_ALIASES = PROP_ALIASES.DropdownMenu.itemTone;

const MARGEN = 8;
const HUECO = 6;
/* Alto mínimo que se le respeta a un menú acotado: por debajo de esto no es
   utilizable y es mejor dejar que rebose un poco que reducirlo a una ranura. */
const ALTO_MINIMO = 120;

export function DropdownMenu({ trigger, items = [], align: alineacionPedida = 'right', label = 'Menú de acciones' }) {
  const align = aliasObsoleto(ALIGN_ALIASES, alineacionPedida, 'DropdownMenu');
  const [abierto, setAbierto] = useState(false);
  /* `ancla` es el rectángulo del disparador al abrir; `colocacion` es dónde
     queda el menú una vez medido (ver el efecto de más abajo). */
  const [ancla, setAncla] = useState(null);
  const [colocacion, setColocacion] = useState(null);
  const [activo, setActivo] = useState(-1);
  const refDisparador = useRef(null);
  const refMenu = useRef(null);
  const id = useId();

  const seleccionables = items.filter((i) => !i.separator && !i.disabled);

  const cerrar = useCallback((conFoco = true) => {
    setAbierto(false);
    setActivo(-1);
    if (conFoco) devolverFocoA(refDisparador.current?.querySelector('button, a, [tabindex]') ?? refDisparador.current);
  }, []);

  const abrir = () => {
    const r = refDisparador.current?.getBoundingClientRect();
    if (!r) return;
    setAncla({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
    setColocacion(null);
    setAbierto(true);
  };

  /* El tamaño real del menú solo se conoce una vez montado, así que se coloca
     en un layout effect: corre antes de pintar y no hay parpadeo (mientras
     tanto va oculto). Se abre debajo del disparador si cabe; si no, encima; y se
     acota a la ventana en los dos ejes. Sin esto salía fuera de pantalla junto a
     cualquier borde. */
  useLayoutEffect(() => {
    const menu = refMenu.current;
    if (!abierto || !ancla || !menu) return;

    const ancho = menu.offsetWidth;
    const alto = menu.scrollHeight + menu.offsetHeight - menu.clientHeight;
    const visibleAncho = anchoVisible();
    const visibleAlto = window.innerHeight;

    const abajo = visibleAlto - ancla.bottom - HUECO - MARGEN;
    const arriba = ancla.top - HUECO - MARGEN;
    const haciaAbajo = alto <= abajo || abajo >= arriba;
    const disponible = Math.max(haciaAbajo ? abajo : arriba, ALTO_MINIMO);
    const altoFinal = Math.min(alto, disponible);

    /* `max-height` es del contenido: si el menú es content-box hay que restarle
       el relleno y el borde, o el menú acotado rebasa por esa diferencia. */
    const estilo = getComputedStyle(menu);
    const marco = estilo.boxSizing === 'border-box' ? 0
      : parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom) + parseFloat(estilo.borderTopWidth) + parseFloat(estilo.borderBottomWidth);

    const izquierda = align === 'right' ? ancla.right - ancho : ancla.left;
    setColocacion({
      top: haciaAbajo ? ancla.bottom + HUECO : ancla.top - HUECO - altoFinal,
      left: Math.min(Math.max(izquierda, MARGEN), Math.max(visibleAncho - ancho - MARGEN, MARGEN)),
      maxHeight: altoFinal < alto ? altoFinal - marco : undefined,
      haciaAbajo,
    });
  }, [abierto, ancla, align, items.length]);

  useEffect(() => {
    if (!abierto) return undefined;

    const alTeclear = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        cerrar();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActivo((v) => (v + 1) % seleccionables.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActivo((v) => (v <= 0 ? seleccionables.length - 1 : v - 1));
      } else if (e.key === 'Tab') {
        cerrar(false);
      }
    };

    const alPulsarFuera = (e) => {
      if (refMenu.current?.contains(e.target) || refDisparador.current?.contains(e.target)) return;
      cerrar(false);
    };

    /* Cerrar al desplazar es más honesto que quedarse pegado a un punto que
       ya no corresponde al trigger. */
    const alMover = () => cerrar(false);

    window.addEventListener('keydown', alTeclear, true);
    window.addEventListener('mousedown', alPulsarFuera);
    window.addEventListener('scroll', alMover, true);
    window.addEventListener('resize', alMover);
    return () => {
      window.removeEventListener('keydown', alTeclear, true);
      window.removeEventListener('mousedown', alPulsarFuera);
      window.removeEventListener('scroll', alMover, true);
      window.removeEventListener('resize', alMover);
    };
  }, [abierto, cerrar, seleccionables.length]);

  /* Solo con el menú ya colocado: mientras se mide va oculto, y un elemento
     oculto no admite foco (abrir con ↓ perdería el foco en el primer ítem). */
  useEffect(() => {
    if (abierto && colocacion && activo >= 0) {
      refMenu.current?.querySelectorAll('[role="menuitem"]')[activo]?.focus();
    }
  }, [abierto, colocacion, activo]);

  return (
    <>
      <span
        ref={refDisparador}
        onClick={() => (abierto ? cerrar() : abrir())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !abierto) {
            e.preventDefault();
            abrir();
            setActivo(0);
          }
        }}
        style={{ display: 'inline-flex' }}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? id : undefined}
      >
        {trigger}
      </span>

      {abierto &&
        ancla &&
        createPortal(
          <div
            id={id}
            ref={refMenu}
            className={`hrl-portal hrl-menu${colocacion?.haciaAbajo === false ? ' hrl-menu--arriba' : ''}`}
            role="menu"
            aria-label={label}
            style={{
              top: colocacion?.top ?? 0,
              left: colocacion?.left ?? 0,
              maxHeight: colocacion?.maxHeight,
              visibility: colocacion ? undefined : 'hidden',
            }}
          >
            {items.map((item, i) =>
              item.separator ? (
                <span key={`sep-${i}`} className="hrl-menu__separador" role="separator" />
              ) : (
                <button
                  key={item.id ?? item.label}
                  type="button"
                  role="menuitem"
                  className={`hrl-menu__item${aliasObsoleto(TONE_ALIASES, item.tone, 'DropdownMenu') === 'danger' ? ' hrl-menu__item--peligro' : ''}`}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onSelect?.();
                    cerrar();
                  }}
                >
                  {item.icon && <Icon name={item.icon} size={16} />}
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.shortcut && <span className="hrl-menu__atajo">{item.shortcut}</span>}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
