import { Icon } from './icons.jsx';

/* Una sección de la página.

   La cabecera es una sola banda: el icono de lo que trata la sección, el
   título con su descripción, el estado (`meta`) y la acción (`actions`), en
   ese orden y a la misma altura. Antes el estado y la acción iban en filas
   propias debajo del título y dejaban un hueco largo entre ellos; y una barra
   de color junto al título marcaba cada sección sin decir nada (era verde en
   casi todas). Ahora la sección se reconoce por su icono, y el color queda
   para lo que informa: el estado.

   El título es un `h2` por defecto: va bajo el `h1` de la página (PageHeader)
   y un lector de pantalla recorre los títulos por nivel. Una tarjeta dentro de
   otra sección pide `headingLevel={3}`. El nivel no cambia el aspecto.

     icon       nombre del registro de iconos (sh-…); decorativo, va junto al título
     meta       el estado de lo que muestra la sección: insignias o chips
     actions    la acción propia de la sección, al extremo derecho
     flush      el cuerpo va de borde a borde (una tabla); la cabecera conserva su relleno
     wide       ocupa siempre el ancho completo dentro de un Mosaic
     accent     obsoleto: ya no se dibuja (ver CHANGELOG 1.10.0-redesign.4) */
export function Card({
  title = 'Sección',
  subtitle,
  total,
  icon,
  meta,
  actions,
  flush = false,
  wide = false,
  headingLevel = 2,
  children,
}) {
  const Titulo = `h${Math.min(6, Math.max(2, Number(headingLevel) || 2))}`;
  const clases = ['hrl-section', flush && 'hrl-section--flush', wide && 'hrl-section--ancha'].filter(Boolean).join(' ');

  return (
    <section className={clases}>
      <div className="hrl-section__head">
        {icon && (
          <span className="hrl-section__icono" aria-hidden="true">
            <Icon name={icon} size={16} />
          </span>
        )}
        <div className="hrl-section__textos">
          <Titulo className="hrl-section__title">
            {title}
            {total && <span className="hrl-section__total"> · {total}</span>}
          </Titulo>
          {subtitle && <p className="hrl-section__subtitle">{subtitle}</p>}
        </div>
        {meta && <div className="hrl-section__meta">{meta}</div>}
        {actions && <div className="hrl-section__acciones">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
