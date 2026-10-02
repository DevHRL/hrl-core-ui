import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from './Badge.jsx';
import { Icon } from './icons.jsx';
import { useExitAnimation } from './useExitAnimation.js';

export function Field({ k, v, mono }) {
  return (
    <div>
      <span className="hrl-campos__k">{k}</span>
      <span className={`hrl-campos__v${mono ? ' hrl-mono' : ''}`}>{v || '—'}</span>
    </div>
  );
}

/* Lista cronológica genérica para el panel aside del diálogo.

   Es presentación pura: recibe los elementos ya resueltos y no sabe de dónde
   salen. Quien tenga que ir a buscarlos monta su propio componente y se lo
   pasa al diálogo en `aside`. */
export function Timeline({ title, items = [], status = 'ok', empty, messages = {} }) {
  const textos = {
    loading: 'Cargando…',
    error: 'No se pudo leer la información.',
    empty: empty ?? 'Sin registros.',
    ...messages,
  };

  return (
    <div>
      <h4 className="hrl-hist__titulo">
        {title}
        {status === 'ok' && items.length > 0 && (
          <span style={{ fontWeight: 400, color: 'var(--text-disabled)', fontSize: 'var(--text-base)' }}>
            {' '}
            · {items.length.toLocaleString('es-PE')}
          </span>
        )}
      </h4>

      {status === 'loading' && <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>{textos.loading}</p>}
      {status === 'error' && <p style={{ fontSize: 'var(--text-base)', color: 'var(--danger-text)' }}>{textos.error}</p>}
      {status === 'ok' && items.length === 0 && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>{textos.empty}</p>
      )}

      {status === 'ok' && items.length > 0 && (
        <div className="hrl-hist__lista">
          {items.map((it, i) => (
            <div className="hrl-hist__fila" key={it.key ?? i} style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
              <span className="hrl-hist__fecha">{it.date}</span>
              <span className="hrl-hist__texto">{it.title}</span>
              {it.detail && <span className="hrl-hist__autor">{it.detail}</span>}
              {it.mark && <span className="hrl-hist__marca">{it.mark}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Diálogo de detalle de dos columnas: datos a la izquierda, panel libre a
   la derecha. Sin ninguna dependencia de datos ni de red. */
export function DetailDialog({
  tone,
  toneText,
  icon,
  badge,
  title,
  subtitle,
  fields,
  block,
  /* Contenido del panel derecho. El diálogo no sabe qué va ahí ni de dónde
     sale: lo monta quien lo usa. */
  aside,
  onClose,
  note,
}) {
  const { leaving, close } = useExitAnimation(onClose);

  useEffect(() => {
    const alTeclear = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [close]);

  /* Va a document.body: dentro del panel, la animación `panelIn` de
     .hrl-content deja un transform rellenando hacia adelante, y eso convierte
     al panel en block contenedor. El overlay «fijo» se resolvía entonces
     contra el panel — cubría solo el módulo y dejaba el diálogo fuera de la
     vista, muy por encima del scroll. */
  return createPortal(
    <div
      className={`hrl-portal hrl-modal-overlay${leaving ? ' hrl-modal-overlay--saliendo' : ''}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="hrl-modal" style={{ maxWidth: 1020 }} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="hrl-iconbtn hrl-modal__cerrar" onClick={close} aria-label="Cerrar">
          <Icon name="sh-close" size={18} />
        </button>
        <div className="hrl-detalle__cabecera" style={{ '--tono': tone }}>
          <span className="hrl-detalle__sello">
            <Icon name={icon} size={22} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Badge label={badge.label} tone={badge.tone} />
            <h2 className="hrl-detalle__titulo">{title}</h2>
            <p className="hrl-detalle__sub">{subtitle}</p>
          </div>
        </div>

        <div className="hrl-modal__body">
          <div className="hrl-detalle">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="hrl-campos">{fields}</div>

              <div className="hrl-bloque" style={{ '--tono': tone, '--tono-texto': toneText }}>
                <span className="hrl-bloque__titulo">{block.title}</span>
                <p>{block.text}</p>
              </div>

              {note && (
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-disabled)', lineHeight: 1.55 }}>{note}</p>
              )}
            </div>

            {aside}
          </div>
        </div>

        <div className="hrl-modal__foot">
          <button type="button" className="hrl-btn hrl-btn--ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
