import { useId, useState } from 'react';
import { Tooltip } from './Tooltip.jsx';
import { Icon } from './icons.jsx';

export function Input({
  label = 'Campo',
  kind = 'text',
  placeholder = '',
  required = false,
  searchIcon = false,
  hint,
  info,
  error,
  options = [],
  /* Alternativa a `options` cuando el desplegable necesita encabezados:
     [{ label, options: [{ value, label }] }]. Sin esto, un panel que
     necesita <optgroup> termina escribiendo el <select> a mano. */
  groups,
  value,
  onChange,
  autoComplete,
  /* Enfoca el campo al montarse: la primera casilla de un ingreso. */
  autoFocus = false,
  disabled = false,
  /* Dentro de una tabla el nombre del campo ya lo da la cabecera de la
     columna. La etiqueta sigue existiendo para los lectores de pantalla. */
  labelHidden = false,
}) {
  const esSelect = kind === 'select';
  /* El error y la pista se asocian al control: dentro de la etiqueta formaban
     parte de su nombre, pero un lector de pantalla no los anunciaba como lo
     que son, ni marcaba el campo como inválido. */
  const base = useId();
  const idError = error ? `${base}-error` : undefined;
  const idPista = hint ? `${base}-pista` : undefined;
  const describe = [idError, idPista].filter(Boolean).join(' ') || undefined;
  const [verClave, setVerClave] = useState(false);

  /* La aclaración va en tooltip y no en `hint`: una línea extra bajo un campo
     lo hace más alto que sus vecinos y descuadra la fila de filtros. */
  const etiquetaVisible = (
    <>
      {label}
      {required && <span className="hrl-field__req">*</span>}
      {info && (
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ color: 'var(--subtle-foreground)', flex: '0 0 auto' }}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="7.8" r="1.3" fill="currentColor" />
          <path d="M12 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </>
  );

  return (
    <label className={`hrl-field${error ? ' hrl-field--error' : ''}`}>
      {info ? (
        <Tooltip title={label} body={info} as="span">
          <span className="hrl-field__label" style={{ cursor: 'help' }}>
            {etiquetaVisible}
          </span>
        </Tooltip>
      ) : (
        <span className={labelHidden ? 'hrl-oculto-visual' : 'hrl-field__label'}>{etiquetaVisible}</span>
      )}

      {esSelect ? (
        <select
          className="hrl-field__control"
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describe}
        >
          {/* Una opción es una cadena (value y label coinciden) o
              {value, label} cuando el valor guardado no es el texto visible. */}
          {options.map((o) => {
            const value = typeof o === 'string' ? o : o.value;
            const label = typeof o === 'string' ? o : o.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
          {groups?.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : (
        <span className="hrl-field__wrap">
          {searchIcon && (
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: 'var(--subtle-foreground)', flex: '0 0 auto' }} aria-hidden="true">
              <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          {/* `number` va como texto con teclado numérico y no como
              type="number": el control nativo cambia de valor con la rueda del
              ratón, y en un formulario largo eso altera una cifra al
              desplazarse sin que nadie lo note. */}
          <input
            className="hrl-field__input"
            type={kind === 'date' ? 'date' : kind === 'password' && !verClave ? 'password' : 'text'}
            inputMode={kind === 'number' ? 'decimal' : undefined}
            style={kind === 'number' ? { textAlign: 'right' } : undefined}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            aria-invalid={error ? true : undefined}
            aria-describedby={describe}
          />
          {/* Ver lo que se escribió evita errores al teclear una clave larga.
              No envía el formulario ni cambia lo escrito. */}
          {kind === 'password' && (
            <button
              type="button"
              className="hrl-field__ver"
              onClick={() => setVerClave((v) => !v)}
              aria-label={verClave ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
              aria-pressed={verClave}
              disabled={disabled}
            >
              <Icon name={verClave ? 'sh-eye-off' : 'sh-eye'} size={18} />
            </button>
          )}
        </span>
      )}

      {error && (
        <span className="hrl-field__error" id={idError}>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
            <path d="M12 7.5v6M12 16.6h0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </span>
      )}
      {hint && (
        <span className="hrl-field__hint" id={idPista}>
          {hint}
        </span>
      )}
    </label>
  );
}
