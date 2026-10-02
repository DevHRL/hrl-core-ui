import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons.jsx';
import { useExitAnimation } from './useExitAnimation.js';

/* Se monta en document.body. Dentro del panel no serviría: la animación
   `panelIn` de .hrl-content deja un transform rellenando hacia adelante, lo
   que convierte al panel en bloque contenedor y hace que `position: fixed` se
   resuelva contra él en lugar de contra la ventana. */
export function Dialog({ title, subtitle, onClose, maxWidth = 960, children, footer }) {
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
      className={`hrl-portal hrl-modal-overlay${leaving ? ' hrl-modal-overlay--saliendo' : ''}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="hrl-modal" style={{ maxWidth }} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="hrl-iconbtn hrl-modal__cerrar" onClick={close} aria-label="Cerrar">
          <Icon name="sh-close" size={18} />
        </button>
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
