import { cx } from './variants.js';

/* Un interruptor de dos estados (role="switch"), con su etiqueta y una línea
   que dice cómo está. Es el mismo que el de modo oscuro del perfil, ahora como
   primitivo. Para un sí/no dentro de un formulario que se envía, `Checkbox`;
   el interruptor es para lo que se aplica al instante.

     label        lo que activa (req.)
     checked      true | false
     onChange     (booleano) => void
     description  la línea de debajo; por defecto «Activado» / «Desactivado» */
export function Switch({ label, checked = false, onChange, description, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cx('hrl-tema', checked && 'hrl-tema--on', className)}
      onClick={() => onChange?.(!checked)}
    >
      <span className="hrl-tema__texto">
        <strong>{label}</strong>
        <span>{description ?? (checked ? 'Activado' : 'Desactivado')}</span>
      </span>
      <span className="hrl-tema__palanca" aria-hidden="true">
        <span className="hrl-tema__bolita" />
      </span>
    </button>
  );
}
