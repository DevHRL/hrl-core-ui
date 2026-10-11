import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons.jsx';
import { useExitAnimation } from './useExitAnimation.js';

/* Se monta en document.body. Dentro del panel no serviría: la animación
   `panelIn` de .hrl-content deja un transform rellenando hacia adelante, lo
   que convierte al panel en bloque contenedor y hace que `position: fixed` se
   resuelva contra él en lugar de contra la ventana. */
/* size        md (por defecto, hasta `maxWidth`) · full: ocupa la ventana, con
               cabecera y pie fijos y solo el cuerpo con desplazamiento vertical.
               Para un trabajo que necesita todo el ancho (comparar dos tablas)
               y que se recorre con los botones del pie.
   closeButton false quita la X de la esquina: el diálogo se cierra con un
               botón del pie que dice qué pasa al salir. Esc y el clic fuera
               siguen llamando a `onClose`. */
export function Dialog({ title, subtitle, onClose, maxWidth = 960, size = 'md', closeButton = true, children, footer }) {
  /* El cierre pasa por `close`, que anima la salida antes de desmontar. */
  const { leaving, close } = useExitAnimation(onClose);

  useEffect(() => {
    const alTeclear = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [close]);

  return createPortal(
    <div
      className={`hrl-portal hrl-modal-overlay${size === 'full' ? ' hrl-modal-overlay--full' : ''}${leaving ? ' hrl-modal-overlay--saliendo' : ''}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className={`hrl-modal${size === 'full' ? ' hrl-modal--full' : ''}${closeButton ? '' : ' hrl-modal--sin-cerrar'}`}
        style={size === 'full' ? undefined : { maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {closeButton && (
          <button type="button" className="hrl-iconbtn hrl-modal__cerrar" onClick={close} aria-label="Cerrar">
            <Icon name="sh-close" size={18} />
          </button>
        )}
        <div className="hrl-modal__head">
          <div style={{ minWidth: 0 }}>
            <h2 className="hrl-modal__title">{title}</h2>
            {subtitle && <p className="hrl-modal__subtitle">{subtitle}</p>}
          </div>
        </div>
        <div className="hrl-modal__body">{children}</div>
        {footer && <div className="hrl-modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
