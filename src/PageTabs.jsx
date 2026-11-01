import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from './Tooltip.jsx';

/* Las vistas de una pantalla, en la píldora del centro de la barra superior.

   La barra es del AppShell, pero las vistas (los formatos de una remisión, el
   área de un consolidado) dependen del estado de la pantalla abierta, que vive
   más abajo en el árbol. Como PageActions, la pantalla las declara donde tiene
   su estado y se dibujan arriba, por un portal. Si la pantalla no tiene vistas,
   el centro de la barra queda libre.

     <PageTabs
       label="Formatos de la remisión"
       tabs={[{ key: 'si', label: 'Servicios intermedios' }, …]}
       active={pestana}
       onChange={setPestana}
     />

   `alerts` es { key: texto }: un punto junto a la vista que tiene algo que
   avisar, con el texto en su tooltip (como en Tabs). */
export const PAGE_TABS_ID = 'hrl-vistas-pagina';

/* La píldora en sí. La usan PageTabs y el AppShell (con `tabs`), para que las
   vistas se vean igual vengan de donde vengan. Con muchas vistas se desplaza de
   lado, y la activa se trae a la parte visible. */
export function TabsPill({ items, active, onSelect, label, current = 'true', alerts = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const nav = ref.current;
    const activa = nav?.querySelector('[aria-current]');
    if (!activa || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = activa.offsetLeft - (nav.clientWidth - activa.offsetWidth) / 2;
  }, [active]);

  return (
    <nav className="hrl-vistas" ref={ref} aria-label={label}>
      {items.map((v) => {
        const activa = v.key === active;
        const Etiqueta = v.href ? 'a' : 'button';
        const aviso = !activa ? alerts[v.key] : null;
        return (
          <Etiqueta
            key={v.key}
            type={v.href ? undefined : 'button'}
            href={v.href}
            className={`hrl-vistas__item${activa ? ' hrl-vistas__item--on' : ''}`}
            aria-current={activa ? current : undefined}
            onClick={() => onSelect?.(v.key)}
          >
            {v.label}
            {aviso && (
              <Tooltip title="Requiere atención" body={aviso} focusable={false}>
                <span className="hrl-punto-vivo" role="img" aria-label={`Requiere atención: ${aviso}`} />
              </Tooltip>
            )}
          </Etiqueta>
        );
      })}
    </nav>
  );
}

export function PageTabs({ tabs = [], active, onChange, label = 'Vistas de la pantalla', alerts }) {
  /* El destino se busca tras montar: durante el primer render del árbol la
     barra todavía no está en el DOM. */
  const [destino, setDestino] = useState(null);
  useEffect(() => {
    setDestino(document.getElementById(PAGE_TABS_ID));
  }, []);

  if (!destino || tabs.length < 2) return null;
  return createPortal(<TabsPill items={tabs} active={active} onSelect={onChange} label={label} alerts={alerts} />, destino);
}
