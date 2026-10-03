import { variants } from './variants.js';
import { Icon } from './icons.jsx';
import { aliasObsoleto, PROP_ALIASES } from './deprecated.js';

/* Botón del sistema. Único punto de entrada: en la aplicación no se escribe
   <button> a mano (ver design.md).

   - `tone`   cta | blue | ghost | danger | plain | link
              `link` es la acción que se lee como enlace dentro de un texto o de
              una celda (abrir un registro): sin él, cada aplicación escribía su
              propio <button> con aspecto de enlace.
   - `size` md (40px, objetivo táctil mínimo) | sm
   - `icon`  nombre del registro de iconos, a la izquierda del texto
   - `loading` bloquea el botón y sustituye el texto por el de `loadingText` */
const clase = variants(
  'hrl-btn',
  {
    tone: {
      cta: 'hrl-btn--cta',
      blue: 'hrl-btn--blue',
      ghost: 'hrl-btn--ghost',
      danger: 'hrl-btn--peligro',
      plain: '',
      link: 'hrl-btn--enlace',
    },
    size: { md: '', sm: 'hrl-btn--mini' },
  },
  { tone: 'cta', size: 'md' },
);

export function Button({
  tone = 'cta',
  size = 'md',
  icon,
  loading = false,
  loadingText = 'Procesando…',
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={clase({ tone, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 16} />}
      {loading ? loadingText : children}
    </button>
  );
}

/* Botón de solo icono. Obliga a `aria-label` porque no tiene texto. */
/* `tone` de IconButton: plain (por defecto) | action. Los nombres en español
   anteriores se siguen aceptando (ver deprecated.js). */
const TONE_ALIASES = PROP_ALIASES.IconButton.tone;

export function IconButton({ icon, 'aria-label': label, tone: tonoPedido = 'plain', className, ...rest }) {
  const tone = aliasObsoleto(TONE_ALIASES, tonoPedido, 'IconButton');
  if (!label && import.meta.env?.DEV) {
    console.warn('IconButton sin aria-label: un botón sin texto necesita nombre accesible.');
  }
  return (
    <button
      type="button"
      className={`hrl-iconbtn${tone === 'action' ? ' hrl-accion' : ''}${className ? ` ${className}` : ''}`}
      aria-label={label}
      {...rest}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
