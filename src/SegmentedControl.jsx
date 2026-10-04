import { useRef } from 'react';
import { cx } from './variants.js';

/* Una opción entre pocas, a la vista: un grupo de radios con aspecto de
   botones (role="radiogroup"). Sirve cuando las opciones son 2 a 5 y cortas;
   con más, `Input kind="select"`.

     label     nombre del grupo (req.): lo anuncia el lector de pantalla
     options   { value, label, ariaLabel? }[]; `label` puede ser un nodo (la
               «A» del tamaño del texto) si `ariaLabel` dice qué es
     value     el valor elegido
     onChange  (valor) => void

   Teclado: Tab entra al elegido y sale del grupo; las flechas cambian la
   elección (con salto de un extremo al otro), como un grupo de radios. */
export function SegmentedControl({ label, options = [], value, onChange, className }) {
  const refs = useRef([]);
  const indice = Math.max(0, options.findIndex((o) => o.value === value));

  const mover = (paso) => {
    const siguiente = (indice + paso + options.length) % options.length;
    onChange?.(options[siguiente].value);
    refs.current[siguiente]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('hrl-segmentos', className)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); mover(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); mover(-1); }
      }}
    >
      {options.map((o, i) => {
        const elegido = i === indice;
        return (
          <button
            key={String(o.value)}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={elegido}
            aria-label={o.ariaLabel}
            tabIndex={elegido ? 0 : -1}
            className="hrl-segmentos__opcion"
            onClick={() => onChange?.(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
