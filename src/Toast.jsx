import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useExitAnimation, EXIT_MS } from './useExitAnimation.js';
import { Icon } from './icons.jsx';

/* En document.body por el mismo motivo que los modales: dentro del panel, su
   `position: fixed` se resolvía contra el panel y el aviso aparecía al pie del
   contenido en lugar de al pie de la ventana. */
export function Toast({ message, onClose, duration = 3600 }) {
  const { leaving, close } = useExitAnimation(onClose);

  /* El aviso se va solo: se descuenta la salida para que el tiempo total en
     pantalla siga siendo el pedido. */
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(close, Math.max(0, duration - EXIT_MS));
    return () => clearTimeout(t);
  }, [message, close, duration]);

  if (!message) return null;

  return createPortal(
    <div className={`hrl-portal hrl-toast${leaving ? ' hrl-toast--saliendo' : ''}`} role="status">
      <Icon name="sh-ok" size={18} style={{ color: 'var(--toast-icono)', flex: '0 0 auto' }} />
      {message}
    </div>,
    document.body,
  );
}
